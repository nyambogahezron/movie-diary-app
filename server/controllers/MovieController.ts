import { Request, Response } from 'express';
import { MovieService } from '../services/MovieService';
import { SearchInput, MovieInput } from '../types';

export class MovieController {
	// Create or update a movie
	static async addMovie(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
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

			// Validate required fields
			if (!title || !tmdbId) {
				res.status(400).json({ error: 'Title and tmdbId are required' });
				return;
			}

			// Add movie
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

	// Get a single movie by ID
	static async getMovie(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
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

	// Get all movies for the current user
	static async getUserMovies(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			// Parse search, sort and pagination parameters
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

	// Update a movie
	static async updateMovie(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
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

	// Delete a movie
	static async deleteMovie(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
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

	// Toggle movie favorite status
	static async toggleFavorite(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
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
				const result = await MovieService.toggleFavorite(movieId, req.user);

				res.status(200).json({
					message: result.isFavorite
						? 'Movie added to favorites'
						: 'Movie removed from favorites',
					data: result,
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
			console.error('Error toggling favorite:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while updating favorite status' });
		}
	}

	// Get user's favorite movies
	static async getFavorites(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const favorites = await MovieService.getFavorites(req.user);

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
