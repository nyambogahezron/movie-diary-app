import express from 'express';
import { WatchlistController } from '../controllers/WatchlistController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Watchlist CRUD routes
router.post('/', WatchlistController.createWatchlist);
router.get('/', WatchlistController.getUserWatchlists);
router.get('/public', WatchlistController.getPublicWatchlists);
router.get('/:id', WatchlistController.getWatchlist);
router.put('/:id', WatchlistController.updateWatchlist);
router.delete('/:id', WatchlistController.deleteWatchlist);

// Watchlist-Movie association routes
router.post('/:id/movies', WatchlistController.addMovieToWatchlist);
router.delete(
	'/:id/movies/:movieId',
	WatchlistController.removeMovieFromWatchlist
);
router.get('/:id/movies', WatchlistController.getWatchlistMovies);

export default router;
