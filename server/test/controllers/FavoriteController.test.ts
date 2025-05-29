import supertest from 'supertest';
import { createTestApp } from '../test-app';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie } from '../utils';
import { eq, and } from 'drizzle-orm';

describe('FavoriteController', () => {
	const app = createTestApp();
	const request = supertest(app);
	let authToken: string;
	let userId: number;
	let movieId: number;

	beforeAll(async () => {
		await setupTestDatabase();
		// Create test user
		const { user, token } = await createTestUser();
		authToken = token;
		userId = user.id;

		// Create a test movie
		const movie = await createTestMovie(
			{ title: 'Favorite Test Movie' },
			userId
		);
		movieId = movie.id;
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear favorites before each test
		await db.delete(schema.favorites);
	});

	describe('POST /api/favorites', () => {
		it('should add a movie to favorites', async () => {
			const favoriteData = {
				movieId,
			};

			const response = await request
				.post('/api/favorites')
				.set('Authorization', `Bearer ${authToken}`)
				.send(favoriteData);

			expect(response.status).toBe(201);
			expect(response.body.message).toBe('Movie added to favorites');
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data).toHaveProperty('userId', userId);
			expect(response.body.data).toHaveProperty('movieId', movieId);

			// Check database
			const favorites = await db.select().from(schema.favorites);
			expect(favorites.length).toBe(1);
			expect(favorites[0].movieId).toBe(movieId);
			expect(favorites[0].userId).toBe(userId);
		});

		it('should return 400 if movie is already in favorites', async () => {
			// Add movie to favorites first
			await db.insert(schema.favorites).values({
				userId,
				movieId,
			});

			// Try to add it again
			const response = await request
				.post('/api/favorites')
				.set('Authorization', `Bearer ${authToken}`)
				.send({ movieId });

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('should return 400 if required fields are missing', async () => {
			const response = await request
				.post('/api/favorites')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					// Missing movieId
				});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('should return 401 if not authenticated', async () => {
			const response = await request.post('/api/favorites').send({
				movieId,
			});

			expect(response.status).toBe(401);
		});
	});

	describe('GET /api/favorites', () => {
		beforeEach(async () => {
			// Create test movies and add to favorites
			const movie1 = await createTestMovie(
				{ title: 'Favorite Movie 1' },
				userId
			);
			const movie2 = await createTestMovie(
				{ title: 'Favorite Movie 2' },
				userId
			);

			await db.insert(schema.favorites).values([
				{ userId, movieId: movie1.id },
				{ userId, movieId: movie2.id },
				{ userId, movieId },
			]);
		});

		it('should get all favorite movies for the user', async () => {
			const response = await request
				.get('/api/favorites')
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBe(3);

			// Verify that we get movie details
			expect(response.body.data[0]).toHaveProperty('id');
			expect(response.body.data[0]).toHaveProperty('title');
			expect(response.body.data[0]).toHaveProperty('tmdbId');
		});

		it('should return 401 if not authenticated', async () => {
			const response = await request.get('/api/favorites');

			expect(response.status).toBe(401);
		});
	});

	describe('DELETE /api/favorites/:movieId', () => {
		beforeEach(async () => {
			// Add movie to favorites
			await db.insert(schema.favorites).values({
				userId,
				movieId,
			});
		});

		it('should remove a movie from favorites', async () => {
			const response = await request
				.delete(`/api/favorites/${movieId}`)
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Movie removed from favorites');

			// Check database
			const favorites = await db
				.select()
				.from(schema.favorites)
				.where(
					and(
						eq(schema.favorites.userId, userId),
						eq(schema.favorites.movieId, movieId)
					)
				);
			expect(favorites.length).toBe(0);
		});

		it('should return 404 if movie is not in favorites', async () => {
			// Use a non-existent movie ID
			const nonExistentMovieId = 99999;

			const response = await request
				.delete(`/api/favorites/${nonExistentMovieId}`)
				.set('Authorization', `Bearer ${authToken}`);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty('error');
		});

		it('should return 401 if not authenticated', async () => {
			const response = await request.delete(`/api/favorites/${movieId}`);

			expect(response.status).toBe(401);
		});
	});
});
