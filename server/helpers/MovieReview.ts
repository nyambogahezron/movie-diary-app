import { db } from '../db';
import { movieReviews } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { MovieReview as MovieReviewType, MovieReviewInput } from '../types';

export class MovieReview {
	static async create(
		data: MovieReviewInput & { userId: number; movieId: number }
	): Promise<MovieReviewType> {
		const { userId, movieId, content, rating, isPublic = true } = data;

		const [newReview] = await db
			.insert(movieReviews)
			.values({
				userId,
				movieId,
				content,
				rating,
				isPublic,
			})
			.returning();

		return newReview as MovieReviewType;
	}

	static async findById(id: number): Promise<MovieReviewType | null> {
		const review = await db
			.select()
			.from(movieReviews)
			.where(eq(movieReviews.id, id))
			.get();
		return (review as MovieReviewType) || null;
	}

	static async findByMovieId(movieId: number): Promise<MovieReviewType[]> {
		const reviews = await db
			.select()
			.from(movieReviews)
			.where(eq(movieReviews.movieId, movieId))
			.orderBy(desc(movieReviews.createdAt))
			.all();

		return reviews as MovieReviewType[];
	}

	static async findPublicByMovieId(
		movieId: number
	): Promise<MovieReviewType[]> {
		const reviews = await db
			.select()
			.from(movieReviews)
			.where(
				and(eq(movieReviews.movieId, movieId), eq(movieReviews.isPublic, true))
			)
			.orderBy(desc(movieReviews.createdAt))
			.all();

		return reviews as MovieReviewType[];
	}

	static async findByUserAndMovie(
		userId: number,
		movieId: number
	): Promise<MovieReviewType | null> {
		const review = await db
			.select()
			.from(movieReviews)
			.where(
				and(eq(movieReviews.userId, userId), eq(movieReviews.movieId, movieId))
			)
			.get();

		return (review as MovieReviewType) || null;
	}

	static async findByUserId(userId: number): Promise<MovieReviewType[]> {
		const reviews = await db
			.select()
			.from(movieReviews)
			.where(eq(movieReviews.userId, userId))
			.orderBy(desc(movieReviews.createdAt))
			.all();

		return reviews as MovieReviewType[];
	}

	static async update(
		id: number,
		data: Partial<MovieReviewInput>
	): Promise<void> {
		await db
			.update(movieReviews)
			.set({
				...data,
				updatedAt: sql`CURRENT_TIMESTAMP`,
			})
			.where(eq(movieReviews.id, id))
			.run();
	}

	static async delete(id: number): Promise<void> {
		await db.delete(movieReviews).where(eq(movieReviews.id, id)).run();
	}

	static async getReviewsWithUserDetails(
		movieId: number,
		includePrivate = false
	): Promise<any[]> {
		// SQL query to join movie reviews with user data
		const query = includePrivate
			? `
        SELECT 
          mr.*, 
          u.id as user_id, 
          u.username, 
          u.avatar
        FROM movie_reviews mr
        JOIN users u ON mr.user_id = u.id
        WHERE mr.movie_id = ?
        ORDER BY mr.created_at DESC
      `
			: `
        SELECT 
          mr.*, 
          u.id as user_id, 
          u.username, 
          u.avatar
        FROM movie_reviews mr
        JOIN users u ON mr.user_id = u.id
        WHERE mr.movie_id = ? AND mr.is_public = 1
        ORDER BY mr.created_at DESC
      `;

		return (await db.all(query, [movieId])) as any[];
	}
}
