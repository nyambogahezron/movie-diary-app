import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import watchlistRoutes from './routes/watchlists';
import watchlistMoviesRoutes from './routes/watchlistMovies';
import favoriteRoutes from './routes/favorites';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check route
app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		console.error('Unhandled error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
