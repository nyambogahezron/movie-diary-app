import { db } from '../db';
import { movies, movieReviews } from '../db/schema';
import { eq, like, desc, sql, and } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class MovieService {
	async findById(id: number) {
		const movie = await db.query.movies.findFirst({
			where: eq(movies.id, id),
		});
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}
		return movie;
	}

	async search({
		search,
		limit = 10,
		offset = 0,
	}: {
		search: string;
		limit?: number;
		offset?: number;
	}) {
		const query = search ? like(movies.title, `%${search}%`) : undefined;

		return await db.query.movies.findMany({
			where: query,
			limit,
			offset,
			orderBy: [desc(movies.createdAt)],
		});
	}

	async findPopular(limit: number) {
		// This is a simplified version. In a real app, you might want to
		// consider factors like number of reviews, average rating, etc.
		return await db.query.movies.findMany({
			limit,
			orderBy: [desc(movies.createdAt)],
		});
	}

	async findSimilar(movieId: number, limit: number = 10) {
		const movie = await this.findById(movieId);
		if (!movie.genres) {
			return [];
		}

		const genres = JSON.parse(movie.genres);
		const genreConditions = genres.map(
			(genre: string) => sql`${movies.genres} LIKE ${`%${genre}%`}`
		);

		return db.query.movies.findMany({
			where: and(
				sql`${movies.id} != ${movieId}`,
				sql`(${genreConditions.join(' OR ')})`
			),
			limit,
			orderBy: [desc(movies.createdAt)],
		});
	}

	async findPopularByGenre(genre: string, limit: number = 10) {
		return db.query.movies.findMany({
			where: sql`${movies.genres} LIKE ${`%${genre}%`}`,
			limit,
			orderBy: [desc(movies.createdAt)],
		});
	}

	async getTopReviewedMovies(limit: number = 10) {
		const result = await db
			.select({
				movieId: movieReviews.movieId,
				reviewCount: sql<number>`count(*)`,
				averageRating: sql<number>`avg(${movieReviews.rating})`,
			})
			.from(movieReviews)
			.groupBy(movieReviews.movieId)
			.orderBy(desc(sql`count(*)`))
			.limit(limit);

		const movieIds = result.map((r) => r.movieId);
		const movieList = await db.query.movies.findMany({
			where: sql`${movies.id} IN (${movieIds.join(',')})`,
		});

		return movieList.map((movie) => ({
			...movie,
			reviewCount: result.find((r) => r.movieId === movie.id)?.reviewCount ?? 0,
			averageRating:
				result.find((r) => r.movieId === movie.id)?.averageRating ?? 0,
		}));
	}

	async create(input: {
		userId: number;
		title: string;
		tmdbId: string;
		overview?: string;
		posterPath?: string;
		releaseDate?: string;
		genres?: string[];
	}) {
		const [movie] = await db
			.insert(movies)
			.values({
				...input,
				genres: input.genres ? JSON.stringify(input.genres) : null,
			})
			.returning();
		return movie;
	}

	async update(
		id: number,
		input: {
			title?: string;
			overview?: string;
			posterPath?: string;
			releaseDate?: string;
			genres?: string[];
		}
	) {
		const [movie] = await db
			.update(movies)
			.set({
				...input,
				genres: input.genres ? JSON.stringify(input.genres) : undefined,
			})
			.where(eq(movies.id, id))
			.returning();

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		return movie;
	}

	async delete(id: number) {
		const [movie] = await db
			.delete(movies)
			.where(eq(movies.id, id))
			.returning();

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		return true;
	}
}
