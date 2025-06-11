import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';
import { MovieController } from '../../api/controllers/MovieController';

export const movieResolvers: IResolvers = {
	Query: {
		movie: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			return await movieController.getMovie(id, context.user);
		},

		movies: async (
			_parent,
			{ search, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			return await movieController.getUserMovies(context.user, {
				search,
				limit,
				offset,
			});
		},

		favorites: async (
			_parent,
			{ limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			return await movieController.getFavorites(context.user, {
				limit,
				offset,
			});
		},
	},

	Mutation: {
		createMovie: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			return await movieController.addMovie(input, context.user);
		},

		updateMovie: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			return await movieController.updateMovie(id, input, context.user);
		},

		deleteMovie: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			await movieController.deleteMovie(id, context.user);
			return true;
		},

		toggleFavorite: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieController = new MovieController(
				context.movieService,
				context.favoriteService
			);

			const result = await movieController.toggleFavorite(
				movieId,
				context.user
			);
			return result.action === 'added';
		},
	},
};
