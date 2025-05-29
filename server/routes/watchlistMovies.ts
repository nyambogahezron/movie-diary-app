import express from 'express';
import { WatchlistMovieController } from '../controllers/WatchlistMovieController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// WatchlistMovies CRUD routes
router.get('/:id', WatchlistMovieController.getWatchlistMovie);
router.delete('/:id', WatchlistMovieController.deleteWatchlistMovie);

// Watchlist-specific routes
router.post(
	'/watchlists/:watchlistId/movies',
	WatchlistMovieController.addMovieToWatchlist
);
router.get(
	'/watchlists/:watchlistId/movies',
	WatchlistMovieController.getWatchlistMovies
);
router.get(
	'/watchlists/:watchlistId/entries',
	WatchlistMovieController.getWatchlistMovieEntries
);
router.delete(
	'/watchlists/:watchlistId/movies/:movieId',
	WatchlistMovieController.removeMovieFromWatchlist
);

export default router;
