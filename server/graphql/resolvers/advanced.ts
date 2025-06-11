import { GraphQLContext } from '../context';
import { MovieService } from '../../services/movie';
import { MovieReviewService } from '../../services/review';
import { WatchlistService } from '../../services/watchlist';
import { FavoriteService } from '../../services/favorite';
import { UserService } from '../../services/user';
import { NotFoundError, BadRequestError } from '../../utils/errors';

export const advancedResolvers = {
	Query: {
		searchMovies: async (
			_: any,
			{ input }: { input: any },
			{ services }: GraphQLContext
		) => {
			const { movies, total, page, totalPages, hasMore } =
				await services.movie.searchMovies(input);
			return { movies, total, page, totalPages, hasMore };
		},

		userStats: async (
			_: any,
			{ userId }: { userId: string },
			{ services, user }: GraphQLContext
		) => {
			if (user.id !== parseInt(userId) && user.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view these stats');
			}

			const [
				totalReviews,
				averageRating,
				totalWatchlist,
				totalFavorites,
				mostWatchedGenres,
				recentActivity,
				monthlyStats,
			] = await Promise.all([
				services.review.getUserReviewCount(userId),
				services.review.getUserAverageRating(userId),
				services.watchlist.getUserWatchlistCount(userId),
				services.favorite.getUserFavoriteCount(userId),
				services.movie.getUserMostWatchedGenres(userId),
				services.user.getUserRecentActivity(userId),
				services.user.getUserMonthlyStats(userId, new Date().getFullYear()),
			]);

			return {
				totalReviews,
				averageRating,
				totalWatchlist,
				totalFavorites,
				mostWatchedGenres,
				recentActivity,
				monthlyStats,
			};
		},

		userActivity: async (
			_: any,
			{
				userId,
				type,
				limit,
			}: { userId: string; type?: string; limit?: number },
			{ services, user }: GraphQLContext
		) => {
			if (user.id !== parseInt(userId) && user.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view this activity');
			}
			return services.user.getUserActivity(userId, type, limit);
		},

		userMonthlyStats: async (
			_: any,
			{ userId, year }: { userId: string; year: number },
			{ services, user }: GraphQLContext
		) => {
			if (user.id !== parseInt(userId) && user.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view these stats');
			}
			return services.user.getUserMonthlyStats(userId, year);
		},

		recommendedMovies: async (
			_: any,
			{ limit }: { limit: number },
			{ services, user }: GraphQLContext
		) => {
			return services.movie.getRecommendedMovies(user.id, limit);
		},

		similarMovies: async (
			_: any,
			{ movieId, limit }: { movieId: string; limit: number },
			{ services }: GraphQLContext
		) => {
			return services.movie.getSimilarMovies(movieId, limit);
		},

		popularMoviesByGenre: async (
			_: any,
			{ genre, limit }: { genre: string; limit: number },
			{ services }: GraphQLContext
		) => {
			return services.movie.getPopularMoviesByGenre(genre, limit);
		},

		watchlistByStatus: async (
			_: any,
			{
				status,
				limit,
				offset,
			}: { status: string; limit?: number; offset?: number },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByStatus(
				user.id,
				status,
				limit,
				offset
			);
		},

		watchlistByYear: async (
			_: any,
			{
				year,
				limit,
				offset,
			}: { year: number; limit?: number; offset?: number },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByYear(
				user.id,
				year,
				limit,
				offset
			);
		},

		watchlistByGenre: async (
			_: any,
			{
				genre,
				limit,
				offset,
			}: { genre: string; limit?: number; offset?: number },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByGenre(
				user.id,
				genre,
				limit,
				offset
			);
		},

		reviewStats: async (
			_: any,
			{ movieId }: { movieId: string },
			{ services }: GraphQLContext
		) => {
			const [averageRating, totalReviews, ratingDistribution, topReviewers] =
				await Promise.all([
					services.review.getMovieAverageRating(movieId),
					services.review.getMovieReviewCount(movieId),
					services.review.getMovieRatingDistribution(movieId),
					services.review.getMovieTopReviewers(movieId),
				]);

			return {
				averageRating,
				totalReviews,
				ratingDistribution,
				topReviewers,
			};
		},

		topReviewedMovies: async (
			_: any,
			{ limit }: { limit: number },
			{ services }: GraphQLContext
		) => {
			return services.movie.getTopReviewedMovies(limit);
		},

		recentReviews: async (
			_: any,
			{ limit }: { limit: number },
			{ services }: GraphQLContext
		) => {
			return services.review.getRecentReviews(limit);
		},
	},

	Mutation: {
		batchMovieOperation: async (
			_: any,
			{ input }: { input: { ids: string[]; action: string } },
			{ services, user }: GraphQLContext
		) => {
			const { ids, action } = input;
			const results = { success: true, affectedIds: [], errors: [] };

			for (const id of ids) {
				try {
					switch (action) {
						case 'ADD_TO_WATCHLIST':
							await services.watchlist.add(user.id, id);
							break;
						case 'REMOVE_FROM_WATCHLIST':
							await services.watchlist.remove(user.id, id);
							break;
						case 'ADD_TO_FAVORITES':
							await services.favorite.add(user.id, id);
							break;
						case 'REMOVE_FROM_FAVORITES':
							await services.favorite.remove(user.id, id);
							break;
						case 'DELETE_REVIEWS':
							await services.review.deleteByMovieId(user.id, id);
							break;
						default:
							throw new BadRequestError(`Invalid action: ${action}`);
					}
					results.affectedIds.push(id);
				} catch (error) {
					results.errors.push({ id, message: error.message });
				}
			}

			results.success = results.errors.length === 0;
			return results;
		},

		batchReviewOperation: async (
			_: any,
			{ movieIds, action }: { movieIds: string[]; action: string },
			{ services, user }: GraphQLContext
		) => {
			const results = { success: true, affectedIds: [], errors: [] };

			for (const movieId of movieIds) {
				try {
					switch (action) {
						case 'DELETE_REVIEWS':
							await services.review.deleteByMovieId(user.id, movieId);
							break;
						default:
							throw new BadRequestError(`Invalid action: ${action}`);
					}
					results.affectedIds.push(movieId);
				} catch (error) {
					results.errors.push({ id: movieId, message: error.message });
				}
			}

			results.success = results.errors.length === 0;
			return results;
		},

		updateMovieStatus: async (
			_: any,
			{
				movieId,
				status,
				rating,
				review,
			}: { movieId: string; status: string; rating?: number; review?: string },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.updateStatus(
				user.id,
				movieId,
				status,
				rating,
				review
			);
		},

		updateMultipleMovies: async (
			_: any,
			{
				input,
			}: {
				input: Array<{
					movieId: string;
					status?: string;
					rating?: number;
					review?: string;
				}>;
			},
			{ services, user }: GraphQLContext
		) => {
			const results = [];
			for (const item of input) {
				const { movieId, status, rating, review } = item;
				try {
					const result = await services.watchlist.updateStatus(
						user.id,
						movieId,
						status,
						rating,
						review
					);
					results.push(result);
				} catch (error) {
					throw new BadRequestError(
						`Failed to update movie ${movieId}: ${error.message}`
					);
				}
			}
			return results;
		},

		updateReview: async (
			_: any,
			{
				reviewId,
				rating,
				content,
			}: { reviewId: string; rating?: number; content?: string },
			{ services, user }: GraphQLContext
		) => {
			return services.review.update(reviewId, user.id, { rating, content });
		},

		deleteReview: async (
			_: any,
			{ reviewId }: { reviewId: string },
			{ services, user }: GraphQLContext
		) => {
			return services.review.delete(reviewId, user.id);
		},

		reportReview: async (
			_: any,
			{ reviewId, reason }: { reviewId: string; reason: string },
			{ services, user }: GraphQLContext
		) => {
			return services.review.report(reviewId, user.id, reason);
		},

		reorderWatchlist: async (
			_: any,
			{ movieIds }: { movieIds: string[] },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.reorder(user.id, movieIds);
		},

		updateWatchlistPriority: async (
			_: any,
			{ movieId, priority }: { movieId: string; priority: number },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.updatePriority(user.id, movieId, priority);
		},

		bulkUpdateWatchlistStatus: async (
			_: any,
			{ movieIds, status }: { movieIds: string[]; status: string },
			{ services, user }: GraphQLContext
		) => {
			return services.watchlist.bulkUpdateStatus(user.id, movieIds, status);
		},

		updateUserPreferences: async (
			_: any,
			{ preferences }: { preferences: any },
			{ services, user }: GraphQLContext
		) => {
			return services.user.updatePreferences(user.id, preferences);
		},

		updateNotificationSettings: async (
			_: any,
			{ settings }: { settings: any },
			{ services, user }: GraphQLContext
		) => {
			return services.user.updateNotificationSettings(user.id, settings);
		},
	},
};
