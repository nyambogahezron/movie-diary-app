import { Watchlist } from '../helpers/Watchlist';
import { Movie } from '../helpers/Movie';
import {
	Watchlist as WatchlistType,
	WatchlistInput,
	Movie as MovieType,
	User,
	SearchInput,
} from '../types';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../errors';

export class WatchlistService {
	static async createWatchlist(
		input: WatchlistInput,
		user: User
	): Promise<WatchlistType> {
		try {
			return await Watchlist.create({
				name: input.name,
				description: input.description ?? undefined,
				isPublic: input.isPublic ?? false,
				userId: user.id,
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes('already exists')) {
				throw new BadRequestError('A watchlist with this name already exists');
			}
			throw error;
		}
	}

	static async getWatchlists(user: User): Promise<WatchlistType[]> {
		return Watchlist.findByUserId(user.id);
	}

	static async getWatchlist(
		id: number,
		user: User
	): Promise<WatchlistType & { movies?: MovieType[] }> {
		const watchlist = await Watchlist.findById(id);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		// Check if the user can access this watchlist
		if (watchlist.userId !== user.id && !watchlist.isPublic) {
			throw new UnauthorizedError(
				'You do not have permission to view this watchlist'
			);
		}

		// Get movies in this watchlist
		const movies = await Watchlist.getMovies(id);

		return {
			...watchlist,
			movies,
		};
	}

	static async updateWatchlist(
		id: number,
		input: Partial<WatchlistType>,
		user: User
	): Promise<WatchlistType> {
		const watchlist = await Watchlist.findById(id);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id) {
			throw new UnauthorizedError(
				'You do not have permission to update this watchlist'
			);
		}

		// Update the watchlist
		await Watchlist.update(id, input);

		// Return the updated watchlist
		const updated = await Watchlist.findById(id);
		if (!updated) {
			throw new NotFoundError('Updated watchlist not found');
		}

		return updated;
	}

	static async deleteWatchlist(id: number, user: User): Promise<void> {
		const watchlist = await Watchlist.findById(id);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (watchlist.userId !== user.id) {
			throw new UnauthorizedError(
				'You do not have permission to delete this watchlist'
			);
		}

		// Delete the watchlist
		await Watchlist.delete(id);
	}

	static async getPublicWatchlists(
		params?: SearchInput
	): Promise<WatchlistType[]> {
		return Watchlist.findPublic(params);
	}

	static async addMovieToWatchlist(
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
			throw new UnauthorizedError(
				'You do not have permission to modify this watchlist'
			);
		}

		// Check if the movie exists
		const movie = await Movie.findById(movieId);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		// Add the movie to the watchlist
		await Watchlist.addMovie(watchlistId, movieId);
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
			throw new UnauthorizedError(
				'You do not have permission to modify this watchlist'
			);
		}

		// Remove the movie from the watchlist
		await Watchlist.removeMovie(watchlistId, movieId);
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
			throw new UnauthorizedError(
				'You do not have permission to view this watchlist'
			);
		}

		return Watchlist.getMovies(watchlistId, params);
	}
}
