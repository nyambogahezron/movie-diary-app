import { WatchlistMovieService } from '../../services/WatchlistMovieService';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { createTestUser, createTestMovie, createTestWatchlist } from '../utils';
import { eq, and } from 'drizzle-orm';

describe('WatchlistMovieService', () => {
	let userId: number;
	let watchlistId: number;
	let movieId: number;

	beforeAll(async () => {
		await setupTestDatabase();
		// Create test user, watchlist and movie
		const { user } = await createTestUser();
		userId = user.id;

		const watchlist = await createTestWatchlist(
			{ name: 'Test Watchlist' },
			userId
		);
		watchlistId = watchlist.id;

		const movie = await createTestMovie({ title: 'Test Movie' }, userId);
		movieId = movie.id;
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear watchlist movies before each test
		await db.delete(schema.watchlistMovies);
	});

	describe('addMovieToWatchlist', () => {
		it('should add a movie to watchlist and return it', async () => {
			const result = await WatchlistMovieService.addMovieToWatchlist(
				watchlistId,
				movieId
			);

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('watchlistId', watchlistId);
			expect(result).toHaveProperty('movieId', movieId);

			// Check database
			const watchlistMovies = await db.select().from(schema.watchlistMovies);
			expect(watchlistMovies.length).toBe(1);
			expect(watchlistMovies[0].watchlistId).toBe(watchlistId);
			expect(watchlistMovies[0].movieId).toBe(movieId);
		});

		it('should throw error if movie is already in watchlist', async () => {
			// First add the movie to watchlist
			await db.insert(schema.watchlistMovies).values({
				watchlistId,
				movieId,
			});

			// Try to add it again
			await expect(
				WatchlistMovieService.addMovieToWatchlist(watchlistId, movieId)
			).rejects.toThrow('Movie already in watchlist');
		});

		it('should throw error if watchlist does not exist', async () => {
			const nonExistentWatchlistId = 9999;

			await expect(
				WatchlistMovieService.addMovieToWatchlist(
					nonExistentWatchlistId,
					movieId
				)
			).rejects.toThrow('Watchlist not found');
		});
	});

	describe('getMoviesByWatchlistId', () => {
		beforeEach(async () => {
			// Create test movies
			const movie1 = await createTestMovie(
				{ title: 'Watchlist Movie 1' },
				userId
			);
			const movie2 = await createTestMovie(
				{ title: 'Watchlist Movie 2' },
				userId
			);

			// Create another watchlist
			const otherWatchlist = await createTestWatchlist(
				{ name: 'Other Watchlist' },
				userId
			);

			// Add movies to watchlists
			await db.insert(schema.watchlistMovies).values([
				{ watchlistId, movieId: movie1.id },
				{ watchlistId, movieId: movie2.id },
				{ watchlistId: otherWatchlist.id, movieId }, // Different watchlist
			]);
		});

		it('should return movies for the specified watchlist', async () => {
			const movies = await WatchlistMovieService.getMoviesByWatchlistId(
				watchlistId
			);

			expect(movies).toBeInstanceOf(Array);
			expect(movies.length).toBe(2);
			expect(movies[0]).toHaveProperty('title');
			expect(movies.map((m) => m.title)).toContain('Watchlist Movie 1');
			expect(movies.map((m) => m.title)).toContain('Watchlist Movie 2');
			expect(movies.map((m) => m.title)).not.toContain('Test Movie');
		});

		it('should throw error if watchlist does not exist', async () => {
			const nonExistentWatchlistId = 9999;

			await expect(
				WatchlistMovieService.getMoviesByWatchlistId(nonExistentWatchlistId)
			).rejects.toThrow('Watchlist not found');
		});
	});

	describe('isMovieInWatchlist', () => {
		beforeEach(async () => {
			// Add movie to watchlist
			await db.insert(schema.watchlistMovies).values({
				watchlistId,
				movieId,
			});
		});

		it('should return true if movie is in watchlist', async () => {
			const result = await WatchlistMovieService.isMovieInWatchlist(
				watchlistId,
				movieId
			);
			expect(result).toBe(true);
		});

		it('should return false if movie is not in watchlist', async () => {
			const nonExistentMovieId = 9999;
			const result = await WatchlistMovieService.isMovieInWatchlist(
				watchlistId,
				nonExistentMovieId
			);
			expect(result).toBe(false);
		});
	});

	describe('removeMovieFromWatchlist', () => {
		beforeEach(async () => {
			// Add movie to watchlist
			await db.insert(schema.watchlistMovies).values({
				watchlistId,
				movieId,
			});
		});

		it('should remove movie from watchlist and return success', async () => {
			const success = await WatchlistMovieService.removeMovieFromWatchlist(
				watchlistId,
				movieId
			);

			expect(success).toBe(true);

			// Check database
			const watchlistMovies = await db
				.select()
				.from(schema.watchlistMovies)
				.where(
					and(
						eq(schema.watchlistMovies.watchlistId, watchlistId),
						eq(schema.watchlistMovies.movieId, movieId)
					)
				);

			expect(watchlistMovies.length).toBe(0);
		});

		it('should return false when watchlist-movie relationship does not exist', async () => {
			const nonExistentMovieId = 9999;
			const success = await WatchlistMovieService.removeMovieFromWatchlist(
				watchlistId,
				nonExistentMovieId
			);
			expect(success).toBe(false);
		});

		it('should throw error if watchlist does not exist', async () => {
			const nonExistentWatchlistId = 9999;

			await expect(
				WatchlistMovieService.removeMovieFromWatchlist(
					nonExistentWatchlistId,
					movieId
				)
			).rejects.toThrow('Watchlist not found');
		});
	});
});
