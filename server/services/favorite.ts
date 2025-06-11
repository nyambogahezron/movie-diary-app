import { db } from '../db';
import { favorites } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class FavoriteService {
	async findByUserId(
		userId: number,
		{ limit = 10, offset = 0 }: { limit?: number; offset?: number }
	) {
		return await db.query.favorites.findMany({
			where: eq(favorites.userId, userId),
			limit,
			offset,
			orderBy: [desc(favorites.createdAt)],
		});
	}

	async isFavorite(userId: number, movieId: number) {
		const favorite = await db.query.favorites.findFirst({
			where: and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)),
		});
		return !!favorite;
	}

	async add(userId: number, movieId: number) {
		// Check if already favorited
		const exists = await this.isFavorite(userId, movieId);
		if (exists) {
			throw new Error('Movie is already in favorites');
		}

		const [favorite] = await db
			.insert(favorites)
			.values({
				userId,
				movieId,
			})
			.returning();

		return favorite;
	}

	async remove(userId: number, movieId: number) {
		const [deleted] = await db
			.delete(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)))
			.returning();

		if (!deleted) {
			throw new NotFoundError('Favorite not found');
		}

		return true;
	}
}
