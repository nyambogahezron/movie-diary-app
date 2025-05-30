import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { config } from './config';

import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import watchlistRoutes from './routes/watchlists';
import favoriteRoutes from './routes/favorites';
import movieReviewRoutes from './routes/movieReviews';
import postRoutes from './routes/posts';

import { generateCsrfToken } from './middleware/csrf';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = config.server.port;

const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.maxRequestsPerWindow,
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests from this IP, please try again later',
});

app.use(limiter);

app.use(
	helmet({
		contentSecurityPolicy: config.server.isProduction ? undefined : false,
	})
);

// Apply security headers
app.use((req, res, next) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader(
		'Strict-Transport-Security',
		'max-age=31536000; includeSubDomains'
	);
	next();
});

app.use(
	cors({
		origin: config.security.cors.origin,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: config.security.cors.credentials,
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'X-CSRF-Token',
			'X-API-Client',
		],
	})
);

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser(config.security.cookieSecret));

// CSRF token endpoint
app.get('/api/csrf-token', generateCsrfToken);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', movieReviewRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(
		`Server is running on port ${PORT} in ${config.server.nodeEnv} mode`
	);
});

export default app;
