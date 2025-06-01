import { Request, Response } from 'express';
import { MovieService } from '../services/MovieService';
import { FavoriteService } from '../services/FavoriteService';
import { SearchInput, MovieInput } from '../types';

export class MovieController {
	static async addMovie(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const {
				title,
				tmdbId,
				posterPath,
				releaseDate,
				overview,
				rating,
				watchDate,
				review,
				genres,
			} = req.body;

			if (!title || !tmdbId) {
				res.status(400).json({ error: 'Title and tmdbId are required' });
				return;
			}

			const movie = await MovieService.addMovie(
				{
					title,
					tmdbId,
					posterPath,
					releaseDate,
					overview,
					rating,
					watchDate,
					review,
					genres,
				},
				req.user
			);

			res.status(201).json({
				message: 'Movie added successfully',
				data: movie,
			});
		} catch (error) {
			console.error('Error adding movie:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while adding the movie' });
		}
	}

	static async getMovie(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				const movie = await MovieService.getMovie(movieId, req.user);

				res.status(200).json({
					message: 'Movie retrieved successfully',
					data: movie,
				});
			} catch (error) {
				if ((error as Error).name === 'NotFoundError') {
					res.status(404).json({ error: (error as Error).message });
					return;
				}

				if ((error as Error).name === 'AuthorizationError') {
					res.status(403).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error getting movie:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving the movie' });
		}
	}

	static async getUserMovies(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const searchParams: SearchInput = {};

			if (req.query.search) {
				searchParams.search = req.query.search as string;
			}

			if (req.query.sortBy) {
				searchParams.sortBy = req.query.sortBy as string;
			}

			if (req.query.sortOrder) {
				searchParams.sortOrder = req.query.sortOrder as 'asc' | 'desc';
			}

			if (req.query.limit) {
				searchParams.limit = Number(req.query.limit);
			}

			if (req.query.offset) {
				searchParams.offset = Number(req.query.offset);
			}

			const movies = await MovieService.getUserMovies(req.user, searchParams);

			res.status(200).json({
				message: 'Movies retrieved successfully',
				data: movies,
			});
		} catch (error) {
			console.error('Error getting user movies:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving movies' });
		}
	}

	static async updateMovie(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				const movie = await MovieService.updateMovie(
					movieId,
					req.body,
					req.user
				);

				res.status(200).json({
					message: 'Movie updated successfully',
					data: movie,
				});
			} catch (error) {
				if ((error as Error).name === 'NotFoundError') {
					res.status(404).json({ error: (error as Error).message });
					return;
				}

				if ((error as Error).name === 'AuthorizationError') {
					res.status(403).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error updating movie:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while updating the movie' });
		}
	}

	static async deleteMovie(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				await MovieService.deleteMovie(movieId, req.user);

				res.status(200).json({
					message: 'Movie deleted successfully',
				});
			} catch (error) {
				if ((error as Error).name === 'NotFoundError') {
					res.status(404).json({ error: (error as Error).message });
					return;
				}

				if ((error as Error).name === 'AuthorizationError') {
					res.status(403).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error deleting movie:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while deleting the movie' });
		}
	}

	static async toggleFavorite(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				const movie = await MovieService.getMovie(movieId, req.user);

				const isFavorite = await FavoriteService.isFavorite(movieId, req.user);

				if (isFavorite) {
					await FavoriteService.removeFavorite(movieId, req.user);
					res.status(200).json({
						message: 'Movie removed from favorites',
						data: { isFavorite: false },
					});
				} else {
					await FavoriteService.addFavorite(movieId, req.user);
					res.status(200).json({
						message: 'Movie added to favorites',
						data: { isFavorite: true },
					});
				}
			} catch (error) {
				if ((error as Error).name === 'NotFoundError') {
					res.status(404).json({ error: (error as Error).message });
					return;
				}

				if ((error as Error).name === 'AuthorizationError') {
					res.status(403).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error toggling favorite status:', error);
			res.status(500).json({
				error: 'An error occurred while toggling favorite status',
			});
		}
	}

	static async getFavorites(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const searchParams: SearchInput = {};

			if (req.query.search) {
				searchParams.search = req.query.search as string;
			}

			if (req.query.sortBy) {
				searchParams.sortBy = req.query.sortBy as string;
			}

			if (req.query.sortOrder) {
				searchParams.sortOrder = req.query.sortOrder as 'asc' | 'desc';
			}

			if (req.query.limit) {
				searchParams.limit = parseInt(req.query.limit as string, 10);
			}

			if (req.query.offset) {
				searchParams.offset = parseInt(req.query.offset as string, 10);
			}

			const favorites = await MovieService.getFavorites(req.user, searchParams);

			res.status(200).json({
				message: 'Favorite movies retrieved successfully',
				data: favorites,
			});
		} catch (error) {
			console.error('Error getting favorites:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving favorite movies' });
		}
	}
}
