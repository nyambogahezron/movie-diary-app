import { PostComment as PostCommentHelper } from '../helpers/PostComment';
import { Post as PostHelper } from '../helpers/Post';
import { PostComment as PostCommentType, PostCommentInput } from '../types';
import { NotFoundError, UnauthorizedError } from '../errors';

export class PostCommentService {
	static async createComment(
		userId: number,
		postId: number,
		commentData: PostCommentInput
	): Promise<PostCommentType> {
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		const comment = await PostCommentHelper.create({
			content: commentData.content,
			userId,
			postId,
		});

		await PostHelper.incrementComments(postId);

		return comment;
	}

	static async getCommentsByPostId(postId: number): Promise<PostCommentType[]> {
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		return await PostCommentHelper.findByPostId(postId);
	}

	static async updateComment(
		userId: number,
		commentId: number,
		content: string
	): Promise<void> {
		const comment = await PostCommentHelper.findById(commentId);

		if (!comment) {
			throw new NotFoundError('Comment not found');
		}

		if (comment.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to update this comment'
			);
		}

		await PostCommentHelper.update(commentId, content);
	}

	static async deleteComment(userId: number, commentId: number): Promise<void> {
		const comment = await PostCommentHelper.findById(commentId);

		if (!comment) {
			throw new NotFoundError('Comment not found');
		}

		if (comment.userId !== userId) {
			throw new UnauthorizedError(
				'You do not have permission to delete this comment'
			);
		}

		await PostCommentHelper.delete(commentId);

		await PostHelper.decrementComments(comment.postId);
	}

	static async getUserCommentsOnPost(
		userId: number,
		postId: number
	): Promise<PostCommentType[]> {
		return await PostCommentHelper.findByUserAndPost(userId, postId);
	}
}
