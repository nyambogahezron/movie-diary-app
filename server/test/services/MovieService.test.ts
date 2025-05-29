import { MovieService } from '../../services/MovieService';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { createTestUser } from '../utils';
import { eq } from 'drizzle-orm';

describe('MovieService', () => {
	let userId: number;

	beforeAll(async () => {
		await setupTestDatabase();
		// Create a test user
		const { user } = await createTestUser();
		userId = user.id;
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear movies before each test
		await db.delete(schema.movies);
	});

	describe('createMovie', () => {
		it('should create a new movie and return it', async () => {
			const movieData = {
				title: 'Test Movie',
				tmdbId: '12345',
				posterPath: '/test/poster.jpg',
				releaseDate: '2023-01-01',
				overview: 'Test overview',
				genres: JSON.stringify(['Action', 'Drama']),
			};

			const result = await MovieService.createMovie({
				...movieData,
				userId,
			});

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('title', movieData.title);
			expect(result).toHaveProperty('tmdbId', movieData.tmdbId);
			expect(result).toHaveProperty('posterPath', movieData.posterPath);

			// Check database
			const movies = await db.select().from(schema.movies);
			expect(movies.length).toBe(1);
			expect(movies[0].title).toBe(movieData.title);
			expect(movies[0].userId).toBe(userId);
		});
	});

	describe('getMoviesByUserId', () => {
		beforeEach(async () => {
			// Create test movies
			await db.insert(schema.movies).values([
				{
					title: 'Movie 1',
					tmdbId: '111',
					userId,
				},
				{
					title: 'Movie 2',
					tmdbId: '222',
					userId,
				},
				{
					title: 'Movie 3',
					tmdbId: '333',
					userId: 999, // Different user
				},
			]);
		});

		it('should return only movies for the specified user', async () => {
			const movies = await MovieService.getMoviesByUserId(userId);

			expect(movies).toBeInstanceOf(Array);
			expect(movies.length).toBe(2);
			expect(movies[0]).toHaveProperty('title');
			expect(movies.map((m) => m.title)).toContain('Movie 1');
			expect(movies.map((m) => m.title)).toContain('Movie 2');
			expect(movies.map((m) => m.title)).not.toContain('Movie 3');
		});
	});

	describe('getMovieById', () => {
		let movieId: number;

		beforeEach(async () => {
			// Create a test movie
			const result = await db
				.insert(schema.movies)
				.values({
					title: 'Get By ID Movie',
					tmdbId: '12345',
					userId,
				})
				.returning();

			movieId = result[0].id;
		});

		it('should return movie when valid ID is provided', async () => {
			const movie = await MovieService.getMovieById(movieId);

			expect(movie).toHaveProperty('id', movieId);
			expect(movie).toHaveProperty('title', 'Get By ID Movie');
		});

		it('should return null when movie does not exist', async () => {
			const movie = await MovieService.getMovieById(9999);
			expect(movie).toBeNull();
		});
	});

	describe('updateMovie', () => {
		let movieId: number;

		beforeEach(async () => {
			// Create a test movie
			const result = await db
				.insert(schema.movies)
				.values({
					title: 'Original Title',
					tmdbId: '12345',
					overview: 'Original overview',
					userId,
				})
				.returning();

			movieId = result[0].id;
		});

		it('should update movie and return updated data', async () => {
			const updateData = {
				title: 'Updated Title',
				rating: 5,
				review: 'Great movie!',
			};

			const result = await MovieService.updateMovie(movieId, updateData);

			expect(result).toHaveProperty('id', movieId);
			expect(result).toHaveProperty('title', updateData.title);
			expect(result).toHaveProperty('rating', updateData.rating);
			expect(result).toHaveProperty('review', updateData.review);
			expect(result).toHaveProperty('tmdbId', '12345'); // Unchanged field

			// Check database
			const movies = await db
				.select()
				.from(schema.movies)
				.where(eq(schema.movies.id, movieId));

			expect(movies[0].title).toBe(updateData.title);
			expect(movies[0].rating).toBe(updateData.rating);
		});

		it('should return null when movie does not exist', async () => {
			const result = await MovieService.updateMovie(9999, {
				title: 'Updated Title',
			});
			expect(result).toBeNull();
		});
	});

	describe('deleteMovie', () => {
		let movieId: number;

		beforeEach(async () => {
			// Create a test movie
			const result = await db
				.insert(schema.movies)
				.values({
					title: 'Delete Me',
					tmdbId: '12345',
					userId,
				})
				.returning();

			movieId = result[0].id;
		});

		it('should delete movie and return success', async () => {
			const success = await MovieService.deleteMovie(movieId);

			expect(success).toBe(true);

			// Check database
			const movies = await db
				.select()
				.from(schema.movies)
				.where(eq(schema.movies.id, movieId));

			expect(movies.length).toBe(0);
		});

		it('should return false when movie does not exist', async () => {
			const success = await MovieService.deleteMovie(9999);
			expect(success).toBe(false);
		});
	});
});
