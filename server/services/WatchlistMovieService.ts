import { WatchlistMovie } from '../helpers/WatchlistMovie';
import { Watchlist } from '../helpers/Watchlist';
import { Movie } from '../helpers/Movie';
import {
	WatchlistMovie as WatchlistMovieType,
	Movie as MovieType,
	User,
	SearchInput,
} from '../types';
import {
	AuthorizationError,
	NotFoundError,
	ConflictError,
} from '../utils/errors';

export class WatchlistMovieService {
	static async addMovieToWatchlist(
		watchlistId: number,
		movieId: number,
		user: User
	): Promise<WatchlistMovieType> {
		// Check if the watchlist exists and belongs to the user
		const watchlist = await Watchlist.findById(watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to modify this watchlist'
			);
		}

		// Check if the movie exists
		const movie = await Movie.findById(movieId);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		try {
			// Add the movie to the watchlist
			return await WatchlistMovie.create({
				watchlistId,
				movieId,
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes('already in the watchlist')
			) {
				throw new ConflictError('Movie is already in the watchlist');
			}
			throw error;
		}
	}

	static async removeMovieFromWatchlist(
		watchlistId: number,
		movieId: number,
		user: User
	): Promise<void> {
		// Check if the watchlist exists and belongs to the user
		const watchlist = await Watchlist.findById(watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to modify this watchlist'
			);
		}

		// Check if the movie is in the watchlist
		const watchlistMovie = await WatchlistMovie.findByWatchlistIdAndMovieId(
			watchlistId,
			movieId
		);

		if (!watchlistMovie) {
			throw new NotFoundError('Movie is not in the watchlist');
		}

		// Remove the movie from the watchlist
		await WatchlistMovie.deleteByWatchlistIdAndMovieId(watchlistId, movieId);
	}

	static async getWatchlistMovies(
		watchlistId: number,
		user: User,
		params?: SearchInput
	): Promise<MovieType[]> {
		const watchlist = await Watchlist.findById(watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		// Check if the user can access this watchlist
		if (watchlist.userId !== user.id && !watchlist.isPublic) {
			throw new AuthorizationError(
				'You do not have permission to view this watchlist'
			);
		}

		return WatchlistMovie.getMoviesByWatchlistId(watchlistId, params);
	}

	static async getWatchlistMovieEntries(
		watchlistId: number,
		user: User,
		params?: SearchInput
	): Promise<WatchlistMovieType[]> {
		const watchlist = await Watchlist.findById(watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		// Check if the user can access this watchlist
		if (watchlist.userId !== user.id && !watchlist.isPublic) {
			throw new AuthorizationError(
				'You do not have permission to view this watchlist'
			);
		}

		return WatchlistMovie.findByWatchlistId(watchlistId, params);
	}

	static async getWatchlistMovie(
		id: number,
		user: User
	): Promise<WatchlistMovieType> {
		const watchlistMovie = await WatchlistMovie.findById(id);

		if (!watchlistMovie) {
			throw new NotFoundError('Watchlist movie entry not found');
		}

		// Check if the user can access this watchlist
		const watchlist = await Watchlist.findById(watchlistMovie.watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id && !watchlist.isPublic) {
			throw new AuthorizationError(
				'You do not have permission to view this watchlist'
			);
		}

		return watchlistMovie;
	}

	static async deleteWatchlistMovie(id: number, user: User): Promise<void> {
		const watchlistMovie = await WatchlistMovie.findById(id);

		if (!watchlistMovie) {
			throw new NotFoundError('Watchlist movie entry not found');
		}

		// Check if the user can access this watchlist
		const watchlist = await Watchlist.findById(watchlistMovie.watchlistId);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to modify this watchlist'
			);
		}

		await WatchlistMovie.delete(id);
	}
}
