import { Request, Response } from 'express';
import { WatchlistService } from '../services/WatchlistService';
import { SearchInput, WatchlistInput } from '../types';

export class WatchlistController {
	// Create a new watchlist
	static async createWatchlist(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const { name, description, isPublic } = req.body;

			// Validate required fields
			if (!name) {
				res.status(400).json({ error: 'Watchlist name is required' });
				return;
			}

			// Create watchlist
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
		} catch (error) {
			if ((error as Error).name === 'ConflictError') {
				res.status(409).json({ error: (error as Error).message });
				return;
			}

			console.error('Error creating watchlist:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while creating the watchlist' });
		}
	}

	// Get all watchlists for the current user
	static async getUserWatchlists(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlists = await WatchlistService.getWatchlists(req.user);

			res.status(200).json({
				message: 'Watchlists retrieved successfully',
				data: watchlists,
			});
		} catch (error) {
			console.error('Error getting user watchlists:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving watchlists' });
		}
	}

	// Get public watchlists
	static async getPublicWatchlists(req: Request, res: Response): Promise<void> {
		try {
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

			const watchlists = await WatchlistService.getPublicWatchlists(
				searchParams
			);

			res.status(200).json({
				message: 'Public watchlists retrieved successfully',
				data: watchlists,
			});
		} catch (error) {
			console.error('Error getting public watchlists:', error);
			res
				.status(500)
				.json({
					error: 'An error occurred while retrieving public watchlists',
				});
		}
	}

	// Get a single watchlist by ID
	static async getWatchlist(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
				return;
			}

			try {
				const watchlist = await WatchlistService.getWatchlist(
					watchlistId,
					req.user
				);

				res.status(200).json({
					message: 'Watchlist retrieved successfully',
					data: watchlist,
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
			console.error('Error getting watchlist:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving the watchlist' });
		}
	}

	// Update a watchlist
	static async updateWatchlist(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
				return;
			}

			try {
				const watchlist = await WatchlistService.updateWatchlist(
					watchlistId,
					req.body,
					req.user
				);

				res.status(200).json({
					message: 'Watchlist updated successfully',
					data: watchlist,
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
			console.error('Error updating watchlist:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while updating the watchlist' });
		}
	}

	// Delete a watchlist
	static async deleteWatchlist(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
				return;
			}

			try {
				await WatchlistService.deleteWatchlist(watchlistId, req.user);

				res.status(200).json({
					message: 'Watchlist deleted successfully',
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
			console.error('Error deleting watchlist:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while deleting the watchlist' });
		}
	}

	// Add a movie to a watchlist
	static async addMovieToWatchlist(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);
			const { movieId } = req.body;

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
				return;
			}

			if (!movieId || isNaN(Number(movieId))) {
				res.status(400).json({ error: 'Valid movie ID is required' });
				return;
			}

			try {
				await WatchlistService.addMovieToWatchlist(
					watchlistId,
					Number(movieId),
					req.user
				);

				res.status(200).json({
					message: 'Movie added to watchlist successfully',
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
			console.error('Error adding movie to watchlist:', error);
			res
				.status(500)
				.json({
					error: 'An error occurred while adding the movie to the watchlist',
				});
		}
	}

	// Remove a movie from a watchlist
	static async removeMovieFromWatchlist(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);
			const movieId = Number(req.params.movieId);

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
				return;
			}

			if (isNaN(movieId)) {
				res.status(400).json({ error: 'Invalid movie ID' });
				return;
			}

			try {
				await WatchlistService.removeMovieFromWatchlist(
					watchlistId,
					movieId,
					req.user
				);

				res.status(200).json({
					message: 'Movie removed from watchlist successfully',
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
			console.error('Error removing movie from watchlist:', error);
			res
				.status(500)
				.json({
					error:
						'An error occurred while removing the movie from the watchlist',
				});
		}
	}

	// Get all movies in a watchlist
	static async getWatchlistMovies(req: Request, res: Response): Promise<void> {
		try {
			// Check authentication
			if (!req.user) {
				res.status(401).json({ error: 'Authentication required' });
				return;
			}

			const watchlistId = Number(req.params.id);

			if (isNaN(watchlistId)) {
				res.status(400).json({ error: 'Invalid watchlist ID' });
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

			try {
				const movies = await WatchlistService.getWatchlistMovies(
					watchlistId,
					req.user,
					searchParams
				);

				res.status(200).json({
					message: 'Watchlist movies retrieved successfully',
					data: movies,
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
			console.error('Error getting watchlist movies:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while retrieving watchlist movies' });
		}
	}
}
