import { db } from '../db';
import { postComments, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { PostComment as PostCommentType, PostCommentInput } from '../types';

export class PostComment {
	static async create(
		commentData: PostCommentInput & { userId: number; postId: number }
	): Promise<PostCommentType> {
		const result = await db
			.insert(postComments)
			.values({
				content: commentData.content,
				userId: commentData.userId,
				postId: commentData.postId,
			})
			.returning();

		return result[0] as unknown as PostCommentType;
	}

	static async findById(id: number): Promise<PostCommentType | undefined> {
		const result = await db
			.select()
			.from(postComments)
			.where(eq(postComments.id, id));

		return result[0] as unknown as PostCommentType;
	}

	static async findByPostId(postId: number): Promise<PostCommentType[]> {
		const result = await db
			.select({
				id: postComments.id,
				userId: postComments.userId,
				postId: postComments.postId,
				content: postComments.content,
				createdAt: postComments.createdAt,
				updatedAt: postComments.updatedAt,
				username: users.username,
				avatar: users.avatar,
			})
			.from(postComments)
			.innerJoin(users, eq(postComments.userId, users.id))
			.where(eq(postComments.postId, postId))
			.orderBy(desc(postComments.createdAt));

		return result as unknown as PostCommentType[];
	}

	static async update(id: number, content: string): Promise<void> {
		await db
			.update(postComments)
			.set({
				content,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(postComments.id, id));
	}

	static async delete(id: number): Promise<void> {
		await db.delete(postComments).where(eq(postComments.id, id));
	}

	static async deleteAllByPostId(postId: number): Promise<void> {
		await db.delete(postComments).where(eq(postComments.postId, postId));
	}

	static async findByUserAndPost(
		userId: number,
		postId: number
	): Promise<PostCommentType[]> {
		const result = await db
			.select()
			.from(postComments)
			.where(
				and(eq(postComments.userId, userId), eq(postComments.postId, postId))
			)
			.orderBy(desc(postComments.createdAt));

		return result as unknown as PostCommentType[];
	}
}
