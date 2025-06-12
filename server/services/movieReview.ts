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

	async getMovieReviewCount(movieId: number) {
		return this.getReviewCount(movieId);
	}

	async getMovieRatingDistribution(movieId: number) {
		const reviews = await this.findByMovieId(movieId, { limit: 1000 });
		const distribution: Record<number, number> = {};

		// Initialize distribution for ratings 1-5
		for (let i = 1; i <= 5; i++) {
			distribution[i] = 0;
		}

		// Count ratings
		reviews.forEach((review) => {
			if (review.rating) {
				distribution[review.rating] = (distribution[review.rating] || 0) + 1;
			}
		});

		return distribution;
	}

	async getMovieTopReviewers(movieId: number) {
		const reviews = await db.query.movieReviews.findMany({
			where: eq(movieReviews.movieId, movieId),
			with: {
				user: true,
			},
			orderBy: [desc(movieReviews.createdAt)],
			limit: 10,
		});

		return reviews.map((review) => ({
			user: review.user,
			reviewCount: 1, // This is a simplified version, could be enhanced to count all reviews by user
			lastReviewDate: review.createdAt,
		}));
	}

	async findRecent(limit: number = 10) {
		return await db.query.movieReviews.findMany({
			orderBy: [desc(movieReviews.createdAt)],
			limit,
			with: {
				user: true,
				movie: true,
			},
		});
	}

	async findByUserAndMovie(userId: number, movieId: number) {
		const review = await db.query.movieReviews.findFirst({
			where: and(
				eq(movieReviews.userId, userId),
				eq(movieReviews.movieId, movieId)
			),
		});
		return review;
	}

	async findOrCreate(
		userId: number,
		movieId: number,
		input: {
			content: string;
			rating?: number;
			isPublic?: boolean;
		}
	) {
		const existingReview = await this.findByUserAndMovie(userId, movieId);
		if (existingReview) {
			return this.update(existingReview.id, input);
		}
		return this.create({
			userId,
			movieId,
			...input,
		});
	}

	async deleteByMovieId(userId: number, movieId: number) {
		const [review] = await db
			.delete(movieReviews)
			.where(
				and(eq(movieReviews.userId, userId), eq(movieReviews.movieId, movieId))
			)
			.returning();

		if (!review) {
			throw new NotFoundError('Review not found');
		}

		return true;
	}

	async report(reviewId: number, userId: number, reason: string) {
		// Implementation would depend on your reporting system
		// This is a placeholder that could be enhanced
		const review = await this.findById(reviewId);
		// Add reporting logic here
		return review;
	}
}
