import { PostLike as PostLikeHelper } from '../helpers/PostLike';
import { Post as PostHelper } from '../helpers/Post';
import { PostLike as PostLikeType } from '../types';
import { NotFoundError, ConflictError } from '../errors';

export class PostLikeService {
	/**
	 * Like a post
	 */
	static async likePost(userId: number, postId: number): Promise<PostLikeType> {
		// Check if post exists
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		// Check if the user has already liked the post
		const existingLike = await PostLikeHelper.findByUserAndPost(userId, postId);
		if (existingLike) {
			throw new ConflictError('You have already liked this post');
		}

		// Create the like
		const like = await PostLikeHelper.create(userId, postId);

		// Increment the post's like count
		await PostHelper.incrementLikes(postId);

		return like;
	}

	/**
	 * Unlike a post
	 */
	static async unlikePost(userId: number, postId: number): Promise<void> {
		// Check if post exists
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		// Check if the user has liked the post
		const existingLike = await PostLikeHelper.findByUserAndPost(userId, postId);
		if (!existingLike) {
			throw new NotFoundError('You have not liked this post');
		}

		// Delete the like
		await PostLikeHelper.deleteByUserAndPost(userId, postId);

		// Decrement the post's like count
		await PostHelper.decrementLikes(postId);
	}

	/**
	 * Check if a user has liked a post
	 */
	static async hasUserLikedPost(
		userId: number,
		postId: number
	): Promise<boolean> {
		const like = await PostLikeHelper.findByUserAndPost(userId, postId);
		return !!like;
	}

	/**
	 * Get like count for a post
	 */
	static async getLikeCount(postId: number): Promise<number> {
		return await PostLikeHelper.getLikeCount(postId);
	}
}
