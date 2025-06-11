import { db } from '../db';
import { movies } from '../db/schema';
import { eq, like, desc } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class MovieService {
	async findById(id: string) {
		const movie = await db.query.movies.findFirst({
			where: eq(movies.id, id),
		});
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}
		return movie;
	}

	async search({ search, limit = 10, offset = 0 }) {
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

	async create(input: {
		title: string;
		overview?: string;
		posterPath?: string;
		releaseDate?: string;
	}) {
		const [movie] = await db.insert(movies).values(input).returning();
		return movie;
	}

	async update(
		id: string,
		input: {
			title?: string;
			overview?: string;
			posterPath?: string;
			releaseDate?: string;
		}
	) {
		const [movie] = await db
			.update(movies)
			.set(input)
			.where(eq(movies.id, id))
			.returning();

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		return movie;
	}

	async delete(id: string) {
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
