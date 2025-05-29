import { Movie } from '../helpers/Movie';
import { Favorite } from '../helpers/Favorite';
import { Watchlist } from '../helpers/Watchlist';
import { Movie as MovieType, MovieInput, User, SearchInput } from '../types';

// Define error classes
export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthorizationError';
	}
}

export class MovieService {
	static async addMovie(input: MovieInput, user: User): Promise<MovieType> {
		// Check if movie with this tmdbId already exists for this user
		const existingMovie = await Movie.findByTmdbId(input.tmdbId, user.id);

		if (existingMovie) {
			// If it exists, update it
			await Movie.update(existingMovie.id, input);
			return Movie.findById(existingMovie.id) as Promise<MovieType>;
		}

		// If not, create a new one
		return Movie.create({
			...input,
			userId: user.id,
		});
	}

	static async updateMovie(
		id: number,
		input: Partial<MovieInput>,
		user: User
	): Promise<MovieType> {
		// Get the movie and check if it belongs to the user
		const movie = await Movie.findById(id);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		if (movie.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to update this movie'
			);
		}

		// Update the movie
		await Movie.update(id, input);

		// Return the updated movie
		const updated = await Movie.findById(id);
		if (!updated) {
			throw new NotFoundError('Updated movie not found');
		}

		return updated;
	}

	static async deleteMovie(id: number, user: User): Promise<void> {
		// Get the movie and check if it belongs to the user
		const movie = await Movie.findById(id);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		if (movie.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to delete this movie'
			);
		}

		// Delete the movie
		await Movie.delete(id);
	}

	static async getMovie(
		id: number,
		user: User
	): Promise<MovieType & { isFavorite: boolean }> {
		// Get the movie
		const movie = await Movie.findById(id);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		// Check if the movie belongs to the user or is public
		if (movie.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to view this movie'
			);
		}

		// Check if the movie is a favorite
		const isFavorite = await Favorite.isFavorite(user.id, movie.id);

		return {
			...movie,
			isFavorite,
		};
	}

	static async getUserMovies(
		user: User,
		params?: SearchInput
	): Promise<MovieType[]> {
		// Get all movies for the user
		return Movie.findByUserId(user.id, params);
	}

	static async toggleFavorite(
		movieId: number,
		user: User
	): Promise<{ isFavorite: boolean }> {
		// Check if the movie exists and belongs to the user
		const movie = await Movie.findById(movieId);

		if (!movie) {
			throw new NotFoundError('Movie not found');
		}

		if (movie.userId !== user.id) {
			throw new AuthorizationError(
				'You do not have permission to favorite this movie'
			);
		}

		// Check if it's already a favorite
		const existingFavorite = await Favorite.findByUserIdAndMovieId(
			user.id,
			movieId
		);

		if (existingFavorite) {
			// If it's already a favorite, remove it
			await Favorite.delete(user.id, movieId);
			return { isFavorite: false };
		} else {
			// If it's not a favorite, add it
			await Favorite.create({ userId: user.id, movieId });
			return { isFavorite: true };
		}
	}

	static async getFavorites(
		user: User,
		params?: SearchInput
	): Promise<MovieType[]> {
		// Get all favorite movies for the user
		let movies = await Favorite.getFavoriteMoviesByUserId(user.id);

		// Apply search filter if provided
		if (params?.search) {
			const searchTerm = params.search.toLowerCase();
			movies = movies.filter(
				(movie) =>
					movie.title.toLowerCase().includes(searchTerm) ||
					(movie.overview && movie.overview.toLowerCase().includes(searchTerm))
			);
		}

		// Apply sorting if provided
		if (params?.sortBy) {
			const sortField = params.sortBy as keyof MovieType;
			const sortOrder = params?.sortOrder === 'desc' ? -1 : 1;

			movies.sort((a, b) => {
				if (a[sortField] < b[sortField]) return -1 * sortOrder;
				if (a[sortField] > b[sortField]) return 1 * sortOrder;
				return 0;
			});
		}

		// Apply pagination if provided
		if (params?.offset !== undefined || params?.limit !== undefined) {
			const offset = params?.offset || 0;
			const limit = params?.limit || movies.length;
			movies = movies.slice(offset, offset + limit);
		}

		return movies;
	}
}
