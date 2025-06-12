import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';
import { MovieController } from '../../controllers/MovieController';

export const movieResolvers: IResolvers = {
	Query: {
		movie: async (_parent, { id }, context: GraphQLContext) => {
			const movie = await context.movieService.findById(id);

			// If user is authenticated, check if this movie is in their favorites
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

		similarMovies: async (
			_parent,
			{ movieId, limit = 10 },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.movieService.findSimilar(movieId, limit);
		},

		popularMoviesByGenre: async (
			_parent,
			{ genre, limit = 10 },
			context: GraphQLContext
		) => {
			return await context.movieService.findPopularByGenre(genre, limit);
		},
	},

	Mutation: {
		createMovie: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movieData = {
				...input,
				userId: context.user.id,
			};

			return await context.movieService.create(movieData);
		},

		updateMovie: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movie = await context.movieService.findById(id);

			if (!movie) {
				throw new UserInputError('Movie not found');
			}

			if (movie.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to update this movie');
			}

			return await context.movieService.update(id, input);
		},

		deleteMovie: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movie = await context.movieService.findById(id);

			if (!movie) {
				throw new UserInputError('Movie not found');
			}

			if (movie.userId !== context.user.id && context.user.role !== 'ADMIN') {
				throw new AuthenticationError('Not authorized to delete this movie');
			}

			await context.movieService.delete(id);
			return true;
		},

		updateMovieStatus: async (
			_parent,
			{ movieId, status, rating, review },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const movie = await context.movieService.findById(movieId);

			if (!movie) {
				throw new UserInputError('Movie not found');
			}

			const updateData: any = { status };
			if (rating !== undefined) updateData.rating = rating;
			if (review !== undefined) updateData.review = review;

			const updatedReview = await context.movieReviewService.findOrCreate(
				context.user.id,
				movieId
			);

			return await context.movieReviewService.update(
				updatedReview.id,
				updateData
			);
		},
	},

	Movie: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByMovieId(parent.id);
		},

		averageRating: async (parent, _args, context: GraphQLContext) => {
			const reviews = await context.movieReviewService.findByMovieId(parent.id);

			if (!reviews || reviews.length === 0) {
				return null;
			}

			const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
			return sum / reviews.length;
		},

		reviewCount: async (parent, _args, context: GraphQLContext) => {
			const reviews = await context.movieReviewService.findByMovieId(parent.id);
			return reviews.length;
		},

		isFavorite: async (parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				return null;
			}

			return await context.favoriteService.isFavorite(
				context.user.id,
				parent.id
			);
		},
	},
};
