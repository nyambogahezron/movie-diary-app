import { db } from '../db';
import { movieReviews } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class MovieReviewService {
	async findById(id: number) {
		const review = await db.query.movieReviews.findFirst({
			where: eq(movieReviews.id, id),
		});
		if (!review) {
			throw new NotFoundError('Review not found');
		}
		return review;
	}

	async findAll({
		movieId,
		userId,
		limit = 10,
		offset = 0,
	}: {
		movieId?: number;
		userId?: number;
		limit?: number;
		offset?: number;
	}) {
		const conditions = [];
		if (movieId) conditions.push(eq(movieReviews.movieId, movieId));
		if (userId) conditions.push(eq(movieReviews.userId, userId));

		return await db.query.movieReviews.findMany({
			where: conditions.length > 0 ? and(...conditions) : undefined,
			limit,
			offset,
			orderBy: [desc(movieReviews.createdAt)],
		});
	}

	async findByUserId(
		userId: number,
		{ limit = 10, offset = 0 }: { limit?: number; offset?: number }
	) {
		return await db.query.movieReviews.findMany({
			where: eq(movieReviews.userId, userId),
			limit,
			offset,
			orderBy: [desc(movieReviews.createdAt)],
		});
	}

	async findByMovieId(
		movieId: number,
		{ limit = 10, offset = 0 }: { limit?: number; offset?: number }
	) {
		return await db.query.movieReviews.findMany({
			where: eq(movieReviews.movieId, movieId),
			limit,
			offset,
			orderBy: [desc(movieReviews.createdAt)],
		});
	}

	async create(input: {
		movieId: number;
		userId: number;
		content: string;
		rating?: number;
		isPublic?: boolean;
	}) {
		const [review] = await db.insert(movieReviews).values(input).returning();
		return review;
	}

	async update(
		id: number,
		input: {
			content?: string;
			rating?: number;
			isPublic?: boolean;
		}
	) {
		const [review] = await db
			.update(movieReviews)
			.set(input)
			.where(eq(movieReviews.id, id))
			.returning();

		if (!review) {
			throw new NotFoundError('Review not found');
		}

		return review;
	}

	async delete(id: number) {
		const [review] = await db
			.delete(movieReviews)
			.where(eq(movieReviews.id, id))
			.returning();

		if (!review) {
			throw new NotFoundError('Review not found');
		}

		return true;
	}

	async getAverageRating(movieId: number) {
		const result = await db
			.select({
				average: sql<number>`avg(${movieReviews.rating})`,
			})
			.from(movieReviews)
			.where(eq(movieReviews.movieId, movieId))
			.get();

		return result?.average ?? 0;
	}

	async getReviewCount(movieId: number) {
		const result = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(movieReviews)
			.where(eq(movieReviews.movieId, movieId))
			.get();

		return result?.count ?? 0;
	}
}
