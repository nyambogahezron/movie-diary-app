import { Request, Response } from 'express';
import { MovieReviewService } from '../services/MovieReviewService';
import { MovieReviewInput } from '../types';
import AsyncHandler from '../middleware/asyncHandler';
import { AuthorizationError } from '../utils/errors';

export class MovieReviewController {
	static addReview = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const movieId = Number(req.params.movieId);
			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			const { content, rating, isPublic } = req.body;

			if (!content) {
				throw new Error('Review content is required');
			}

			if (
				rating !== undefined &&
				(isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 10)
			) {
				throw new Error('Rating must be a number between 1 and 10');
			}

			const review = await MovieReviewService.addReview(
				movieId,
				{
					content,
					rating: rating ? Number(rating) : null,
					isPublic,
				},
				req.user
			);

			res.status(201).json({
				message: 'Review added successfully',
				data: review,
			});
		}
	);

	static getMovieReviews = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const movieId = Number(req.params.movieId);
			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			const reviews = await MovieReviewService.getMovieReviews(
				movieId,
				req.user
			);

			res.status(200).json({
				message: 'Reviews retrieved successfully',
				data: reviews,
			});
		}
	);

	static getReview = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const reviewId = Number(req.params.id);
			if (isNaN(reviewId)) {
				throw new Error('Invalid review ID');
			}

			const review = await MovieReviewService.getReview(reviewId, req.user);

			res.status(200).json({
				message: 'Review retrieved successfully',
				data: review,
			});
		}
	);

	static updateReview = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const reviewId = Number(req.params.id);
			if (isNaN(reviewId)) {
				throw new Error('Invalid review ID');
			}

			const { content, rating, isPublic } = req.body;

			if (!content && rating === undefined && isPublic === undefined) {
				throw new Error('No update data provided');
			}

			if (
				rating !== undefined &&
				(isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 10)
			) {
				throw new Error('Rating must be a number between 1 and 10');
			}

			const updateData: Partial<MovieReviewInput> = {};
			if (content !== undefined) updateData.content = content;
			if (rating !== undefined) updateData.rating = Number(rating);
			if (isPublic !== undefined) updateData.isPublic = isPublic;

			const review = await MovieReviewService.updateReview(
				reviewId,
				updateData,
				req.user
			);

			res.status(200).json({
				message: 'Review updated successfully',
				data: review,
			});
		}
	);

	static deleteReview = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const reviewId = Number(req.params.id);
			if (isNaN(reviewId)) {
				throw new Error('Invalid review ID');
			}

			await MovieReviewService.deleteReview(reviewId, req.user);

			res.status(200).json({
				message: 'Review deleted successfully',
			});
		}
	);

	static getUserReviews = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				throw new AuthorizationError('Authentication required');
			}

			const reviews = await MovieReviewService.getUserReviews(req.user);

			res.status(200).json({
				message: 'User reviews retrieved successfully',
				data: reviews,
			});
		}
	);
}
