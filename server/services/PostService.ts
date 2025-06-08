import { Post as PostHelper } from '../helpers/Post';
import { Post as PostType, PostInput, PostSearchInput } from '../types';
import { NotFoundError, UnauthorizedError } from '../errors';

export class PostService {
	/**
	 * Create a new post
	 */
	static async createPost(
		userId: number,
		postData: PostInput
	): Promise<PostType> {
		return await PostHelper.create({
			...postData,
			userId,
		});
	}

	/**
	 * Get a post by ID
	 */
	static async getPostById(postId: number, userId?: number): Promise<PostType> {
		const post = await PostHelper.findById(postId);

		if (!post) {
			throw new NotFoundError('Post not found');
		}

		if (!post.isPublic && post.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to view this post'
			);
		}

		return post;
	}

	static async getPostsByUserId(
		userId: number,
		params?: PostSearchInput
	): Promise<PostType[]> {
		return await PostHelper.findByUserId(userId, params);
	}

	static async getFeed(
		userId?: number,
		params?: PostSearchInput
	): Promise<PostType[]> {
		return await PostHelper.getFeed(userId, params);
	}

	static async updatePost(
		userId: number,
		postId: number,
		postData: Partial<PostInput>
	): Promise<void> {
		const post = await this.getPostById(postId);

		// Only the post owner can update it
		if (post.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to update this post'
			);
		}

		await PostHelper.update(postId, postData);
	}

	/**
	 * Delete a post
	 */
	static async deletePost(userId: number, postId: number): Promise<void> {
		const post = await this.getPostById(postId);

		// Only the post owner can delete it
		if (post.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to delete this post'
			);
		}

		// Delete the post
		await PostHelper.delete(postId);
	}

	/**
	 * Get posts with like status for the current user
	 */
	static async getPostsWithLikeStatus(
		userId: number,
		params?: PostSearchInput
	): Promise<(PostType & { hasLiked: boolean })[]> {
		return await PostHelper.getPostsWithLikeStatus(userId, params);
	}
}
