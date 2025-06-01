import { db } from '../db';
import { movies } from '../db/schema';
import { eq, like, desc, asc, and, sql } from 'drizzle-orm';
import { Movie as MovieType, MovieInput, SearchInput } from '../types';

export class Movie {
	static async create(
		movieData: MovieInput & { userId: number }
	): Promise<MovieType> {
		// Convert genres array to JSON string if provided
		const genresJson = movieData.genres
			? JSON.stringify(movieData.genres)
			: null;

		// Validate rating if provided
		if (
			movieData.rating !== undefined &&
			movieData.rating !== null &&
			(movieData.rating < 0 || movieData.rating > 10)
		) {
			throw new Error('Rating must be between 0 and 10');
		}

		// Insert movie
		const result = await db
			.insert(movies)
			.values({
				title: movieData.title,
				tmdbId: movieData.tmdbId,
				posterPath: movieData.posterPath || null,
				releaseDate: movieData.releaseDate || null,
				overview: movieData.overview || null,
				rating: movieData.rating || null,
				watchDate: movieData.watchDate || null,
				review: movieData.review || null,
				genres: genresJson,
				userId: movieData.userId,
			})
			.returning();

		return result[0] as unknown as MovieType;
	}

	static async findById(id: number): Promise<MovieType | undefined> {
		const result = await db.select().from(movies).where(eq(movies.id, id));
		return result[0] as unknown as MovieType;
	}

	static async findByTmdbId(
		tmdbId: string,
		userId: number
	): Promise<MovieType | undefined> {
		const result = await db
			.select()
			.from(movies)
			.where(and(eq(movies.tmdbId, tmdbId), eq(movies.userId, userId)));
		return result[0] as unknown as MovieType;
	}

	static async findByUserId(
		userId: number,
		params?: SearchInput
	): Promise<MovieType[]> {
		// Prepare the conditions
		const conditions = [];
		conditions.push(eq(movies.userId, userId));

		// Add search if provided
		if (params?.search) {
			conditions.push(like(movies.title, `%${params.search}%`));
		}

		// Determine sorting column and order
		let orderByColumn: any = movies.createdAt;
		let orderByDirection: 'asc' | 'desc' = 'desc';

		if (params?.sortBy && params.sortBy in movies) {
			const column = movies[params.sortBy as keyof typeof movies];
			if (column && typeof column !== 'function') {
				orderByColumn = column;
				orderByDirection = params?.sortOrder === 'desc' ? 'desc' : 'asc';
			}
		}

		// Create the base query with where before orderBy, limit, and offset
		const result = await db
			.select()
			.from(movies)
			.where(and(...conditions))
			.orderBy(
				orderByDirection === 'desc' ? desc(orderByColumn) : asc(orderByColumn)
			)
			.limit(params?.limit ?? 100)
			.offset(params?.offset ?? 0);

		return result as unknown as MovieType[];
	}

	static async update(
		id: number,
		movieData: Partial<MovieInput>
	): Promise<void> {
		// Create a cleaned copy of the data to modify
		const dataToUpdate: Record<string, any> = {};

		// Copy allowed properties
		if (movieData.title !== undefined) dataToUpdate.title = movieData.title;
		if (movieData.tmdbId !== undefined) dataToUpdate.tmdbId = movieData.tmdbId;
		if (movieData.posterPath !== undefined)
			dataToUpdate.posterPath = movieData.posterPath;
		if (movieData.releaseDate !== undefined)
			dataToUpdate.releaseDate = movieData.releaseDate;
		if (movieData.overview !== undefined)
			dataToUpdate.overview = movieData.overview;
		if (movieData.rating !== undefined) dataToUpdate.rating = movieData.rating;
		if (movieData.watchDate !== undefined)
			dataToUpdate.watchDate = movieData.watchDate;
		if (movieData.review !== undefined) dataToUpdate.review = movieData.review;
		if (movieData.userId !== undefined) dataToUpdate.userId = movieData.userId;

		// Convert genres array to JSON string if provided
		if (Array.isArray(movieData.genres)) {
			dataToUpdate.genres = JSON.stringify(movieData.genres);
		}

		// Set the updatedAt timestamp
		dataToUpdate.updatedAt = new Date().toISOString();

		await db.update(movies).set(dataToUpdate).where(eq(movies.id, id));
	}

	static async delete(id: number): Promise<void> {
		await db.delete(movies).where(eq(movies.id, id));
	}
}
