import { db } from '../db';
import { watchlists, watchlistMovies, movies } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class WatchlistService {
	async findById(id: number) {
		const watchlist = await db.query.watchlists.findFirst({
			where: eq(watchlists.id, id),
		});
		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}
		return watchlist;
	}

	async findByUserId(
		userId: number,
		{ limit = 10, offset = 0 }: { limit?: number; offset?: number }
	) {
		return await db.query.watchlists.findMany({
			where: eq(watchlists.userId, userId),
			limit,
			offset,
			orderBy: [desc(watchlists.createdAt)],
		});
	}

	async create(input: {
		userId: number;
		name: string;
		description?: string;
		isPublic?: boolean;
	}) {
		const [watchlist] = await db.insert(watchlists).values(input).returning();
		return watchlist;
	}

	async update(
		id: number,
		input: {
			name?: string;
			description?: string;
			isPublic?: boolean;
		}
	) {
		const [watchlist] = await db
			.update(watchlists)
			.set(input)
			.where(eq(watchlists.id, id))
			.returning();

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		return watchlist;
	}

	async delete(id: number) {
		const [watchlist] = await db
			.delete(watchlists)
			.where(eq(watchlists.id, id))
			.returning();

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		return true;
	}

	async getMovies(
		watchlistId: number,
		{ limit = 10, offset = 0 }: { limit?: number; offset?: number }
	) {
		return await db.query.movies.findMany({
			where: eq(watchlistMovies.watchlistId, watchlistId),
			limit,
			offset,
			orderBy: [desc(watchlistMovies.createdAt)],
		});
	}

	async addMovie(watchlistId: number, movieId: number) {
		// Check if watchlist exists
		const watchlist = await this.findById(watchlistId);

		// Add movie to watchlist
		await db.insert(watchlistMovies).values({
			watchlistId,
			movieId,
		});

		// Return updated watchlist
		return await this.findById(watchlistId);
	}

	async removeMovie(watchlistId: number, movieId: number) {
		// Check if watchlist exists
		const watchlist = await this.findById(watchlistId);

		// Remove movie from watchlist
		const [deleted] = await db
			.delete(watchlistMovies)
			.where(
				and(
					eq(watchlistMovies.watchlistId, watchlistId),
					eq(watchlistMovies.movieId, movieId)
				)
			)
			.returning();

		if (!deleted) {
			throw new NotFoundError('Movie not found in watchlist');
		}

		// Return updated watchlist
		return await this.findById(watchlistId);
	}

	async getMovieCount(watchlistId: number) {
		const result = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, watchlistId))
			.get();

		return result?.count ?? 0;
	}
}
