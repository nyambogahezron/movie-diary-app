import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';

export const favoriteResolvers: IResolvers = {
	Query: {
		favorites: async (
			_parent,
			{ userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// If requesting someone else's favorites, check if authorized
			if (userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to view these favorites');
			}

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
		addFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// Check if movie exists
			const movie = await context.movieService.findById(movieId);

			if (!movie) {
				throw new UserInputError('Movie not found');
			}

			// Check if already a favorite
			const isFavorite = await context.favoriteService.isFavorite(
				context.user.id,
				movieId
			);

			if (isFavorite) {
				throw new UserInputError('Movie is already in favorites');
			}

			return await context.favoriteService.add(context.user.id, movieId);
		},

		removeFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			// Check if it's a favorite
			const isFavorite = await context.favoriteService.isFavorite(
				context.user.id,
				movieId
			);

			if (!isFavorite) {
				throw new UserInputError('Movie is not in favorites');
			}

			await context.favoriteService.remove(context.user.id, movieId);
			return true;
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
