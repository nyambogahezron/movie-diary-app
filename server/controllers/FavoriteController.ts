import { Request, Response } from 'express';
import { FavoriteService } from '../services/FavoriteService';
import { SearchInput } from '../types';
import AsyncHandler from '../middleware/asyncHandler';

export class FavoriteController {
	static addFavorite = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const { movieId } = req.body;

			if (!movieId || isNaN(parseInt(movieId, 10))) {
				res.status(400).json({ error: 'Valid movie ID is required' });
				return;
			}

			const favorite = await FavoriteService.addFavorite(
				parseInt(movieId, 10),
				req.user
			);

			res.status(201).json({
				message: 'Movie added to favorites successfully',
				data: favorite,
			});
		}
	);

	static getFavorites = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
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

			const movies = await FavoriteService.getFavoriteMovies(
				req.user,
				searchParams
			);

			res.status(200).json({
				message: 'Favorite movies retrieved successfully',
				data: movies,
			});
		}
	);

	static removeFavorite = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = parseInt(req.params.movieId, 10);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			await FavoriteService.removeFavorite(movieId, req.user);

			res.status(200).json({
				message: 'Movie removed from favorites successfully',
			});
		}
	);

	static checkFavorite = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const movieId = parseInt(req.params.movieId, 10);

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			const isFavorite = await FavoriteService.isFavorite(movieId, req.user);

			res.status(200).json({
				message: 'Favorite status checked successfully',
				data: { isFavorite },
			});
		}
	);
}
