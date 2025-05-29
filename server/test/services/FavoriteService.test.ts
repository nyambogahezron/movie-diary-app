import { FavoriteService } from '../../services/FavoriteService';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { createTestUser, createTestMovie } from '../utils';
import { eq, and } from 'drizzle-orm';

describe('FavoriteService', () => {
	let userId: number;
	let movieId: number;

	beforeAll(async () => {
		await setupTestDatabase();
		// Create a test user and movie
		const { user } = await createTestUser();
		userId = user.id;

		const movie = await createTestMovie({ title: 'Test Movie' }, userId);
		movieId = movie.id;
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear favorites before each test
		await db.delete(schema.favorites);
	});

	describe('addFavorite', () => {
		it('should add a movie to favorites and return it', async () => {
			const result = await FavoriteService.addFavorite(userId, movieId);

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('userId', userId);
			expect(result).toHaveProperty('movieId', movieId);

			// Check database
			const favorites = await db.select().from(schema.favorites);
			expect(favorites.length).toBe(1);
			expect(favorites[0].userId).toBe(userId);
			expect(favorites[0].movieId).toBe(movieId);
		});

		it('should throw error if movie is already in favorites', async () => {
			// First add the movie to favorites
			await db.insert(schema.favorites).values({
				userId,
				movieId,
			});

			// Try to add it again
			await expect(
				FavoriteService.addFavorite(userId, movieId)
			).rejects.toThrow('Movie already in favorites');
		});
	});

	describe('getFavoriteMoviesByUserId', () => {
		beforeEach(async () => {
			// Create test movies
			const movie1 = await createTestMovie(
				{ title: 'Favorite Movie 1' },
				userId
			);
			const movie2 = await createTestMovie(
				{ title: 'Favorite Movie 2' },
				userId
			);
			const movie3 = await createTestMovie({ title: 'Not Favorite', userId });

			// Add movies to favorites
			await db.insert(schema.favorites).values([
				{ userId, movieId: movie1.id },
				{ userId, movieId: movie2.id },
				{ userId: 999, movieId: movie3.id }, // Different user's favorite
			]);
		});

		it('should return favorite movies for the specified user', async () => {
			const movies = await FavoriteService.getFavoriteMoviesByUserId(userId);

			expect(movies).toBeInstanceOf(Array);
			expect(movies.length).toBe(2);
			expect(movies[0]).toHaveProperty('title');
			expect(movies.map((m) => m.title)).toContain('Favorite Movie 1');
			expect(movies.map((m) => m.title)).toContain('Favorite Movie 2');
			expect(movies.map((m) => m.title)).not.toContain('Not Favorite');
		});
	});

	describe('isFavorite', () => {
		beforeEach(async () => {
			// Add movie to favorites
			await db.insert(schema.favorites).values({
				userId,
				movieId,
			});
		});

		it('should return true if movie is in favorites', async () => {
			const result = await FavoriteService.isFavorite(userId, movieId);
			expect(result).toBe(true);
		});

		it('should return false if movie is not in favorites', async () => {
			const nonExistentMovieId = 9999;
			const result = await FavoriteService.isFavorite(
				userId,
				nonExistentMovieId
			);
			expect(result).toBe(false);
		});
	});

	describe('removeFavorite', () => {
		beforeEach(async () => {
			// Add movie to favorites
			await db.insert(schema.favorites).values({
				userId,
				movieId,
			});
		});

		it('should remove movie from favorites and return success', async () => {
			const success = await FavoriteService.removeFavorite(userId, movieId);

			expect(success).toBe(true);

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

		it('should return false when favorite does not exist', async () => {
			const nonExistentMovieId = 9999;
			const success = await FavoriteService.removeFavorite(
				userId,
				nonExistentMovieId
			);
			expect(success).toBe(false);
		});
	});
});
