import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from './context';

export const resolvers: IResolvers = {
	Query: {
		// User queries
		me: async (_parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.userService.findById(context.user.id);
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
			if (context.user) {
				movie.isFavorite = await context.favoriteService.isFavorite(
					context.user.id,
					id
				);
			}
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
			const token = await context.userService.generateToken(user);
			return { token, user };
		},
		login: async (_parent, { email, password }, context: GraphQLContext) => {
			const user = await context.userService.authenticate(email, password);
			const token = await context.userService.generateToken(user);
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
	},

	// Field resolvers
	User: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByUserId(parent.id);
		},
		watchlists: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.findByUserId(parent.id);
		},
		favorites: async (parent, _args, context: GraphQLContext) => {
			return await context.favoriteService.findByUserId(parent.id);
		},
	},

	Movie: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByMovieId(parent.id);
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
			return await context.watchlistService.getMovies(parent.id);
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
};
