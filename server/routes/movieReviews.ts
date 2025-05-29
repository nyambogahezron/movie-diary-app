import express from 'express';
import { MovieReviewController } from '../controllers/MovieReviewController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes for movie reviews
router.get('/', MovieReviewController.getUserReviews);
router.get('/:id', MovieReviewController.getReview);
router.put('/:id', MovieReviewController.updateReview);
router.delete('/:id', MovieReviewController.deleteReview);

// These routes will be mounted under /api/movies/:movieId/reviews
// so they don't need the movieId in the path
router.get('/movie/:movieId', MovieReviewController.getMovieReviews);
router.post('/movie/:movieId', MovieReviewController.addReview);

export default router;
