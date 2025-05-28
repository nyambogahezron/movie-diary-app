import { db } from '../db';
import { watchlists, watchlistMovies, movies } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { Watchlist as WatchlistType, Movie as MovieType } from '../types';
import { SearchInput } from '../types';

export class Watchlist {
	static async create(watchlistData: {
		name: string;
		description?: string;
		isPublic: boolean;
		userId: number;
	}): Promise<WatchlistType> {
		// Check if a watchlist with this name already exists for the user
		const existingWatchlist = await db
			.select()
			.from(watchlists)
			.where(eq(watchlists.userId, watchlistData.userId))
			.where(eq(watchlists.name, watchlistData.name));

		if (existingWatchlist.length > 0) {
			throw new Error('A watchlist with this name already exists');
		}

		// Insert watchlist
		const result = await db
			.insert(watchlists)
			.values({
				name: watchlistData.name,
				description: watchlistData.description || null,
				isPublic: watchlistData.isPublic,
				userId: watchlistData.userId,
			})
			.returning();

		return result[0] as unknown as WatchlistType;
	}

	static async findById(id: number): Promise<WatchlistType | undefined> {
		const result = await db
			.select()
			.from(watchlists)
			.where(eq(watchlists.id, id));
		return result[0] as unknown as WatchlistType;
	}

	static async findByUserId(userId: number): Promise<WatchlistType[]> {
		const result = await db
			.select()
			.from(watchlists)
			.where(eq(watchlists.userId, userId));

		return result as unknown as WatchlistType[];
	}

	static async findPublic(params?: SearchInput): Promise<WatchlistType[]> {
		let query = db
			.select()
			.from(watchlists)
			.where(eq(watchlists.isPublic, true));

		// Add search if provided
		if (params?.search) {
			query = query.where(like(watchlists.name, `%${params.search}%`));
		}

		// Add sorting if provided
		if (params?.sortBy) {
			const sortColumn = params.sortBy as keyof typeof watchlists;
			if (sortColumn in watchlists) {
				if (params.sortOrder === 'desc') {
					query = query.orderBy(desc(watchlists[sortColumn]));
				} else {
					query = query.orderBy(asc(watchlists[sortColumn]));
				}
			}
		} else {
			// Default sort by updatedAt desc
			query = query.orderBy(desc(watchlists.updatedAt));
		}

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result as unknown as WatchlistType[];
	}

	static async update(
		id: number,
		watchlistData: Partial<WatchlistType>
	): Promise<void> {
		await db
			.update(watchlists)
			.set({
				...watchlistData,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, id));
	}

	static async delete(id: number): Promise<void> {
		// Delete the watchlist and all its movie associations
		await db.delete(watchlistMovies).where(eq(watchlistMovies.watchlistId, id));
		await db.delete(watchlists).where(eq(watchlists.id, id));
	}

	static async addMovie(watchlistId: number, movieId: number): Promise<void> {
		// Check if the movie is already in the watchlist
		const existingEntry = await db
			.select()
			.from(watchlistMovies)
			.where(eq(watchlistMovies.watchlistId, watchlistId))
			.where(eq(watchlistMovies.movieId, movieId));

		if (existingEntry.length > 0) {
			return; // Movie already in watchlist, no need to add it again
		}

		// Add the movie to the watchlist
		await db.insert(watchlistMovies).values({
			watchlistId,
			movieId,
		});

		// Update the watchlist's updatedAt timestamp
		await db
			.update(watchlists)
			.set({
				updatedAt: new Date().toISOString(),
			})
			.where(eq(watchlists.id, watchlistId));
	}

	static async removeMovie(
		watchlistId: number,
		movieId: number
	): Promise<void> {
		// Remove the movie from the watchlist
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

	static async getMovies(
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
}
