import { Request, Response } from 'express';
import { WatchlistService } from '../services/WatchlistService';
import { SearchInput } from '../types';
import AsyncHandler from '../middleware/asyncHandler';
import { BadRequestError } from '../utils/errors';

export class WatchlistController {
	static createWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const { name, description, isPublic } = req.body;

			if (!name) {
				throw new Error('Watchlist name is required');
			}

			const watchlist = await WatchlistService.createWatchlist(
				{
					name,
					description,
					isPublic,
				},
				req.user
			);

			res.status(201).json({
				message: 'Watchlist created successfully',
				data: watchlist,
			});
		}
	);

	static getUserWatchlists = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlists = await WatchlistService.getWatchlists(req.user);

			res.status(200).json({
				message: 'Watchlists retrieved successfully',
				data: watchlists,
			});
		}
	);

	static getPublicWatchlists = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
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

			const watchlists = await WatchlistService.getPublicWatchlists(
				searchParams
			);

			res.status(200).json({
				message: 'Public watchlists retrieved successfully',
				data: watchlists,
			});
		}
	);

	static getWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				throw new Error('Invalid watchlist ID');
			}

			const watchlist = await WatchlistService.getWatchlist(
				watchlistId,
				req.user
			);

			res.status(200).json({
				message: 'Watchlist retrieved successfully',
				data: watchlist,
			});
		}
	);

	static updateWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				throw new Error('Invalid watchlist ID');
			}

			const watchlist = await WatchlistService.updateWatchlist(
				watchlistId,
				req.body,
				req.user
			);

			res.status(200).json({
				message: 'Watchlist updated successfully',
				data: watchlist,
			});
		}
	);

	static deleteWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				throw new Error('Invalid watchlist ID');
			}

			await WatchlistService.deleteWatchlist(watchlistId, req.user);

			res.status(200).json({
				message: 'Watchlist deleted successfully',
			});
		}
	);

	static addMovieToWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);
			const movieId = Number(req.params.movieId);

			if (isNaN(watchlistId) || isNaN(movieId)) {
				throw new Error('Invalid watchlist ID or movie ID');
			}

			await WatchlistService.addMovieToWatchlist(
				watchlistId,
				movieId,
				req.user
			);

			res.status(200).json({
				message: 'Movie added to watchlist successfully',
			});
		}
	);

	static removeMovieFromWatchlist = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);
			const movieId = Number(req.params.movieId);

			if (isNaN(watchlistId) || isNaN(movieId)) {
				throw new Error('Invalid watchlist ID or movie ID');
			}

			await WatchlistService.removeMovieFromWatchlist(
				watchlistId,
				movieId,
				req.user
			);

			res.status(200).json({
				message: 'Movie removed from watchlist successfully',
			});
		}
	);

	static getWatchlistMovies = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				throw new Error('Invalid watchlist ID');
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

			const movies = await WatchlistService.getWatchlistMovies(
				watchlistId,
				req.user,
				searchParams
			);

			res.status(200).json({
				message: 'Watchlist movies retrieved successfully',
				data: movies,
			});
		}
	);
}
