import express from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers/index';
import { authDirectiveTransformer } from '../graphql/directives';
import { UserService } from '../services/user';
import { MovieService } from '../services/movie';
import { WatchlistService } from '../services/watchlist';
import { MovieReviewService } from '../services/movieReview';
import { FavoriteService } from '../services/favorite';
import { PostService } from '../services/PostService';
import { PostLikeService } from '../services/PostLikeService';
import { PostCommentService } from '../services/PostCommentService';

// Mock the database connection
jest.mock('../db', () => {
	return {
		db: require('../db/test-db').db,
	};
});

// Create Express app with Apollo Server for testing GraphQL
export async function createTestGraphQLApp() {
	// Create Express app
	const app = express();

	// Apply middleware
	app.use(json());

	// Apply schema transformations (directives)
	let schema = makeExecutableSchema({ typeDefs, resolvers });
	schema = authDirectiveTransformer(schema);

	// Create Apollo Server
	const server = new ApolloServer<GraphQLContext>({
		schema,
	});

	// Start Apollo Server
	await server.start();

	// Apply Apollo middleware
	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req }) => {
				// Get token from Authorization header
				const token = req.headers.authorization?.replace('Bearer ', '') || '';

				// Set up a tokenUser if token exists (this would be extracted from the token)
				let tokenUser = null;

				// Create service instances
				const userService = new UserService();
				const movieService = new MovieService();
				const watchlistService = new WatchlistService();
				const movieReviewService = new MovieReviewService();
				const favoriteService = new FavoriteService();
				const postService = new PostService();
				const postLikeService = new PostLikeService();
				const postCommentService = new PostCommentService();

				// If token exists, get user from token
				if (token) {
					try {
						// This is a simplified version - in a real environment we would validate the token
						const user = await userService.getUserFromToken(token);
						if (user) {
							tokenUser = user;
						}
					} catch (error) {
						console.error('Error validating token:', error);
					}
				}

				return {
					req,
					res: {} as any, // Mock response object
					user: tokenUser,
					userService,
					movieService,
					watchlistService,
					movieReviewService,
					favoriteService,
					postService,
					postLikeService,
					postCommentService,
					services: {
						user: userService,
						movie: movieService,
						watchlist: watchlistService,
						review: movieReviewService,
						favorite: favoriteService,
						post: postService,
						postLike: postLikeService,
						postComment: postCommentService,
					},
				};
			},
		})
	);

	// Health check route
	app.get('/health', (_req, res) => {
		res
			.status(200)
			.json({ status: 'ok', message: 'GraphQL Server is running' });
	});

	return app;
}
