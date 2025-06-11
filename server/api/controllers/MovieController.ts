import { User } from '../types';
import { MovieService } from '../../services/MovieService';
import { FavoriteService } from '../../services/FavoriteService';
import { SearchInput, MovieInput, MovieUpdateInput } from '../../types';
import { BadRequestError } from '../../errors';

export class MovieController {
	constructor(
		private movieService: MovieService,
		private favoriteService: FavoriteService
	) {}

	async addMovie(input: MovieInput, user: User) {
		if (!input.title || !input.tmdbId) {
			throw new BadRequestError('Title and tmdbId are required');
		}

		return await this.movieService.addMovie(input, user);
	}

	async getMovie(movieId: number, user: User) {
		if (isNaN(movieId)) {
			throw new BadRequestError('Invalid movie ID');
		}

		return await this.movieService.getMovie(movieId, user);
	}

	async getUserMovies(user: User, searchParams: SearchInput) {
		return await this.movieService.getUserMovies(user, searchParams);
	}

	async updateMovie(movieId: number, input: MovieUpdateInput, user: User) {
		if (isNaN(movieId)) {
			throw new BadRequestError('Invalid movie ID');
		}

		return await this.movieService.updateMovie(movieId, input, user);
	}

	async deleteMovie(movieId: number, user: User) {
		if (isNaN(movieId)) {
			throw new BadRequestError('Invalid movie ID');
		}

		await this.movieService.deleteMovie(movieId, user);
	}

	async toggleFavorite(movieId: number, user: User) {
		if (isNaN(movieId)) {
			throw new BadRequestError('Invalid movie ID');
		}

		const isFavorite = await this.favoriteService.isFavorite(movieId, user);

		if (isFavorite) {
			await this.favoriteService.removeFavorite(movieId, user);
			return { action: 'removed' as const };
		} else {
			await this.favoriteService.addFavorite(movieId, user);
			return { action: 'added' as const };
		}
	}

	async getFavorites(user: User, searchParams: SearchInput) {
		return await this.favoriteService.getUserFavorites(user, searchParams);
	}
}
