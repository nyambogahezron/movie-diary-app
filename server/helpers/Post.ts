import { db } from '../db';
import { posts, postLikes, users } from '../db/schema';
import { eq, like, desc, asc, count, and } from 'drizzle-orm';
import { Post as PostType, PostInput, PostSearchInput } from '../types';

export class Post {
	static async create(
		postData: PostInput & { userId: number }
	): Promise<PostType> {
		// Insert post
		const result = await db
			.insert(posts)
			.values({
				title: postData.title,
				tmdbId: postData.tmdbId,
				posterPath: postData.posterPath || null,
				content: postData.content,
				userId: postData.userId,
				isPublic: postData.isPublic !== undefined ? postData.isPublic : true,
				likesCount: 0,
				commentsCount: 0,
			})
			.returning();

		return result[0] as unknown as PostType;
	}

	static async findById(id: number): Promise<PostType | undefined> {
		const result = await db.select().from(posts).where(eq(posts.id, id));
		return result[0] as unknown as PostType;
	}

	static async findByUserId(
		userId: number,
		params?: PostSearchInput
	): Promise<PostType[]> {
		let query = db.select().from(posts).where(eq(posts.userId, userId));

		// Add search if provided
		if (params?.search) {
			query = query.where(like(posts.title, `%${params.search}%`));
		}

		// Filter by public/private
		if (params?.isPublic !== undefined) {
			query = query.where(eq(posts.isPublic, params.isPublic ? 1 : 0));
		}

		// Add sorting if provided
		if (params?.sortBy) {
			const sortColumn = params.sortBy as keyof typeof posts;
			if (sortColumn in posts) {
				if (params.sortOrder === 'desc') {
					query = query.orderBy(desc(posts[sortColumn]));
				} else {
					query = query.orderBy(asc(posts[sortColumn]));
				}
			}
		} else {
			// Default sort by createdAt desc
			query = query.orderBy(desc(posts.createdAt));
		}

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result as unknown as PostType[];
	}

	static async getFeed(
		currentUserId?: number | null,
		params?: PostSearchInput
	): Promise<PostType[]> {
		// Get all public posts
		let query = db
			.select()
			.from(posts)
			.where(eq(posts.isPublic, true))
			.orderBy(desc(posts.createdAt));

		// Add pagination if provided
		if (params?.limit) {
			query = query.limit(params.limit);

			if (params?.offset) {
				query = query.offset(params.offset);
			}
		}

		const result = await query;
		return result as unknown as PostType[];
	}

	static async update(id: number, postData: Partial<PostInput>): Promise<void> {
		const updateData: Record<string, any> = {};

		if (postData.title !== undefined) updateData.title = postData.title;
		if (postData.content !== undefined) updateData.content = postData.content;
		if (postData.isPublic !== undefined)
			updateData.isPublic = postData.isPublic;
		updateData.updatedAt = new Date().toISOString();

		await db.update(posts).set(updateData).where(eq(posts.id, id));
	}

	static async delete(id: number): Promise<void> {
		await db.delete(posts).where(eq(posts.id, id));
	}

	static async incrementLikes(id: number): Promise<void> {
		await db
			.update(posts)
			.set({
				likesCount: posts.likesCount + 1,
			})
			.where(eq(posts.id, id));
	}

	static async decrementLikes(id: number): Promise<void> {
		await db
			.update(posts)
			.set({
				likesCount: posts.likesCount - 1,
			})
			.where(eq(posts.id, id));
	}

	static async incrementComments(id: number): Promise<void> {
		await db
			.update(posts)
			.set({
				commentsCount: posts.commentsCount + 1,
			})
			.where(eq(posts.id, id));
	}

	static async decrementComments(id: number): Promise<void> {
		await db
			.update(posts)
			.set({
				commentsCount: posts.commentsCount - 1,
			})
			.where(eq(posts.id, id));
	}

	static async getPostsWithLikeStatus(
		userId: number,
		params?: PostSearchInput
	): Promise<(PostType & { hasLiked: boolean })[]> {
		// First get posts
		const postsResult = await this.findByUserId(userId, params);

		if (postsResult.length === 0) {
			return [];
		}

		// Then get like status for each post
		const postIds = postsResult.map((post) => post.id);

		const likes = await db
			.select()
			.from(postLikes)
			.where(and(eq(postLikes.userId, userId), postLikes.postId.in(postIds)));

		// Map of post IDs to whether the user has liked them
		const likeMap = new Map<number, boolean>();
		likes.forEach((like) => {
			likeMap.set(like.postId, true);
		});

		// Add like status to each post
		return postsResult.map((post) => ({
			...post,
			hasLiked: likeMap.has(post.id),
		}));
	}
}
