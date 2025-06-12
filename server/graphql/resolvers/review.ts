import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';

export const reviewResolvers: IResolvers = {
	Query: {
		review: async (_parent, { id }, context: GraphQLContext) => {
			return await context.movieReviewService.findById(id);
		},

		reviews: async (
			_parent,
			{ movieId, userId, limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (movieId) {
				return await context.movieReviewService.findByMovieId(movieId, {
					limit,
					offset,
				});
			}

			if (userId) {
				return await context.movieReviewService.findByUserId(userId, {
					limit,
					offset,
				});
			}

			return await context.movieReviewService.findAll({ limit, offset });
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

		reviewStats: async (_parent, { movieId }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const reviews = await context.movieReviewService.findByMovieId(movieId);

			const ratingCounts = {
				total: reviews.length,
				average: 0,
				distribution: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
				},
			};

			let sum = 0;

			reviews.forEach((review) => {
				sum += review.rating;
				ratingCounts.distribution[review.rating]++;
			});

			if (reviews.length > 0) {
				ratingCounts.average = sum / reviews.length;
			}

			return ratingCounts;
		},

		recentReviews: async (_parent, { limit = 10 }, context: GraphQLContext) => {
			return await context.movieReviewService.findRecent(limit);
		},
	},

	Mutation: {
		createReview: async (_parent, { input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const { movieId, rating, review } = input;

			// Check if user already reviewed this movie
			const existingReview =
				await context.movieReviewService.findByUserAndMovie(
					context.user.id,
					movieId
				);

			if (existingReview) {
				throw new UserInputError('You have already reviewed this movie');
			}

			return await context.movieReviewService.create({
				userId: context.user.id,
				movieId,
				rating,
				review,
			});
		},

		updateReview: async (_parent, { id, input }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const existingReview = await context.movieReviewService.findById(id);

			if (!existingReview) {
				throw new UserInputError('Review not found');
			}

			if (
				existingReview.userId !== context.user.id &&
				context.user.role !== 'ADMIN' &&
				context.user.role !== 'MODERATOR'
			) {
				throw new AuthenticationError('Not authorized to update this review');
			}

			return await context.movieReviewService.update(id, input);
		},

		deleteReview: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const existingReview = await context.movieReviewService.findById(id);

			if (!existingReview) {
				throw new UserInputError('Review not found');
			}

			if (
				existingReview.userId !== context.user.id &&
				context.user.role !== 'ADMIN' &&
				context.user.role !== 'MODERATOR'
			) {
				throw new AuthenticationError('Not authorized to delete this review');
			}

			await context.movieReviewService.delete(id);
			return true;
		},

		reportReview: async (
			_parent,
			{ reviewId, reason },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const review = await context.movieReviewService.findById(reviewId);

			if (!review) {
				throw new UserInputError('Review not found');
			}

			// Here you would typically save the report to a reports collection
			await context.movieReviewService.reportReview(
				reviewId,
				context.user.id,
				reason
			);

			return true;
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
};
