import { Request, Response } from 'express';
import { FavoriteService } from '../services/FavoriteService';
import { SearchInput } from '../types';

export class FavoriteController {
	static async addFavorite(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const { movieId } = req.body;

			if (!movieId || isNaN(parseInt(movieId, 10))) {
				res.status(400).json({ error: 'Valid movie ID is required' });
				return;
			}

			try {
				const favorite = await FavoriteService.addFavorite(
					parseInt(movieId, 10),
					req.user
				);

				res.status(201).json({
					message: 'Movie added to favorites successfully',
					data: favorite,
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

				if ((error as Error).name === 'ConflictError') {
					res.status(409).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error adding movie to favorites:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while adding movie to favorites' });
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

			try {
				const movies = await FavoriteService.getFavoriteMovies(
					req.user,
					searchParams
				);

				res.status(200).json({
					message: 'Favorite movies retrieved successfully',
					data: movies,
				});
			} catch (error) {
				if ((error as Error).name === 'AuthorizationError') {
					res.status(403).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error getting favorite movies:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving favorite movies' });
		}
	}

	static async removeFavorite(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = parseInt(req.params.movieId, 10);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				await FavoriteService.removeFavorite(movieId, req.user);

				res.status(200).json({
					message: 'Movie removed from favorites successfully',
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
			console.error('Error removing movie from favorites:', error);
			res.status(500).json({
				error: 'An error occurred while removing movie from favorites',
			});
		}
	}

	static async checkFavorite(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = parseInt(req.params.movieId, 10);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				const isFavorite = await FavoriteService.isFavorite(movieId, req.user);

				res.status(200).json({
					message: 'Favorite status checked successfully',
					data: { isFavorite },
				});
			} catch (error) {
				if ((error as Error).name === 'NotFoundError') {
					res.status(404).json({ error: (error as Error).message });
					return;
				}

				throw error;
			}
		} catch (error) {
			console.error('Error checking favorite status:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while checking favorite status' });
		}
	}
}
