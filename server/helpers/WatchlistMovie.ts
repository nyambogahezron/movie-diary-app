import { db } from '../db';
import { watchlistMovies, watchlists, movies } from '../db/schema';
import { eq, and, asc, desc, like, SQL } from 'drizzle-orm';
import {
	WatchlistMovie as WatchlistMovieType,
	Movie as MovieType,
} from '../types';
import { SearchInput } from '../types';

export class WatchlistMovie {
	static async create(data: {
		watchlistId: number;
		movieId: number;
	}): Promise<WatchlistMovieType> {
		// Check if the movie is already in the watchlist
		const existingEntry = await db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, data.watchlistId))
			.where(eq(watchlistMovies.movieId, data.movieId));

		if (existingEntry.length > 0) {
			throw new Error('Movie is already in the watchlist');
		}

		// Add the movie to the watchlist
		const result = await db
			.insert(watchlistMovies)
			.values({
				watchlistId: data.watchlistId,
				movieId: data.movieId,
			})
			.returning();

		// Update the watchlist's updatedAt timestamp
		await db
			.update(watchlists)
			.set({
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, data.watchlistId));

		return result[0] as unknown as WatchlistMovieType;
	}

	static async findById(id: number): Promise<WatchlistMovieType | undefined> {
		const result = await db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.id, id));

		return result[0] as unknown as WatchlistMovieType;
	}

	static async findByWatchlistId(
		watchlistId: number,
		params?: SearchInput
	): Promise<WatchlistMovieType[]> {
		let query = db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, watchlistId));

		// Add sorting if provided
		if (params?.sortBy) {
			const sortColumn = params.sortBy as keyof typeof watchlistMovies;
			if (sortColumn in watchlistMovies) {
				if (params.sortOrder === 'desc') {
					query = query.orderBy(
						desc(watchlistMovies[sortColumn] as SQL<unknown>)
					);
				} else {
					query = query.orderBy(
						asc(watchlistMovies[sortColumn] as SQL<unknown>)
					);
				}
			}
		} else {
			// Default sort by createdAt desc
			query = query.orderBy(asc(watchlistMovies.createdAt));
		}

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result as unknown as WatchlistMovieType[];
	}

	static async findByMovieId(movieId: number): Promise<WatchlistMovieType[]> {
		const result = await db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.movieId, movieId));

		return result as unknown as WatchlistMovieType[];
	}

	static async findByWatchlistIdAndMovieId(
		watchlistId: number,
		movieId: number
	): Promise<WatchlistMovieType | undefined> {
		const result = await db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, watchlistId))
			.where(eq(watchlistMovies.movieId, movieId));

		return result[0] as unknown as WatchlistMovieType;
	}

	static async getMoviesByWatchlistId(
		watchlistId: number,
		params?: SearchInput
	): Promise<MovieType[]> {
		let query = db
			.select({
				movie: movies,
			})
			.from(watchlistMovies)
			.innerJoin(movies, eq(watchlistMovies.movieId, movies.id))
			.where(eq(watchlistMovies.watchlistId, watchlistId));

		// Add search if provided
		if (params?.search) {
			query = query.where(like(movies.title, `%${params.search}%`));
		}

		// Add sorting if provided
		if (params?.sortBy) {
			const sortColumn = params.sortBy as keyof typeof movies;
			if (sortColumn in movies) {
				if (params.sortOrder === 'desc') {
					query = query.orderBy(desc(movies[sortColumn] as SQL<unknown>));
				} else {
					query = query.orderBy(asc(movies[sortColumn] as SQL<unknown>));
				}
			}
		} else {
			// Default sort by title asc
			query = query.orderBy(asc(movies.title));
		}

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result.map((r) => r.movie) as unknown as MovieType[];
	}

	static async delete(id: number): Promise<void> {
		const entry = await this.findById(id);
		if (!entry) {
			throw new Error('WatchlistMovie not found');
		}

		await db.delete(watchlistMovies).where(eq(watchlistMovies.id, id));

		// Update the watchlist's updatedAt timestamp
		await db
			.update(watchlists)
			.set({
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, entry.watchlistId));
	}

	static async deleteByWatchlistIdAndMovieId(
		watchlistId: number,
		movieId: number
	): Promise<void> {
		await db
			.delete(watchlistMovies)
			.where(
				and(
					eq(watchlistMovies.watchlistId, watchlistId),
					eq(watchlistMovies.movieId, movieId)
				)
			);

		// Update the watchlist's updatedAt timestamp
		await db
			.update(watchlists)
			.set({
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, watchlistId));
	}

	static async deleteAllByWatchlistId(watchlistId: number): Promise<void> {
		await db
			.delete(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, watchlistId));

		// Update the watchlist's updatedAt timestamp
		await db
			.update(watchlists)
			.set({
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, watchlistId));
	}

	static async deleteAllByMovieId(movieId: number): Promise<void> {
		// Find all affected watchlists
		const entries = await this.findByMovieId(movieId);
		const watchlistIds = [
			...new Set(entries.map((entry) => entry.watchlistId)),
		];

		// Delete the entries
		await db
			.delete(watchlistMovies)
			.where(eq(watchlistMovies.movieId, movieId));

		// Update all affected watchlists' updatedAt timestamps
		for (const watchlistId of watchlistIds) {
			await db
				.update(watchlists)
				.set({
					updatedAt: new Date().toISOString(),
				})
				.where(eq(watchlists.id, watchlistId));
		}
	}
}
