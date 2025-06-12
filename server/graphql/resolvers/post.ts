import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';

export const postResolvers: IResolvers = {
	Query: {
		post: async (_parent, { id }, context: GraphQLContext) => {
			return await context.postService.findById(id);
		},

		posts: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (userId) {
				return await context.postService.findByUserId(userId, {
					limit,
					offset,
				});
			}

			return await context.postService.findAll({ limit, offset });
		},

		userPosts: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.postService.findByUserId(userId, { limit, offset });
		},

		postComments: async (
			_parent,
			{ postId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.postCommentService.findByPostId(postId, {
				limit,
				offset,
			});
		},

		isPostLiked: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.postLikeService.isLiked(context.user.id, postId);
		},
	},

	Mutation: {
		createPost: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const { title, content } = input;

			return await context.postService.create({
				userId: context.user.id,
				title,
				content,
			});
		},

		updatePost: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const post = await context.postService.findById(id);

			if (!post) {
				throw new UserInputError('Post not found');
			}

			if (post.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to update this post');
			}

			return await context.postService.update(id, input);
		},

		deletePost: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const post = await context.postService.findById(id);

			if (!post) {
				throw new UserInputError('Post not found');
			}

			if (post.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to delete this post');
			}

			await context.postService.delete(id);
			return true;
		},

		likePost: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// Check if post exists
			const post = await context.postService.findById(postId);

			if (!post) {
				throw new UserInputError('Post not found');
			}

			// Check if already liked
			const isLiked = await context.postLikeService.isLiked(
				context.user.id,
				postId
			);

			if (isLiked) {
				throw new UserInputError('Post already liked');
			}

			return await context.postLikeService.create({
				userId: context.user.id,
				postId,
			});
		},

		unlikePost: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// Check if post is liked
			const like = await context.postLikeService.findByUserAndPost(
				context.user.id,
				postId
			);

			if (!like) {
				throw new UserInputError('Post is not liked');
			}

			await context.postLikeService.delete(like.id);
			return true;
		},

		createPostComment: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const { postId, content } = input;

			// Check if post exists
			const post = await context.postService.findById(postId);

			if (!post) {
				throw new UserInputError('Post not found');
			}

			return await context.postCommentService.create({
				userId: context.user.id,
				postId,
				content,
			});
		},

		updatePostComment: async (
			_parent,
			{ id, input },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const comment = await context.postCommentService.findById(id);

			if (!comment) {
				throw new UserInputError('Comment not found');
			}

			if (comment.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to update this comment');
			}

			return await context.postCommentService.update(id, input);
		},

		deletePostComment: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const comment = await context.postCommentService.findById(id);

			if (!comment) {
				throw new UserInputError('Comment not found');
			}

			if (comment.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to delete this comment');
			}

			await context.postCommentService.delete(id);
			return true;
		},
	},

	Post: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},

		likes: async (parent, _args, context: GraphQLContext) => {
			return await context.postLikeService.findByPostId(parent.id);
		},

		comments: async (parent, _args, context: GraphQLContext) => {
			return await context.postCommentService.findByPostId(parent.id);
		},

		likeCount: async (parent, _args, context: GraphQLContext) => {
			const likes = await context.postLikeService.findByPostId(parent.id);
			return likes.length;
		},

		commentCount: async (parent, _args, context: GraphQLContext) => {
			const comments = await context.postCommentService.findByPostId(parent.id);
			return comments.length;
		},
	},

	PostLike: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},

		post: async (parent, _args, context: GraphQLContext) => {
			return await context.postService.findById(parent.postId);
		},
	},

	PostComment: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},

		post: async (parent, _args, context: GraphQLContext) => {
			return await context.postService.findById(parent.postId);
		},
	},
};
