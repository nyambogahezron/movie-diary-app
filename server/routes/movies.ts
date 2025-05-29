import express from 'express';
import { MovieController } from '../controllers/MovieController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.post('/', MovieController.addMovie);
router.get('/', MovieController.getUserMovies);
router.get('/:id', MovieController.getMovie);
router.put('/:id', MovieController.updateMovie);
router.delete('/:id', MovieController.deleteMovie);

// Favorite routes
router.post('/:id/favorite', MovieController.toggleFavorite);
router.get('/favorites', MovieController.getFavorites);

export default router;
