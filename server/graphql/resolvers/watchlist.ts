import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';

export const watchlistResolvers: IResolvers = {
	Query: {
		watchlist: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const watchlist = await context.watchlistService.findById(id);

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

			if (watchlist.userId !== context.user.id && !watchlist.isPublic) {
				throw new AuthenticationError('Not authorized to view this watchlist');
			}

			return watchlist;
		},

		watchlists: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// If requesting someone else's watchlists, only return public ones
			if (userId !== context.user.id) {
				return await context.watchlistService.findPublicByUserId(userId, {
					limit,
					offset,
				});
			}

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
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const watchlist = await context.watchlistService.findById(watchlistId);

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

			if (watchlist.userId !== context.user.id && !watchlist.isPublic) {
				throw new AuthenticationError('Not authorized to view this watchlist');
			}

			return await context.watchlistService.getMovies(watchlistId, {
				limit,
				offset,
			});
		},

		watchlistByStatus: async (
			_parent,
			{ status, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.watchlistService.getMoviesByStatus(
				context.user.id,
				status,
				{ limit, offset }
			);
		},

		watchlistByYear: async (
			_parent,
			{ year, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.watchlistService.getMoviesByYear(
				context.user.id,
				year,
				{ limit, offset }
			);
		},

		watchlistByGenre: async (
			_parent,
			{ genre, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.watchlistService.getMoviesByGenre(
				context.user.id,
				genre,
				{ limit, offset }
			);
		},
	},

	Mutation: {
		createWatchlist: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const { name, description } = input;

			return await context.watchlistService.create({
				userId: context.user.id,
				name,
				description,
				isPublic: false,
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

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

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

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to delete this watchlist'
				);
			}

			await context.watchlistService.delete(id);
			return true;
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

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to update this watchlist'
				);
			}

			await context.watchlistService.addMovie(watchlistId, movieId);
			return await context.watchlistService.findById(watchlistId);
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

			if (!watchlist) {
				throw new UserInputError('Watchlist not found');
			}

			if (watchlist.userId !== context.user.id) {
				throw new AuthenticationError(
					'Not authorized to update this watchlist'
				);
			}

			await context.watchlistService.removeMovie(watchlistId, movieId);
			return await context.watchlistService.findById(watchlistId);
		},

		reorderWatchlist: async (
			_parent,
			{ movieIds },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// Implement logic to reorder movies in watchlist
			await context.watchlistService.reorderMovies(context.user.id, movieIds);
			return true;
		},

		updateWatchlistPriority: async (
			_parent,
			{ movieId, priority },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			await context.watchlistService.updateMoviePriority(
				context.user.id,
				movieId,
				priority
			);
			return true;
		},

		bulkUpdateWatchlistStatus: async (
			_parent,
			{ movieIds, status },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			await context.watchlistService.bulkUpdateStatus(
				context.user.id,
				movieIds,
				status
			);
			return true;
		},
	},

	Watchlist: {
		movies: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.getMovies(parent.id);
		},

		movieCount: async (parent, _args, context: GraphQLContext) => {
			const movies = await context.watchlistService.getMovies(parent.id);
			return movies.length;
		},

		user: async (parent, _args, context: GraphQLContext) => {
			return await context.userService.findById(parent.userId);
		},
	},
};
