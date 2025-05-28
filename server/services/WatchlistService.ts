import { Watchlist } from '../helpers/Watchlist';
import { IWatchlist, IUser, SearchInput } from '../types';
import { NotFoundError, ConflictError } from '../utils/errors';

export class WatchlistService {
	static async createWatchlist(
		name: string,
		user: IUser,
		description?: string,
		isPublic: boolean = false
	): Promise<IWatchlist> {
		const existingWatchlist = await Watchlist.findOne({ user: user._id, name });
		if (existingWatchlist) {
			throw new ConflictError('Watchlist with this name already exists');
		}

		const watchlist = new Watchlist({
			name,
			user: user._id,
			description,
			isPublic,
			movies: [],
		});

		await watchlist.save();
		return watchlist.populate('user');
	}

	static async updateWatchlist(
		id: string,
		user: IUser,
		updates: Partial<IWatchlist>
	): Promise<IWatchlist> {
		const watchlist = await Watchlist.findOne({ _id: id, user: user._id });
		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		if (updates.name && updates.name !== watchlist.name) {
			const existingWatchlist = await Watchlist.findOne({
				user: user._id,
				name: updates.name,
			});
			if (existingWatchlist) {
				throw new ConflictError('Watchlist with this name already exists');
			}
		}

		Object.assign(watchlist, updates);
		await watchlist.save();
		return watchlist.populate('user');
	}

	static async deleteWatchlist(id: string, user: IUser): Promise<boolean> {
		const watchlist = await Watchlist.findOneAndDelete({
			_id: id,
			user: user._id,
		});
		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}
		return true;
	}

	static async getWatchlist(id: string, user: IUser): Promise<IWatchlist> {
		const watchlist = await Watchlist.findOne({
			_id: id,
			$or: [{ user: user._id }, { isPublic: true }],
		}).populate(['user', 'movies']);

		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		return watchlist;
	}

	static async getUserWatchlists(
		user: IUser,
		input: SearchInput
	): Promise<IWatchlist[]> {
		const { limit = 10, offset = 0 } = input;

		return Watchlist.find({ user: user._id })
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate(['user', 'movies']);
	}

	static async getPublicWatchlists(input: SearchInput): Promise<IWatchlist[]> {
		const { limit = 10, offset = 0 } = input;

		return Watchlist.find({ isPublic: true })
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate(['user', 'movies']);
	}

	static async reorderMovies(
		id: string,
		user: IUser,
		movieIds: string[]
	): Promise<IWatchlist> {
		const watchlist = await Watchlist.findOne({ _id: id, user: user._id });
		if (!watchlist) {
			throw new NotFoundError('Watchlist not found');
		}

		// Verify all movies exist in the watchlist
		const existingMovies = new Set(watchlist.movies.map((id) => id.toString()));
		const allMoviesExist = movieIds.every((id) => existingMovies.has(id));

		if (!allMoviesExist) {
			throw new ValidationError(
				'Invalid movie order: some movies do not exist in the watchlist'
			);
		}

		watchlist.movies = movieIds;
		await watchlist.save();
		return watchlist.populate(['user', 'movies']);
	}
}
