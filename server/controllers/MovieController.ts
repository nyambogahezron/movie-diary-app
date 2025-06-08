import { Request, Response } from 'express';
import { MovieService } from '../services/MovieService';
import { FavoriteService } from '../services/FavoriteService';
import { SearchInput } from '../types';
import AsyncHandler from '../middleware/asyncHandler';
import { BadRequestError } from '../errors';

export class MovieController {
	static addMovie = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
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
				throw new Error('Title and tmdbId are required');
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
		}
	);

	static getMovie = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			const movie = await MovieService.getMovie(movieId, req.user);

			res.status(200).json({
				message: 'Movie retrieved successfully',
				data: movie,
			});
		}
	);

	static getUserMovies = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
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
		}
	);

	static updateMovie = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			const movie = await MovieService.updateMovie(movieId, req.body, req.user);

			res.status(200).json({
				message: 'Movie updated successfully',
				data: movie,
			});
		}
	);

	static deleteMovie = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			await MovieService.deleteMovie(movieId, req.user);

			res.status(200).json({
				message: 'Movie deleted successfully',
			});
		}
	);

	static toggleFavorite = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
			}

			const movieId = Number(req.params.id);

			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			const isFavorite = await FavoriteService.isFavorite(movieId, req.user);

			if (isFavorite) {
				await FavoriteService.removeFavorite(movieId, req.user);
				res.status(200).json({
					message: 'Movie removed from favorites successfully',
				});
			} else {
				await FavoriteService.addFavorite(movieId, req.user);
				res.status(200).json({
					message: 'Movie added to favorites successfully',
				});
			}
		}
	);

	static getFavorites = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new BadRequestError('Authentication required');
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
}
