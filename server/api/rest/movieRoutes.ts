import { Router, Request, Response } from 'express';
import { MovieController } from '../controllers/MovieController';
import { MovieService } from '../../services/MovieService';
import { FavoriteService } from '../../services/FavoriteService';
import AsyncHandler from '../../middleware/asyncHandler';
import { BadRequestError } from '../../errors';

const router = Router();
const movieController = new MovieController(
	new MovieService(),
	new FavoriteService()
);

// Add movie
router.post(
	'/',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const movie = await movieController.addMovie(req.body, req.user);

		res.status(201).json({
			message: 'Movie added successfully',
			data: movie,
		});
	})
);

// Get movie
router.get(
	'/:id',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const movie = await movieController.getMovie(
			Number(req.params.id),
			req.user
		);

		res.status(200).json({
			message: 'Movie retrieved successfully',
			data: movie,
		});
	})
);

// Get user movies
router.get(
	'/',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const searchParams = {
			search: req.query.search as string,
			sortBy: req.query.sortBy as string,
			sortOrder: req.query.sortOrder as 'asc' | 'desc',
			limit: req.query.limit ? Number(req.query.limit) : undefined,
			offset: req.query.offset ? Number(req.query.offset) : undefined,
		};

		const movies = await movieController.getUserMovies(req.user, searchParams);

		res.status(200).json({
			message: 'Movies retrieved successfully',
			data: movies,
		});
	})
);

// Update movie
router.put(
	'/:id',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const movie = await movieController.updateMovie(
			Number(req.params.id),
			req.body,
			req.user
		);

		res.status(200).json({
			message: 'Movie updated successfully',
			data: movie,
		});
	})
);

// Delete movie
router.delete(
	'/:id',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		await movieController.deleteMovie(Number(req.params.id), req.user);

		res.status(200).json({
			message: 'Movie deleted successfully',
		});
	})
);

// Toggle favorite
router.post(
	'/:id/favorite',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const result = await movieController.toggleFavorite(
			Number(req.params.id),
			req.user
		);

		res.status(200).json({
			message: `Movie ${result.action} from favorites successfully`,
		});
	})
);

// Get favorites
router.get(
	'/favorites',
	AsyncHandler(async (req: Request, res: Response) => {
		if (!req.user) {
			throw new BadRequestError('Authentication required');
		}

		const searchParams = {
			search: req.query.search as string,
			sortBy: req.query.sortBy as string,
			sortOrder: req.query.sortOrder as 'asc' | 'desc',
			limit: req.query.limit ? Number(req.query.limit) : undefined,
			offset: req.query.offset ? Number(req.query.offset) : undefined,
		};

		const favorites = await movieController.getFavorites(
			req.user,
			searchParams
		);

		res.status(200).json({
			message: 'Favorites retrieved successfully',
			data: favorites,
		});
	})
);

export default router;
