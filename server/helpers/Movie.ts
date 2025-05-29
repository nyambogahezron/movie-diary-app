import { db } from '../db';
import { movies } from '../db/schema';
import { eq, like, desc, asc } from 'drizzle-orm';
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
			.where(eq(movies.tmdbId, tmdbId))
			.where(eq(movies.userId, userId));
		return result[0] as unknown as MovieType;
	}

	static async findByUserId(
		userId: number,
		params?: SearchInput
	): Promise<MovieType[]> {
		let query = db.select().from(movies).where(eq(movies.userId, userId));

		// Add search if provided
		if (params?.search) {
			query = query.where(like(movies.title, `%${params.search}%`));
		}

		// Add sorting if provided
		if (params?.sortBy) {
			const sortColumn = params.sortBy as keyof typeof movies;
			if (sortColumn in movies) {
				if (params.sortOrder === 'desc') {
					query = query.orderBy(desc(movies[sortColumn]));
				} else {
					query = query.orderBy(asc(movies[sortColumn]));
				}
			}
		} else {
			// Default sort by createdAt desc
			query = query.orderBy(desc(movies.createdAt));
		}

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result as unknown as MovieType[];
	}

	static async update(
		id: number,
		movieData: Partial<MovieInput>
	): Promise<void> {
		// Create a copy of the data to modify
		const dataToUpdate = { ...movieData };

		// Convert genres array to JSON string if provided
		if (Array.isArray(dataToUpdate.genres)) {
			dataToUpdate.genres = JSON.stringify(dataToUpdate.genres);
		}

		await db
			.update(movies)
			.set({
				...dataToUpdate,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(movies.id, id));
	}

	static async delete(id: number): Promise<void> {
		await db.delete(movies).where(eq(movies.id, id));
	}
}
