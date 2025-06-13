import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import {
	createTestUser,
	createTestMovie,
	createTestReview,
	createTestWatchlist,
	createTestFavorite,
} from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { MovieService } from '../../services/movie';
import { MovieReviewService } from '../../services/movieReview';
import { FavoriteService } from '../../services/favorite';
import { WatchlistService } from '../../services/watchlist';
import { UserService } from '../../services/user';

// Load user service mock
import '../__mocks__/userService';

describe('Advanced GraphQL Queries', () => {
	let server: ApolloServer;
	let authToken: string;
	let userId: number;
	let movieService: MovieService;
	let movieReviewService: MovieReviewService;
	let favoriteService: FavoriteService;
	let watchlistService: WatchlistService;
	let userService: UserService;
	let testMovie1: any;
	let testMovie2: any;
	let testMovie3: any;

	beforeAll(async () => {
		await setupTestDatabase();

		// Create test user
		const { user, token } = await createTestUser();
		authToken = token;
		userId = user.id;

		// Create services
		movieService = new MovieService();
		movieReviewService = new MovieReviewService();
		favoriteService = new FavoriteService();
		watchlistService = new WatchlistService();
		userService = new UserService();

		// Create Apollo Server for testing
		server = new ApolloServer({
			typeDefs,
			resolvers,
		});

		await server.start();
	});

	afterAll(async () => {
		await server.stop();
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear data before each test
		await db.delete(schema.movieReviews);
		await db.delete(schema.favorites);
		await db.delete(schema.watchlistMovies);
		await db.delete(schema.watchlists);
		await db.delete(schema.movies);

		// Create test movies with different genres
		testMovie1 = await createTestMovie(
			{
				title: 'Action Movie',
				tmdbId: '111',
				overview: 'Lots of action',
				genres: ['Action', 'Adventure'],
				year: 2020,
			},
			userId
		);

		testMovie2 = await createTestMovie(
			{
				title: 'Drama Movie',
				tmdbId: '222',
				overview: 'Very dramatic',
				genres: ['Drama', 'Mystery'],
				year: 2021,
			},
			userId
		);

		testMovie3 = await createTestMovie(
			{
				title: 'Comedy Movie',
				tmdbId: '333',
				overview: 'Very funny',
				genres: ['Comedy', 'Family'],
				year: 2022,
			},
			userId
		);

		// Create reviews for movies
		await createTestReview({
			userId,
			movieId: testMovie1.id,
			rating: 8,
			review: 'Great action scenes!',
		});

		await createTestReview({
			userId,
			movieId: testMovie2.id,
			rating: 7,
			review: 'Good drama, but slow at times',
		});

		// Add movies to favorites
		await createTestFavorite({ userId, movieId: testMovie1.id });

		// Create a watchlist
		const watchlist = await createTestWatchlist({
			userId,
			name: 'My Watchlist',
			description: 'Movies to watch',
			isPublic: true,
		});

		// Add movies to watchlist with different statuses
		await db.insert(schema.watchlistMovies).values({
			watchlistId: watchlist.id,
			movieId: testMovie1.id,
			status: 'WATCHED',
		});

		await db.insert(schema.watchlistMovies).values({
			watchlistId: watchlist.id,
			movieId: testMovie2.id,
			status: 'WATCHING',
		});

		await db.insert(schema.watchlistMovies).values({
			watchlistId: watchlist.id,
			movieId: testMovie3.id,
			status: 'PLAN_TO_WATCH',
		});
	});

	describe('Query: searchMovies', () => {
		it('should search movies with filters', async () => {
			const query = `
        query SearchMovies($input: MovieSearchInput!) {
          searchMovies(input: $input) {
            movies {
              id
              title
              genres
              year
            }
            total
            page
            totalPages
            hasMore
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
				},
			};

			// Search for action movies
			const response = await server.executeOperation(
				{
					query,
					variables: {
						input: {
							query: 'Action',
							limit: 10,
							offset: 0,
						},
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.searchMovies).toHaveProperty('movies');
			expect(response.body.data?.searchMovies.movies).toBeInstanceOf(Array);
			expect(response.body.data?.searchMovies.movies.length).toBe(1);
			expect(response.body.data?.searchMovies.movies[0].title).toBe(
				'Action Movie'
			);
		});
	});

	describe('Query: recommendedMovies', () => {
		it('should get recommended movies', async () => {
			const query = `
        query GetRecommendedMovies($limit: Int) {
          recommendedMovies(limit: $limit) {
            id
            title
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: { limit: 2 },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.recommendedMovies).toBeInstanceOf(Array);
			// Recommendations may vary, but we should get up to 2 movies
			expect(response.body.data?.recommendedMovies.length).toBeLessThanOrEqual(
				2
			);
		});
	});

	describe('Query: similarMovies', () => {
		it('should get similar movies', async () => {
			const query = `
        query GetSimilarMovies($movieId: ID!, $limit: Int) {
          similarMovies(movieId: $movieId, limit: $limit) {
            id
            title
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: {
						movieId: testMovie1.id,
						limit: 2,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.similarMovies).toBeInstanceOf(Array);
		});
	});

	describe('Query: popularMoviesByGenre', () => {
		it('should get popular movies by genre', async () => {
			const query = `
        query GetPopularMoviesByGenre($genre: String!, $limit: Int) {
          popularMoviesByGenre(genre: $genre, limit: $limit) {
            id
            title
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
				},
			};

			// Get Drama movies
			const response = await server.executeOperation(
				{
					query,
					variables: {
						genre: 'Drama',
						limit: 10,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.popularMoviesByGenre).toBeInstanceOf(Array);
			expect(response.body.data?.popularMoviesByGenre.length).toBe(1);
			expect(response.body.data?.popularMoviesByGenre[0].title).toBe(
				'Drama Movie'
			);
		});
	});

	describe('Query: watchlistByStatus', () => {
		it('should get movies by watch status', async () => {
			const query = `
        query GetMoviesByStatus($status: WatchStatus!, $limit: Int, $offset: Int) {
          watchlistByStatus(status: $status, limit: $limit, offset: $offset) {
            id
            title
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					watchlist: watchlistService,
					movie: movieService,
				},
			};

			// Get WATCHED movies
			const response = await server.executeOperation(
				{
					query,
					variables: {
						status: 'WATCHED',
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.watchlistByStatus).toBeInstanceOf(Array);
			expect(response.body.data?.watchlistByStatus.length).toBe(1);
			expect(response.body.data?.watchlistByStatus[0].id).toBe(testMovie1.id);
			expect(response.body.data?.watchlistByStatus[0].title).toBe(
				'Action Movie'
			);

			// Get WATCHING movies
			const response2 = await server.executeOperation(
				{
					query,
					variables: {
						status: 'WATCHING',
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response2.body.errors).toBeUndefined();
			expect(response2.body.data?.watchlistByStatus).toBeInstanceOf(Array);
			expect(response2.body.data?.watchlistByStatus.length).toBe(1);
			expect(response2.body.data?.watchlistByStatus[0].id).toBe(testMovie2.id);
			expect(response2.body.data?.watchlistByStatus[0].title).toBe(
				'Drama Movie'
			);
		});
	});

	describe('Query: watchlistByGenre', () => {
		it('should get watchlist movies by genre', async () => {
			const query = `
        query GetWatchlistByGenre($genre: String!, $limit: Int, $offset: Int) {
          watchlistByGenre(genre: $genre, limit: $limit, offset: $offset) {
            id
            title
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					watchlist: watchlistService,
				},
			};

			// Get movies in Comedy genre
			const response = await server.executeOperation(
				{
					query,
					variables: {
						genre: 'Comedy',
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.watchlistByGenre).toBeInstanceOf(Array);
			expect(response.body.data?.watchlistByGenre.length).toBe(1);
			expect(response.body.data?.watchlistByGenre[0].title).toBe(
				'Comedy Movie'
			);
		});
	});

	describe('Query: watchlistByYear', () => {
		it('should get watchlist movies by release year', async () => {
			const query = `
        query GetWatchlistByYear($year: Int!, $limit: Int, $offset: Int) {
          watchlistByYear(year: $year, limit: $limit, offset: $offset) {
            id
            title
            year
            genres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					watchlist: watchlistService,
				},
			};

			// Get movies from 2021
			const response = await server.executeOperation(
				{
					query,
					variables: {
						year: 2021,
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.watchlistByYear).toBeInstanceOf(Array);
			expect(response.body.data?.watchlistByYear.length).toBe(1);
			expect(response.body.data?.watchlistByYear[0].title).toBe('Drama Movie');
			expect(response.body.data?.watchlistByYear[0].year).toBe(2021);
		});
	});

	describe('Query: userStats', () => {
		it('should get user statistics', async () => {
			const query = `
        query GetUserStats($userId: ID!) {
          userStats(userId: $userId) {
            totalReviews
            averageRating
            totalWatchlist
            totalFavorites
            mostWatchedGenres
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					user: userService,
					movie: movieService,
					review: movieReviewService,
					watchlist: watchlistService,
					favorite: favoriteService,
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: { userId: userId.toString() },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.userStats).toHaveProperty('totalReviews');
			expect(response.body.data?.userStats).toHaveProperty('averageRating');
			expect(response.body.data?.userStats).toHaveProperty('totalWatchlist');
			expect(response.body.data?.userStats).toHaveProperty('totalFavorites');
			expect(response.body.data?.userStats).toHaveProperty('mostWatchedGenres');

			// Check the values based on our test data
			expect(response.body.data?.userStats.totalReviews).toBe(2);
			expect(response.body.data?.userStats.totalFavorites).toBe(1);
			expect(response.body.data?.userStats.totalWatchlist).toBe(3);

			// Average rating should be (8+7)/2 = 7.5
			expect(response.body.data?.userStats.averageRating).toBeCloseTo(7.5);
		});
	});

	describe('Query: topReviewedMovies', () => {
		it('should get top reviewed movies', async () => {
			// Create additional reviews for testMovie1 by other users to make it the most reviewed
			await createTestUser({ id: userId + 1, username: 'user2' });
			await createTestUser({ id: userId + 2, username: 'user3' });

			await createTestReview({
				userId: userId + 1,
				movieId: testMovie1.id,
				rating: 9,
				review: 'Amazing action!',
			});

			await createTestReview({
				userId: userId + 2,
				movieId: testMovie1.id,
				rating: 8,
				review: 'Very entertaining',
			});

			const query = `
        query GetTopReviewedMovies($limit: Int) {
          topReviewedMovies(limit: $limit) {
            id
            title
            reviewCount
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
					review: movieReviewService,
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: { limit: 2 },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.topReviewedMovies).toBeInstanceOf(Array);
			expect(
				response.body.data?.topReviewedMovies.length
			).toBeGreaterThanOrEqual(1);

			// testMovie1 should be first with 3 reviews
			expect(response.body.data?.topReviewedMovies[0].id).toBe(testMovie1.id);
			expect(response.body.data?.topReviewedMovies[0].title).toBe(
				'Action Movie'
			);
			expect(response.body.data?.topReviewedMovies[0].reviewCount).toBe(3);
		});
	});

	describe('Mutation: batchMovieOperation', () => {
		it('should perform batch operations on movies', async () => {
			// Create a new movie to add to favorites in batch
			const newMovie = await createTestMovie(
				{
					title: 'Batch Test Movie',
					tmdbId: '444',
					overview: 'For batch testing',
					genres: ['Action', 'Adventure'],
					year: 2023,
				},
				userId
			);

			const mutation = `
        mutation BatchMovieOperation($input: BatchMovieOperationInput!) {
          batchMovieOperation(input: $input) {
            success
            affectedIds
            errors {
              id
              message
            }
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					movie: movieService,
					favorite: favoriteService,
					watchlist: watchlistService,
					review: movieReviewService,
				},
			};

			// Add multiple movies to favorites in batch
			const response = await server.executeOperation(
				{
					query: mutation,
					variables: {
						input: {
							ids: [
								testMovie2.id.toString(),
								testMovie3.id.toString(),
								newMovie.id.toString(),
							],
							action: 'ADD_TO_FAVORITES',
						},
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.batchMovieOperation).toHaveProperty('success');
			expect(response.body.data?.batchMovieOperation.success).toBe(true);
			expect(response.body.data?.batchMovieOperation.affectedIds).toHaveLength(
				3
			);

			// Check database
			const favorites = await db.select().from(schema.favorites);
			expect(favorites.length).toBe(4); // The initial favorite + 3 new ones
		});
	});

	describe('Mutation: bulkUpdateWatchlistStatus', () => {
		it('should update movie status in bulk', async () => {
			const mutation = `
        mutation BulkUpdateWatchlistStatus($movieIds: [ID!]!, $status: WatchStatus!) {
          bulkUpdateWatchlistStatus(movieIds: $movieIds, status: $status)
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					watchlist: watchlistService,
				},
			};

			// Update both movies to WATCHED status
			const response = await server.executeOperation(
				{
					query: mutation,
					variables: {
						movieIds: [testMovie2.id.toString(), testMovie3.id.toString()],
						status: 'WATCHED',
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.bulkUpdateWatchlistStatus).toBe(true);

			// Check database to verify all movies now have WATCHED status
			const watchlistMovies = await db
				.select()
				.from(schema.watchlistMovies)
				.where(
					schema.watchlistMovies.movieId.in([testMovie2.id, testMovie3.id])
				);

			expect(watchlistMovies.length).toBe(2);
			expect(watchlistMovies.every((wm) => wm.status === 'WATCHED')).toBe(true);
		});
	});

	describe('Query: reviewStats', () => {
		it('should get review statistics for a movie', async () => {
			// Add more reviews for testMovie1 with different ratings to test distribution
			await createTestUser({ id: userId + 1, username: 'user2' });
			await createTestUser({ id: userId + 2, username: 'user3' });
			await createTestUser({ id: userId + 3, username: 'user4' });

			await createTestReview({
				userId: userId + 1,
				movieId: testMovie1.id,
				rating: 5,
				review: 'Average',
			});

			await createTestReview({
				userId: userId + 2,
				movieId: testMovie1.id,
				rating: 9,
				review: 'Excellent',
			});

			await createTestReview({
				userId: userId + 3,
				movieId: testMovie1.id,
				rating: 3,
				review: 'Not good',
			});

			const query = `
        query GetReviewStats($movieId: ID!) {
          reviewStats(movieId: $movieId) {
            averageRating
            totalReviews
            ratingDistribution {
              rating
              count
            }
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				services: {
					review: movieReviewService,
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: { movieId: testMovie1.id },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.reviewStats).toHaveProperty('averageRating');
			expect(response.body.data?.reviewStats).toHaveProperty('totalReviews');
			expect(response.body.data?.reviewStats).toHaveProperty(
				'ratingDistribution'
			);

			// We now have 4 reviews for testMovie1 with ratings 8, 5, 9, 3
			expect(response.body.data?.reviewStats.totalReviews).toBe(4);
			// Average is (8+5+9+3)/4 = 6.25
			expect(response.body.data?.reviewStats.averageRating).toBeCloseTo(6.25);
		});
	});
});
