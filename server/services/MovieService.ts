import { Movie } from '../models/Movie';
import { Favorite } from '../models/Favorite';
import { Watchlist } from '../models/Watchlist';
import { IMovie, IUser, SearchInput } from '../types';
import { NotFoundError, AuthorizationError } from '../utils/errors';

export class MovieService {
	static async addMovie(input: Partial<IMovie>, user: IUser): Promise<IMovie> {
		const movie = new Movie({
			...input,
			user: user._id,
		});
		await movie.save();
		return movie.populate('user');
	}

	static async updateMovie(
		id: string,
		input: Partial<IMovie>,
		user: IUser
	): Promise<IMovie> {
		const movie = await Movie.findOne({ _id: id, user: user._id });
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		Object.assign(movie, input);
		await movie.save();
		return movie.populate('user');
	}

	static async deleteMovie(id: string, user: IUser): Promise<boolean> {
		const movie = await Movie.findOneAndDelete({ _id: id, user: user._id });
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		// Remove from favorites and watchlists
		await Promise.all([
			Favorite.deleteMany({ movie: id }),
			Watchlist.updateMany({ movies: id }, { $pull: { movies: id } }),
		]);

		return true;
	}

	static async getMovie(id: string, user: IUser): Promise<IMovie> {
		const movie = await Movie.findOne({ _id: id, user: user._id }).populate(
			'user'
		);
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}
		return movie;
	}

	static async getMovies(input: SearchInput, user: IUser): Promise<IMovie[]> {
		const {
			limit = 10,
			offset = 0,
			search,
			sortBy = 'createdAt',
			sortOrder = 'desc',
		} = input;

		const query: any = { user: user._id };
		if (search) {
			query.$text = { $search: search };
		}

		return Movie.find(query)
			.sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
			.skip(offset)
			.limit(limit)
			.populate('user');
	}

	static async toggleFavorite(movieId: string, user: IUser): Promise<boolean> {
		const movie = await Movie.findOne({ _id: movieId });
		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		const favorite = await Favorite.findOne({ movie: movieId, user: user._id });
		if (favorite) {
			await favorite.deleteOne();
			return false;
		}

		await new Favorite({ movie: movieId, user: user._id }).save();
		return true;
	}

	static async getFavorites(
		user: IUser,
		input: SearchInput
	): Promise<IMovie[]> {
		const { limit = 10, offset = 0 } = input;

		const favorites = await Favorite.find({ user: user._id })
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate({
				path: 'movie',
				populate: { path: 'user' },
			});

		return favorites.map((fav) => fav.movie as IMovie);
	}

	static async addToWatchlist(
		movieId: string,
		watchlistId: string,
		user: IUser
	): Promise<void> {
		const [movie, watchlist] = await Promise.all([
			Movie.findOne({ _id: movieId }),
			Watchlist.findOne({ _id: watchlistId, user: user._id }),
		]);

		if (!movie) throw new NotFoundError('Movie not found');
		if (!watchlist) throw new NotFoundError('Watchlist not found');

		if (!watchlist.movies.includes(movieId)) {
			watchlist.movies.push(movieId);
			await watchlist.save();
		}
	}

	static async removeFromWatchlist(
		movieId: string,
		watchlistId: string,
		user: IUser
	): Promise<void> {
		const watchlist = await Watchlist.findOne({
			_id: watchlistId,
			user: user._id,
		});
		if (!watchlist) throw new NotFoundError('Watchlist not found');

		watchlist.movies = watchlist.movies.filter(
			(id) => id.toString() !== movieId
		);
		await watchlist.save();
	}
}
