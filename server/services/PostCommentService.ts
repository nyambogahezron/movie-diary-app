import { PostComment as PostCommentHelper } from '../helpers/PostComment';
import { Post as PostHelper } from '../helpers/Post';
import { PostComment as PostCommentType, PostCommentInput } from '../types';
import { NotFoundError, UnauthorizedError } from '../errors';

export class PostCommentService {
	/**
	 * Create a comment on a post
	 */
	static async createComment(
		userId: number,
		postId: number,
		commentData: PostCommentInput
	): Promise<PostCommentType> {
		// Check if post exists
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		// Create the comment
		const comment = await PostCommentHelper.create({
			content: commentData.content,
			userId,
			postId,
		});

		// Increment the post's comment count
		await PostHelper.incrementComments(postId);

		return comment;
	}

	/**
	 * Get comments for a post
	 */
	static async getCommentsByPostId(postId: number): Promise<PostCommentType[]> {
		// Check if post exists
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		return await PostCommentHelper.findByPostId(postId);
	}

	/**
	 * Update a comment
	 */
	static async updateComment(
		userId: number,
		commentId: number,
		content: string
	): Promise<void> {
		const comment = await PostCommentHelper.findById(commentId);

		if (!comment) {
			throw new NotFoundError('Comment not found');
		}

		// Only the comment owner can update it
		if (comment.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to update this comment'
			);
		}

		await PostCommentHelper.update(commentId, content);
	}

	/**
	 * Delete a comment
	 */
	static async deleteComment(userId: number, commentId: number): Promise<void> {
		const comment = await PostCommentHelper.findById(commentId);

		if (!comment) {
			throw new NotFoundError('Comment not found');
		}

		// Only the comment owner can delete it
		if (comment.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to delete this comment'
			);
		}

		await PostCommentHelper.delete(commentId);

		// Decrement the post's comment count
		await PostHelper.decrementComments(comment.postId);
	}

	/**
	 * Get comments by a specific user on a post
	 */
	static async getUserCommentsOnPost(
		userId: number,
		postId: number
	): Promise<PostCommentType[]> {
		return await PostCommentHelper.findByUserAndPost(userId, postId);
	}
}
