import express, { Request, Response, RequestHandler } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { errorHandler, formatGraphQLError } from './middleware/errorHandler';
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
import { PostService } from './services/PostService';
import { PostLikeService } from './services/PostLikeService';
import { PostCommentService } from './services/PostCommentService';

async function startServer() {
	const app = express();
	app.use(json());
	app.use(cookieParser());
	app.use(
		cors({
			origin: config.frontendUrl,
			credentials: true,
		})
	);

	app.use(generalRateLimiter);
	app.use('/graphql', authRateLimiter);
	app.use(authMiddleware);

	let schema = makeExecutableSchema({ typeDefs, resolvers });
	schema = authDirectiveTransformer(schema);

	const server = new ApolloServer<GraphQLContext>({
		schema,
		formatError: (error) => formatGraphQLError(error as any),
		plugins: [
			{
				async requestDidStart() {
					return {
						async willSendResponse({ response }) {
							if (response.http?.headers) {
								const headers = response.http.headers;
								headers.set('X-Content-Type-Options', 'nosniff');
								headers.set('X-Frame-Options', 'DENY');
								headers.set('X-XSS-Protection', '1; mode=block');
								headers.set(
									'Strict-Transport-Security',
									'max-age=31536000; includeSubDomains'
								);
								headers.set('Content-Security-Policy', "default-src 'self'");
							}
						},
					};
				},
			},
		],
	});

	await server.start();

	const middleware = expressMiddleware(server, {
		context: async ({ req, res }) => {
			const userService = new UserService();
			const movieService = new MovieService();
			const watchlistService = new WatchlistService();
			const reviewService = new MovieReviewService();
			const favoriteService = new FavoriteService();
			const postService = new PostService();
			const postLikeService = new PostLikeService();
			const postCommentService = new PostCommentService();

			const context: GraphQLContext = {
				req: req as unknown as Request,
				res: res as unknown as Response,
				user: req.user,
				services: {
					user: userService,
					movie: movieService,
					watchlist: watchlistService,
					review: reviewService,
					favorite: favoriteService,
					post: postService,
					postLike: postLikeService,
					postComment: postCommentService,
				},
				userService,
				movieService,
				watchlistService,
				movieReviewService: reviewService,
				favoriteService,
				postService,
				postLikeService,
				postCommentService,
			};
			return context;
		},
	}) as unknown as RequestHandler;

	app.use('/graphql', middleware);

	app.get('/api', (req, res) => {
		res.json({
			message: 'REST API is deprecated. Please use the GraphQL API at /graphql',
			graphqlEndpoint: '/graphql',
		});
	});

	app.use(errorHandler);

	const port = config.port;
	app.listen(port, () => {
		console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
	});
}

startServer().catch((error) => {
	console.error('Failed to start server:', error);
	process.exit(1);
});
