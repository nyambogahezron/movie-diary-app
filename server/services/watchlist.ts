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

	async add(userId: number, movieId: number) {
		// Find or create a default watchlist for the user
		let watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			[watchlist] = await db
				.insert(watchlists)
				.values({
					userId,
					name: 'Default Watchlist',
					isPublic: false,
				})
				.returning();
		}

		return this.addMovie(watchlist.id, movieId);
	}

	async remove(userId: number, movieId: number) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		return this.removeMovie(watchlist.id, movieId);
	}

	async updateStatus(
		userId: number,
		movieId: number,
		status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH'
	) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		// Update movie status in the watchlist
		await db
			.update(movies)
			.set({
				watchDate: status === 'WATCHED' ? new Date().toISOString() : null,
			})
			.where(eq(movies.id, movieId));

		return this.findById(watchlist.id);
	}

	async reorder(userId: number, movieIds: number[]) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		// Implementation would depend on how you want to handle ordering
		// This is a simplified version that could be enhanced
		for (let i = 0; i < movieIds.length; i++) {
			await db
				.update(watchlistMovies)
				.set({ order: i })
				.where(
					and(
						eq(watchlistMovies.watchlistId, watchlist.id),
						eq(watchlistMovies.movieId, movieIds[i])
					)
				);
		}

		return this.findById(watchlist.id);
	}

	async updatePriority(
		userId: number,
		movieId: number,
		priority: 'HIGH' | 'MEDIUM' | 'LOW'
	) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		// Implementation would depend on how you want to handle priority
		// This is a placeholder that could be enhanced
		await db
			.update(watchlistMovies)
			.set({ priority })
			.where(
				and(
					eq(watchlistMovies.watchlistId, watchlist.id),
					eq(watchlistMovies.movieId, movieId)
				)
			);

		return this.findById(watchlist.id);
	}

	async bulkUpdateStatus(
		userId: number,
		movieIds: number[],
		status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH'
	) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		// Update status for all movies in the list
		await db
			.update(movies)
			.set({
				watchDate: status === 'WATCHED' ? new Date().toISOString() : null,
			})
			.where(sql`${movies.id} IN (${movieIds.join(',')})`);

		return this.findById(watchlist.id);
	}

	async getMoviesByStatus(
		userId: number,
		status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH'
	) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		return db.query.movies.findMany({
			where:
				status === 'WATCHED'
					? sql`${movies.watchDate} IS NOT NULL`
					: status === 'WATCHING'
					? sql`${movies.watchDate} IS NULL AND ${movies.id} IN (
					SELECT ${watchlistMovies.movieId} 
					FROM ${watchlistMovies} 
					WHERE ${watchlistMovies.watchlistId} = ${watchlist.id}
				)`
					: sql`${movies.watchDate} IS NULL AND ${movies.id} NOT IN (
					SELECT ${watchlistMovies.movieId} 
					FROM ${watchlistMovies} 
					WHERE ${watchlistMovies.watchlistId} = ${watchlist.id}
				)`,
		});
	}

	async getMoviesByYear(userId: number, year: number) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		return db.query.movies.findMany({
			where: sql`strftime('%Y', ${movies.releaseDate}) = ${year.toString()}`,
		});
	}

	async getMoviesByGenre(userId: number, genre: string) {
		const watchlist = await db.query.watchlists.findFirst({
			where: and(
				eq(watchlists.userId, userId),
				eq(watchlists.name, 'Default Watchlist')
			),
		});

		if (!watchlist) {
			throw new NotFoundError('Default watchlist not found');
		}

		return db.query.movies.findMany({
			where: sql`${movies.genres} LIKE ${`%${genre}%`}`,
		});
	}

	async getWatchlistByStatus(
		watchlistId: number,
		status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH'
	) {
		// Check if watchlist exists
		await this.findById(watchlistId);

		return db.query.movies.findMany({
			where:
				status === 'WATCHED'
					? sql`${movies.watchDate} IS NOT NULL AND ${movies.id} IN (
						SELECT ${watchlistMovies.movieId} 
						FROM ${watchlistMovies} 
						WHERE ${watchlistMovies.watchlistId} = ${watchlistId}
					)`
					: status === 'WATCHING'
					? sql`${movies.watchDate} IS NULL AND ${movies.id} IN (
						SELECT ${watchlistMovies.movieId} 
						FROM ${watchlistMovies} 
						WHERE ${watchlistMovies.watchlistId} = ${watchlistId}
					)`
					: sql`${movies.watchDate} IS NULL AND ${movies.id} NOT IN (
						SELECT ${watchlistMovies.movieId} 
						FROM ${watchlistMovies} 
						WHERE ${watchlistMovies.watchlistId} = ${watchlistId}
					)`,
		});
	}

	async getWatchlistByYear(watchlistId: number, year: number) {
		// Check if watchlist exists
		await this.findById(watchlistId);

		return db.query.movies.findMany({
			where: sql`strftime('%Y', ${
				movies.releaseDate
			}) = ${year.toString()} AND ${movies.id} IN (
				SELECT ${watchlistMovies.movieId} 
				FROM ${watchlistMovies} 
				WHERE ${watchlistMovies.watchlistId} = ${watchlistId}
			)`,
		});
	}

	async getWatchlistByGenre(watchlistId: number, genre: string) {
		// Check if watchlist exists
		await this.findById(watchlistId);

		return db.query.movies.findMany({
			where: sql`${movies.genres} LIKE ${`%${genre}%`} AND ${movies.id} IN (
				SELECT ${watchlistMovies.movieId} 
				FROM ${watchlistMovies} 
				WHERE ${watchlistMovies.watchlistId} = ${watchlistId}
			)`,
		});
	}
}
