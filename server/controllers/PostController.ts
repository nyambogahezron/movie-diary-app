import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/PostService';
import { PostLikeService } from '../services/PostLikeService';
import { PostCommentService } from '../services/PostCommentService';
import { PostInput, PostCommentInput, PostSearchInput } from '../types';

export class PostController {
	/**
	 * Create a new post
	 */
	static async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postData: PostInput = req.body;

			const post = await PostService.createPost(userId, postData);

			res.status(201).json({
				success: true,
				data: post,
				message: 'Post created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get a post by ID
	 */
	static async getPost(req: Request, res: Response, next: NextFunction) {
		try {
			const postId = parseInt(req.params.id, 10);
			const userId = req.user?.id;

			const post = await PostService.getPostById(postId, userId);

			// Check if the user has liked this post
			const hasLiked = userId
				? await PostLikeService.hasUserLikedPost(userId, postId)
				: false;

			res.status(200).json({
				success: true,
				data: { ...post, hasLiked },
				message: 'Post retrieved successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get posts by current user
	 */
	static async getUserPosts(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const params: PostSearchInput = {
				limit: req.query.limit
					? parseInt(req.query.limit as string, 10)
					: undefined,
				offset: req.query.offset
					? parseInt(req.query.offset as string, 10)
					: undefined,
				sortBy: req.query.sortBy as string | undefined,
				sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
				search: req.query.search as string | undefined,
				isPublic:
					req.query.isPublic === 'true'
						? true
						: req.query.isPublic === 'false'
						? false
						: undefined,
			};

			const posts = await PostService.getPostsWithLikeStatus(userId, params);

			res.status(200).json({
				success: true,
				data: posts,
				message: 'User posts retrieved successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get post feed
	 */
	static async getFeed(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?.id;
			const params: PostSearchInput = {
				limit: req.query.limit
					? parseInt(req.query.limit as string, 10)
					: undefined,
				offset: req.query.offset
					? parseInt(req.query.offset as string, 10)
					: undefined,
				sortBy: req.query.sortBy as string | undefined,
				sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
				search: req.query.search as string | undefined,
			};

			const posts = await PostService.getFeed(userId, params);

			res.status(200).json({
				success: true,
				data: posts,
				message: 'Post feed retrieved successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update a post
	 */
	static async updatePost(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postId = parseInt(req.params.id, 10);
			const postData: Partial<PostInput> = req.body;

			await PostService.updatePost(userId, postId, postData);

			res.status(200).json({
				success: true,
				message: 'Post updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete a post
	 */
	static async deletePost(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postId = parseInt(req.params.id, 10);

			await PostService.deletePost(userId, postId);

			res.status(200).json({
				success: true,
				message: 'Post deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Like a post
	 */
	static async likePost(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postId = parseInt(req.params.id, 10);

			await PostLikeService.likePost(userId, postId);

			res.status(200).json({
				success: true,
				message: 'Post liked successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Unlike a post
	 */
	static async unlikePost(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postId = parseInt(req.params.id, 10);

			await PostLikeService.unlikePost(userId, postId);

			res.status(200).json({
				success: true,
				message: 'Post unliked successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Add a comment to a post
	 */
	static async addComment(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const postId = parseInt(req.params.id, 10);
			const commentData: PostCommentInput = req.body;

			const comment = await PostCommentService.createComment(
				userId,
				postId,
				commentData
			);

			res.status(201).json({
				success: true,
				data: comment,
				message: 'Comment added successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get comments for a post
	 */
	static async getComments(req: Request, res: Response, next: NextFunction) {
		try {
			const postId = parseInt(req.params.id, 10);

			const comments = await PostCommentService.getCommentsByPostId(postId);

			res.status(200).json({
				success: true,
				data: comments,
				message: 'Comments retrieved successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update a comment
	 */
	static async updateComment(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const commentId = parseInt(req.params.commentId, 10);
			const { content } = req.body;

			await PostCommentService.updateComment(userId, commentId, content);

			res.status(200).json({
				success: true,
				message: 'Comment updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete a comment
	 */
	static async deleteComment(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			const commentId = parseInt(req.params.commentId, 10);

			await PostCommentService.deleteComment(userId, commentId);

			res.status(200).json({
				success: true,
				message: 'Comment deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}
