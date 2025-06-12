import { IResolvers } from '@graphql-tools/utils';
import { GraphQLContext } from './context';
import { AuthenticationError } from 'apollo-server-express';

// Import services
import { PostService } from '../services/PostService';
import { PostLikeService } from '../services/PostLikeService';
import { PostCommentService } from '../services/PostCommentService';
import { PostComment as PostCommentHelper } from '../helpers/PostComment';

// Import the modular resolvers
import modulerResolvers from './resolvers/index';

// Define inline resolvers for direct usage
const inlineResolvers: IResolvers = {
	Query: {
		// User queries
		me: async (_parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.userService.findById(String(context.user.id));
		},
		user: async (_parent, { id }, context: GraphQLContext) => {
			return await context.userService.findById(id);
		},
		users: async (
			_parent,
			{ limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.userService.findAll({ limit, offset });
		},

		// Movie queries
		movie: async (_parent, { id }, context: GraphQLContext) => {
			const movie = await context.movieService.findById(id);
			// We'll handle isFavorite through the Movie resolver
			return movie;
		},
		movies: async (
			_parent,
			{ search, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.movieService.search({ search, limit, offset });
		},
		popularMovies: async (_parent, { limit = 10 }, context: GraphQLContext) => {
			return await context.movieService.findPopular(limit);
		},

		// Review queries
		review: async (_parent, { id }, context: GraphQLContext) => {
			return await context.movieReviewService.findById(id);
		},
		reviews: async (
			_parent,
			{ movieId, userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.movieReviewService.findAll({
				movieId,
				userId,
				limit,
				offset,
			});
		},
		userReviews: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.movieReviewService.findByUserId(userId, {
				limit,
				offset,
			});
		},
		movieReviews: async (
			_parent,
			{ movieId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.movieReviewService.findByMovieId(movieId, {
				limit,
				offset,
			});
		},

		// Watchlist queries
		watchlist: async (_parent, { id }, context: GraphQLContext) => {
			return await context.watchlistService.findById(id);
		},
		watchlists: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.watchlistService.findByUserId(userId, {
				limit,
				offset,
			});
		},
		watchlistMovies: async (
			_parent,
			{ watchlistId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.watchlistService.getMovies(watchlistId, {
				limit,
				offset,
			});
		},

		// Favorite queries
		favorites: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await context.favoriteService.findByUserId(userId, {
				limit,
				offset,
			});
		},
		isFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.favoriteService.isFavorite(context.user.id, movieId);
		},

		// Post queries
		post: async (_parent, { id }, context: GraphQLContext) => {
			return await PostService.getPostById(id, context.user?.id);
		},
		posts: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await PostService.getFeed(userId, { limit, offset });
		},
		userPosts: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await PostService.getPostsByUserId(userId, { limit, offset });
		},
		postComments: async (
			_parent,
			{ postId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			return await PostCommentService.getCommentsByPostId(postId);
		},
		isPostLiked: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await PostLikeService.hasUserLikedPost(context.user.id, postId);
		},
	},

	Mutation: {
		// Auth mutations
		register: async (
			_parent,
			{ email, username, password },
			context: GraphQLContext
		) => {
			const user = await context.userService.create({
				email,
				username,
				password,
			});
			const tokenPayload = {
				id: String(user.id),
				email: user.email,
				username: user.username,
			};
			const token = await context.userService.generateToken(tokenPayload);
			return { token, user };
		},
		login: async (_parent, { email, password }, context: GraphQLContext) => {
			const user = await context.userService.authenticate(email, password);
			const tokenPayload = {
				id: String(user.id),
				email: user.email,
				username: user.username,
			};
			const token = await context.userService.generateToken(tokenPayload);
			return { token, user };
		},
		logout: async (_parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			// Clear the token cookie
			context.res.clearCookie('token');
			return true;
		},

		// Movie mutations
		createMovie: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.movieService.create(input);
		},
		updateMovie: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.movieService.update(id, input);
		},
		deleteMovie: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.movieService.delete(id);
		},

		// Review mutations
		createReview: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.movieReviewService.create({
				...input,
				userId: context.user.id,
			});
		},
		updateReview: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const review = await context.movieReviewService.findById(id);
			if (review.userId !== context.user.id) {
				throw new AuthenticationError('Not authorized to update this review');
			}
			return await context.movieReviewService.update(id, input);
		},
		deleteReview: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const review = await context.movieReviewService.findById(id);
			if (review.userId !== context.user.id) {
				throw new AuthenticationError('Not authorized to delete this review');
			}
			return await context.movieReviewService.delete(id);
		},

		// Watchlist mutations
		createWatchlist: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.watchlistService.create({
				...input,
				userId: context.user.id,
			});
		},
		updateWatchlist: async (
			_parent,
			{ id, input },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const watchlist = await context.watchlistService.findById(id);
			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to update this watchlist'
				);
			}
			return await context.watchlistService.update(id, input);
		},
		deleteWatchlist: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const watchlist = await context.watchlistService.findById(id);
			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to delete this watchlist'
				);
			}
			return await context.watchlistService.delete(id);
		},
		addMovieToWatchlist: async (
			_parent,
			{ watchlistId, movieId },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const watchlist = await context.watchlistService.findById(watchlistId);
			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to modify this watchlist'
				);
			}
			return await context.watchlistService.addMovie(watchlistId, movieId);
		},
		removeMovieFromWatchlist: async (
			_parent,
			{ watchlistId, movieId },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			const watchlist = await context.watchlistService.findById(watchlistId);
			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to modify this watchlist'
				);
			}
			return await context.watchlistService.removeMovie(watchlistId, movieId);
		},

		// Favorite mutations
		addFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.favoriteService.add(context.user.id, movieId);
		},
		removeFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.favoriteService.remove(context.user.id, movieId);
		},

		// Post mutations
		createPost: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await PostService.createPost(context.user.id, input);
		},
		updatePost: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			await PostService.updatePost(context.user.id, id, input);
			return await PostService.getPostById(id, context.user.id);
		},
		deletePost: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			await PostService.deletePost(context.user.id, id);
			return true;
		},
		likePost: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await PostLikeService.likePost(context.user.id, postId);
		},
		unlikePost: async (_parent, { postId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			await PostLikeService.unlikePost(context.user.id, postId);
			return true;
		},
		createPostComment: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await PostCommentService.createComment(
				context.user.id,
				input.postId,
				{ content: input.content }
			);
		},
		updatePostComment: async (
			_parent,
			{ id, input },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			await PostCommentService.updateComment(
				context.user.id,
				id,
				input.content
			);
			const post = await PostCommentHelper.findById(id);
			return post;
		},
		deletePostComment: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			await PostCommentService.deleteComment(context.user.id, id);
			return true;
		},
	},

	// Field resolvers
	User: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByUserId(parent.id, {
				limit: 10,
				offset: 0,
			});
		},
		watchlists: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.findByUserId(parent.id, {
				limit: 10,
				offset: 0,
			});
		},
		favorites: async (parent, _args, context: GraphQLContext) => {
			return await context.favoriteService.findByUserId(parent.id, {
				limit: 10,
				offset: 0,
			});
		},
		posts: async (parent, _args, context: GraphQLContext) => {
			return await PostService.getPostsByUserId(parent.id);
		},
	},

	Movie: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByMovieId(parent.id, {
				limit: 10,
				offset: 0,
			});
		},
		averageRating: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.getAverageRating(parent.id);
		},
		reviewCount: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.getReviewCount(parent.id);
		},
		isFavorite: async (parent, _args, context: GraphQLContext) => {
			if (!context.user) return false;
			return await context.favoriteService.isFavorite(
				context.user.id,
				parent.id
			);
		},
	},

	MovieReview: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
		movie: async (parent, _args, context: GraphQLContext) => {
			return await context.movieService.findById(parent.movieId);
		},
	},

	Watchlist: {
		movies: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.getMovies(parent.id, {
				limit: 10,
				offset: 0,
			});
		},
		movieCount: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.getMovieCount(parent.id);
		},
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
	},

	Favorite: {
		movie: async (parent, _args, context: GraphQLContext) => {
			return await context.movieService.findById(parent.movieId);
		},
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
	},

	Post: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
		likes: async (parent, _args, context: GraphQLContext) => {
			// We'll need to implement this if needed
			return []; // Placeholder
		},
		comments: async (parent, _args, context: GraphQLContext) => {
			return await PostCommentService.getCommentsByPostId(parent.id);
		},
		likeCount: async (parent, _args, context: GraphQLContext) => {
			return await PostLikeService.getLikeCount(parent.id);
		},
		commentCount: async (parent, _args, context: GraphQLContext) => {
			// Get count of comments - would need to implement this method
			return 0; // Placeholder
		},
	},

	PostLike: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
		post: async (parent, _args, context: GraphQLContext) => {
			return await PostService.getPostById(parent.postId, parent.userId);
		},
	},

	PostComment: {
		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
		post: async (parent, _args, context: GraphQLContext) => {
			return await PostService.getPostById(parent.postId, parent.userId);
		},
	},
};

// Merge inline resolvers with modular resolvers (preferring modular ones if they exist)
const resolvers = { ...inlineResolvers, ...modulerResolvers };

// Export the combined resolvers
export { resolvers };
