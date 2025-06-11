import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
	errorHandler,
	formatGraphQLError,
	asyncErrorBoundary,
} from './middleware/errorHandler';
import { generalRateLimiter, authRateLimiter } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';
import { authDirectiveTransformer } from './graphql/directives';
import typeDefs from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { GraphQLContext } from './graphql/context';
import { UserService } from './services/user';
import { MovieService } from './services/movie';
import { WatchlistService } from './services/watchlist';
import { MovieReviewService } from './services/movieReview';
import { FavoriteService } from './services/favorite';
import { config } from './config';
import { BaseContext } from '@apollo/server';

interface RequestContext extends BaseContext {
	req: Request;
	res: Response;
}

async function startServer() {
	const app = express();

	// Apply middleware
	app.use(json());
	app.use(cookieParser());
	app.use(
		cors({
			origin: config.frontendUrl,
			credentials: true,
		})
	);

	// Apply rate limiting
	app.use(generalRateLimiter);
	app.use('/graphql', authRateLimiter);

	// Apply authentication middleware
	app.use(authMiddleware);

	// Create Apollo Server
	const server = new ApolloServer<GraphQLContext>({
		typeDefs,
		resolvers,
		formatError: formatGraphQLError,
		plugins: [
			{
				async requestDidStart() {
					return {
						async willSendResponse(requestContext: {
							response: { http?: { headers: Headers } };
						}) {
							// Add security headers
							const { response } = requestContext;
							if (response.http) {
								response.http.headers.set('X-Content-Type-Options', 'nosniff');
								response.http.headers.set('X-Frame-Options', 'DENY');
								response.http.headers.set('X-XSS-Protection', '1; mode=block');
								response.http.headers.set(
									'Strict-Transport-Security',
									'max-age=31536000; includeSubDomains'
								);
								response.http.headers.set(
									'Content-Security-Policy',
									"default-src 'self'"
								);
							}
						},
					};
				},
			},
		],
	});

	// Start Apollo Server
	await server.start();

	// Apply Apollo middleware
	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req, res }: RequestContext) => {
				// Create service instances
				const userService = new UserService();
				const movieService = new MovieService();
				const watchlistService = new WatchlistService();
				const reviewService = new MovieReviewService();
				const favoriteService = new FavoriteService();

				return {
					req,
					res,
					user: req.user,
					services: {
						user: userService,
						movie: movieService,
						watchlist: watchlistService,
						review: reviewService,
						favorite: favoriteService,
					},
				};
			},
		})
	);

	// Apply error handling middleware last
	app.use(errorHandler);

	// Start server
	const port = config.port;
	app.listen(port, () => {
		console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
	});
}

// Wrap server startup in error boundary
startServer().catch((error) => {
	console.error('Failed to start server:', error);
	process.exit(1);
});
