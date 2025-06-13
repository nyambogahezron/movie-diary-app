import { BadRequestError, UnauthorizedError } from '../../errors';
import { GraphQLContext } from '../context';

export const advancedResolvers = {
	Query: {
		searchMovies: async (
			_: any,
			{ input }: { input: any },
			{ services }: GraphQLContext
		) => {
			const movies = await services.movie.search(input);
			return {
				movies,
				total: movies.length,
				page: input.offset ? Math.floor(input.offset / input.limit) + 1 : 1,
				totalPages: Math.ceil(movies.length / (input.limit || 10)),
				hasMore: movies.length === (input.limit || 10),
			};
		},

		userStats: async (
			_: any,
			{ userId }: { userId: string },
			{ services, user }: GraphQLContext
		) => {
			if (user?.id !== parseInt(userId) && user?.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view these stats');
			}

			const [
				totalReviews,
				averageRating,
				totalWatchlist,
				totalFavorites,
				mostWatchedGenres,
				recentActivity,
			] = await Promise.all([
				services.review.getReviewCount(parseInt(userId)),
				services.review.getAverageRating(parseInt(userId)),
				services.watchlist.getMovieCount(parseInt(userId)),
				services.favorite
					.findByUserId(parseInt(userId), { limit: 1000 })
					.then((favorites) => favorites.length),
				services.movie.findPopularByGenre('all', 1000).then((movies) => {
					const genres = movies.flatMap((movie) =>
						JSON.parse(movie.genres || '[]')
					);
					const genreCount = genres.reduce((acc, genre) => {
						acc[genre] = (acc[genre] || 0) + 1;
						return acc;
					}, {} as Record<string, number>);
					const entries = Object.entries(genreCount) as [string, number][];
					return entries
						.sort(([, a], [, b]) => b - a)
						.slice(0, 5)
						.map(([genre]) => genre);
				}),
				services.review
					.findRecent(10)
					.then((reviews) =>
						reviews.filter((review) => review.userId === parseInt(userId))
					),
			]);

			const monthlyStats = {
				year: new Date().getFullYear(),
				totalMovies: totalWatchlist,
				totalReviews,
				averageRating,
				totalFavorites,
				mostWatchedGenres,
			};

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
			if (user?.id !== parseInt(userId) && user?.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view this activity');
			}
			return services.review
				.findRecent(limit || 10)
				.then((reviews) =>
					reviews.filter((review) => review.userId === parseInt(userId))
				);
		},

		userMonthlyStats: async (
			_: any,
			{ userId, year }: { userId: string; year: number },
			{ services, user }: GraphQLContext
		) => {
			if (user?.id !== parseInt(userId) && user?.role !== 'ADMIN') {
				throw new UnauthorizedError('Not authorized to view these stats');
			}
			const [
				totalWatchlist,
				totalReviews,
				averageRating,
				totalFavorites,
				mostWatchedGenres,
			] = await Promise.all([
				services.watchlist.getMovieCount(parseInt(userId)),
				services.review.getReviewCount(parseInt(userId)),
				services.review.getAverageRating(parseInt(userId)),
				services.favorite
					.findByUserId(parseInt(userId), { limit: 1000 })
					.then((favorites) => favorites.length),
				services.movie.findPopularByGenre('all', 1000).then((movies) => {
					const genres = movies.flatMap((movie) =>
						JSON.parse(movie.genres || '[]')
					);
					const genreCount = genres.reduce((acc, genre) => {
						acc[genre] = (acc[genre] || 0) + 1;
						return acc;
					}, {} as Record<string, number>);
					const entries = Object.entries(genreCount) as [string, number][];
					return entries
						.sort(([, a], [, b]) => b - a)
						.slice(0, 5)
						.map(([genre]) => genre);
				}),
			]);
			return {
				year,
				totalMovies: totalWatchlist,
				totalReviews,
				averageRating,
				totalFavorites,
				mostWatchedGenres,
			};
		},

		recommendedMovies: async (
			_: any,
			{ limit }: { limit: number },
			{ services, user }: GraphQLContext
		) => {
			if (!user) throw new UnauthorizedError('User not authenticated');
			return services.movie.findPopular(limit);
		},

		similarMovies: async (
			_: any,
			{ movieId, limit }: { movieId: string; limit: number },
			{ services }: GraphQLContext
		) => {
			return services.movie.findSimilar(parseInt(movieId), limit);
		},

		popularMoviesByGenre: async (
			_: any,
			{ genre, limit }: { genre: string; limit: number },
			{ services }: GraphQLContext
		) => {
			return services.movie.findPopularByGenre(genre, limit);
		},

		watchlistByStatus: async (
			_: any,
			{
				watchlistId,
				status,
			}: {
				watchlistId: number;
				status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH';
			},
			{ services }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByStatus(watchlistId, status);
		},

		watchlistByYear: async (
			_: any,
			{ watchlistId, year }: { watchlistId: number; year: number },
			{ services }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByYear(watchlistId, year);
		},

		watchlistByGenre: async (
			_: any,
			{ watchlistId, genre }: { watchlistId: number; genre: string },
			{ services }: GraphQLContext
		) => {
			return services.watchlist.getWatchlistByGenre(watchlistId, genre);
		},

		reviewStats: async (
			_: any,
			{ movieId }: { movieId: string },
			{ services }: GraphQLContext
		) => {
			const [averageRating, totalReviews, ratingDistribution, topReviewers] =
				await Promise.all([
					services.review.getAverageRating(parseInt(movieId)),
					services.review.getMovieReviewCount(parseInt(movieId)),
					services.review.getMovieRatingDistribution(parseInt(movieId)),
					services.review.getMovieTopReviewers(parseInt(movieId)),
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
			return services.review.findRecent(limit);
		},
	},

	Mutation: {
		batchMovieOperation: async (
			_: any,
			{ input }: { input: { ids: string[]; action: string } },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}

			const { ids, action } = input;
			const results: {
				success: boolean;
				affectedIds: number[];
				errors: Array<{ id: string; message: string }>;
			} = { success: true, affectedIds: [], errors: [] };

			for (const id of ids) {
				try {
					const movieId = parseInt(id);
					if (isNaN(movieId)) {
						throw new Error('Invalid movie ID');
					}

					switch (action) {
						case 'ADD_TO_WATCHLIST':
							await services.watchlist.add(user.id, movieId);
							break;
						case 'REMOVE_FROM_WATCHLIST':
							await services.watchlist.remove(user.id, movieId);
							break;
						case 'ADD_TO_FAVORITES':
							await services.favorite.add(user.id, movieId);
							break;
						case 'REMOVE_FROM_FAVORITES':
							await services.favorite.remove(user.id, movieId);
							break;
						case 'DELETE_REVIEWS':
							await services.review.deleteByMovieId(user.id, movieId);
							break;
						default:
							throw new BadRequestError(`Invalid action: ${action}`);
					}
					results.affectedIds.push(movieId);
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error
							? error.message
							: 'An unknown error occurred';
					results.errors.push({ id, message: errorMessage });
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
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}

			const results: {
				success: boolean;
				affectedIds: number[];
				errors: Array<{ id: string; message: string }>;
			} = { success: true, affectedIds: [], errors: [] };

			for (const movieId of movieIds) {
				try {
					const id = parseInt(movieId);
					if (isNaN(id)) {
						throw new Error('Invalid movie ID');
					}

					switch (action) {
						case 'DELETE_REVIEWS':
							await services.review.deleteByMovieId(user.id, id);
							break;
						default:
							throw new BadRequestError(`Invalid action: ${action}`);
					}
					results.affectedIds.push(id);
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error
							? error.message
							: 'An unknown error occurred';
					results.errors.push({ id: movieId, message: errorMessage });
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
			}: { movieId: string; status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH' },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.watchlist.updateStatus(
				user.id,
				parseInt(movieId),
				status
			);
		},

		updateMultipleMovies: async (
			_: any,
			{
				input,
			}: {
				input: Array<{
					movieId: string;
					status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH';
				}>;
			},
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			const results = [];
			for (const item of input) {
				const { movieId, status } = item;
				try {
					const result = await services.watchlist.updateStatus(
						user.id,
						parseInt(movieId),
						status
					);
					results.push(result);
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error
							? error.message
							: 'An unknown error occurred';
					throw new BadRequestError(
						`Failed to update movie ${movieId}: ${errorMessage}`
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
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.review.update(parseInt(reviewId), { rating, content });
		},

		deleteReview: async (
			_: any,
			{ reviewId }: { reviewId: string },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.review.delete(parseInt(reviewId));
		},

		reportReview: async (
			_: any,
			{ reviewId, reason }: { reviewId: string; reason: string },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.review.report(parseInt(reviewId), user.id, reason);
		},

		reorderWatchlist: async (
			_: any,
			{ movieIds }: { movieIds: string[] },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.watchlist.reorder(
				user.id,
				movieIds.map((id) => parseInt(id))
			);
		},

		updateWatchlistPriority: async (
			_: any,
			{
				movieId,
				priority,
			}: { movieId: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.watchlist.updatePriority(
				user.id,
				parseInt(movieId),
				priority
			);
		},

		bulkUpdateWatchlistStatus: async (
			_: any,
			{
				movieIds,
				status,
			}: {
				movieIds: string[];
				status: 'WATCHED' | 'WATCHING' | 'PLAN_TO_WATCH';
			},
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.watchlist.bulkUpdateStatus(
				user.id,
				movieIds.map((id) => parseInt(id)),
				status
			);
		},

		updateUserPreferences: async (
			_: any,
			{ preferences }: { preferences: any },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.user.updatePreferences(user.id, preferences);
		},

		updateNotificationSettings: async (
			_: any,
			{ settings }: { settings: any },
			{ services, user }: GraphQLContext
		) => {
			if (!user) {
				throw new UnauthorizedError('Not authenticated');
			}
			return services.user.updateNotificationSettings(user.id, settings);
		},
	},
};
