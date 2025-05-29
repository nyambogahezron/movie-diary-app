import { Request, Response } from 'express';
import { MovieReviewService } from '../services/MovieReviewService';
import { MovieReviewInput } from '../types';

export class MovieReviewController {
  // Create a new movie review
  static async addReview(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const movieId = Number(req.params.movieId);
      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const { content, rating, isPublic } = req.body;

      // Validate required fields
      if (!content) {
        res.status(400).json({ error: 'Review content is required' });
        return;
      }

      // Validate rating if provided
      if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 10)) {
        res.status(400).json({ error: 'Rating must be a number between 1 and 10' });
        return;
      }

      try {
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
      } catch (error) {
        if ((error as Error).name === 'NotFoundError') {
          res.status(404).json({ error: (error as Error).message });
          return;
        }

        if ((error as Error).name === 'DuplicateError') {
          res.status(409).json({ error: (error as Error).message });
          return;
        }

        throw error;
      }
    } catch (error) {
      console.error('Error adding review:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while adding the review' });
    }
  }

  // Get all reviews for a movie
  static async getMovieReviews(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const movieId = Number(req.params.movieId);
      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      try {
        const reviews = await MovieReviewService.getMovieReviews(movieId, req.user);

        res.status(200).json({
          message: 'Reviews retrieved successfully',
          data: reviews,
        });
      } catch (error) {
        if ((error as Error).name === 'NotFoundError') {
          res.status(404).json({ error: (error as Error).message });
          return;
        }

        throw error;
      }
    } catch (error) {
      console.error('Error getting reviews:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while retrieving the reviews' });
    }
  }

  // Get a single review by ID
  static async getReview(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const reviewId = Number(req.params.id);
      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      try {
        const review = await MovieReviewService.getReview(reviewId, req.user);

        res.status(200).json({
          message: 'Review retrieved successfully',
          data: review,
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
      console.error('Error getting review:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while retrieving the review' });
    }
  }

  // Update a review
  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const reviewId = Number(req.params.id);
      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      const { content, rating, isPublic } = req.body;

      // Validate input
      if (!content && rating === undefined && isPublic === undefined) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Validate rating if provided
      if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 10)) {
        res.status(400).json({ error: 'Rating must be a number between 1 and 10' });
        return;
      }

      const updateData: Partial<MovieReviewInput> = {};
      if (content !== undefined) updateData.content = content;
      if (rating !== undefined) updateData.rating = Number(rating);
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      try {
        const review = await MovieReviewService.updateReview(
          reviewId,
          updateData,
          req.user
        );

        res.status(200).json({
          message: 'Review updated successfully',
          data: review,
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
      console.error('Error updating review:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while updating the review' });
    }
  }

  // Delete a review
  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const reviewId = Number(req.params.id);
      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      try {
        await MovieReviewService.deleteReview(reviewId, req.user);

        res.status(200).json({
          message: 'Review deleted successfully',
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
      console.error('Error deleting review:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while deleting the review' });
    }
  }

  // Get all reviews by current user
  static async getUserReviews(req: Request, res: Response): Promise<void> {
    try {
      // Check authentication
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const reviews = await MovieReviewService.getUserReviews(req.user);

      res.status(200).json({
        message: 'User reviews retrieved successfully',
        data: reviews,
      });
    } catch (error) {
      console.error('Error getting user reviews:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while retrieving user reviews' });
    }
  }
}
