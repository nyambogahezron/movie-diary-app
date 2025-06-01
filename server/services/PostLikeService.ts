import { PostLike as PostLikeHelper } from '../helpers/PostLike';
import { Post as PostHelper } from '../helpers/Post';
import { PostLike as PostLikeType } from '../types';
import { NotFoundError, ConflictError } from '../utils/errors';

export class PostLikeService {
	static async likePost(userId: number, postId: number): Promise<PostLikeType> {
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		const existingLike = await PostLikeHelper.findByUserAndPost(userId, postId);
		if (existingLike) {
			throw new ConflictError('You have already liked this post');
		}

		const like = await PostLikeHelper.create(userId, postId);

		await PostHelper.incrementLikes(postId);

		return like;
	}

	static async unlikePost(userId: number, postId: number): Promise<void> {
		const post = await PostHelper.findById(postId);
		if (!post) {
			throw new NotFoundError('Post not found');
		}

		const existingLike = await PostLikeHelper.findByUserAndPost(userId, postId);
		if (!existingLike) {
			throw new NotFoundError('You have not liked this post');
		}

		await PostLikeHelper.deleteByUserAndPost(userId, postId);

		await PostHelper.decrementLikes(postId);
	}

	static async hasUserLikedPost(
		userId: number,
		postId: number
	): Promise<boolean> {
		const like = await PostLikeHelper.findByUserAndPost(userId, postId);
		return !!like;
	}

	static async getLikeCount(postId: number): Promise<number> {
		return await PostLikeHelper.getLikeCount(postId);
	}
}
