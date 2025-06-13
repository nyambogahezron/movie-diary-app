import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie, createTestReview } from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { MovieReviewService } from '../../services/movieReview';
import { MovieService } from '../../services/movie';

// Load user service mock
import '../__mocks__/userService';

describe('MovieReviewController - GraphQL', () => {
  let server: ApolloServer;
  let authToken: string;
  let userId: number;
  let movieReviewService: MovieReviewService;
  let movieService: MovieService;
  let testMovie: any;
  let testReview: any;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user
    const { user, token } = await createTestUser();
    authToken = token;
    userId = user.id;
    
    // Create services
    movieReviewService = new MovieReviewService();
    movieService = new MovieService();
    
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
    // Clear reviews and movies before each test
    await db.delete(schema.movieReviews);
    await db.delete(schema.movies);
    
    // Create test movie
    testMovie = await createTestMovie({
      title: 'Test Movie',
      tmdbId: '12345',
      overview: 'Test overview',
      genres: ['Action', 'Drama']
    }, userId);

    // Create test review
    testReview = await createTestReview({
      userId,
      movieId: testMovie.id,
      rating: 8,
      review: 'Great movie!'
    });
  });

  describe('Mutation: createReview', () => {
    it('should create a new review', async () => {
      // Create another movie for this test
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);

      const reviewData = {
        input: {
          movieId: anotherMovie.id,
          rating: 9,
          review: 'Another awesome movie!'
        }
      };

      const mutation = `
        mutation CreateReview($input: MovieReviewInput!) {
          createReview(input: $input) {
            id
            userId
            movieId
            rating
            review
          }
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(anotherMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: reviewData
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.createReview).toHaveProperty('id');
      expect(response.body.data?.createReview.movieId).toBe(anotherMovie.id);
      expect(response.body.data?.createReview.rating).toBe(reviewData.input.rating);
      expect(response.body.data?.createReview.review).toBe(reviewData.input.review);
      expect(response.body.data?.createReview.userId).toBe(userId);

      // Check database
      const reviews = await db.select().from(schema.movieReviews);
      expect(reviews.length).toBe(2); // The test review + the new one
      expect(reviews.find(r => r.movieId === anotherMovie.id)).toBeDefined();
    });

    it('should not allow creating duplicate reviews for the same movie', async () => {
      const reviewData = {
        input: {
          movieId: testMovie.id, // Same movie that already has a review
          rating: 7,
          review: 'Another review for the same movie'
        }
      };

      const mutation = `
        mutation CreateReview($input: MovieReviewInput!) {
          createReview(input: $input) {
            id
          }
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: reviewData
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('already reviewed this movie');
    });
  });

  describe('Mutation: updateReview', () => {
    it('should update an existing review', async () => {
      const updateData = {
        id: testReview.id,
        input: {
          rating: 9,
          review: 'Updated review content'
        }
      };

      const mutation = `
        mutation UpdateReview($id: ID!, $input: MovieReviewUpdateInput!) {
          updateReview(id: $id, input: $input) {
            id
            userId
            movieId
            rating
            review
          }
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: updateData
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.updateReview).toHaveProperty('id');
      expect(response.body.data?.updateReview.id).toBe(testReview.id);
      expect(response.body.data?.updateReview.rating).toBe(updateData.input.rating);
      expect(response.body.data?.updateReview.review).toBe(updateData.input.review);

      // Check database
      const reviews = await db.select().from(schema.movieReviews);
      const updatedReview = reviews.find(r => r.id === testReview.id);
      expect(updatedReview?.rating).toBe(updateData.input.rating);
      expect(updatedReview?.review).toBe(updateData.input.review);
    });

    it('should not allow updating a review by another user', async () => {
      const updateData = {
        id: testReview.id,
        input: {
          rating: 9,
          review: 'Updated review content'
        }
      };

      const mutation = `
        mutation UpdateReview($id: ID!, $input: MovieReviewUpdateInput!) {
          updateReview(id: $id, input: $input) {
            id
          }
        }
      `;

      // Context with different user
      const context = {
        user: {
          id: userId + 1, // Different user ID
          email: 'other@example.com',
          username: 'otheruser'
        },
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId + 1, username: 'otheruser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: updateData
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authorized');
    });
  });

  describe('Mutation: deleteReview', () => {
    it('should delete a review', async () => {
      const mutation = `
        mutation DeleteReview($id: ID!) {
          deleteReview(id: $id)
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { id: testReview.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.deleteReview).toBe(true);

      // Check database
      const reviews = await db.select().from(schema.movieReviews);
      expect(reviews.length).toBe(0);
    });
  });

  describe('Query: review', () => {
    it('should get a review by id', async () => {
      const query = `
        query GetReview($id: ID!) {
          review(id: $id) {
            id
            userId
            movieId
            rating
            review
          }
        }
      `;

      // Add services to context
      const context = {
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query,
        variables: { id: testReview.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.review).toHaveProperty('id');
      expect(response.body.data?.review.id).toBe(testReview.id);
      expect(response.body.data?.review.userId).toBe(userId);
      expect(response.body.data?.review.movieId).toBe(testMovie.id);
      expect(response.body.data?.review.rating).toBe(testReview.rating);
      expect(response.body.data?.review.review).toBe(testReview.review);
    });
  });

  describe('Query: movieReviews', () => {
    it('should get reviews for a movie', async () => {
      // Create another review for the same movie by a different user
      await createTestUser({ id: userId + 1, username: 'otheruser' });
      await createTestReview({
        userId: userId + 1,
        movieId: testMovie.id,
        rating: 7,
        review: 'Different opinion'
      });

      const query = `
        query GetMovieReviews($movieId: ID!, $limit: Int, $offset: Int) {
          movieReviews(movieId: $movieId, limit: $limit, offset: $offset) {
            id
            userId
            movieId
            rating
            review
          }
        }
      `;

      // Add services to context
      const context = {
        movieReviewService,
        userService: {
          findById: jest.fn().mockImplementation((id) => Promise.resolve({ 
            id, 
            username: id === userId ? 'testuser' : 'otheruser' 
          }))
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query,
        variables: { 
          movieId: testMovie.id,
          limit: 10,
          offset: 0
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.movieReviews).toBeInstanceOf(Array);
      expect(response.body.data?.movieReviews.length).toBe(2);
      expect(response.body.data?.movieReviews[0].movieId).toBe(testMovie.id);
      expect(response.body.data?.movieReviews[1].movieId).toBe(testMovie.id);
      expect(response.body.data?.movieReviews).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: userId,
            rating: testReview.rating,
          }),
          expect.objectContaining({
            userId: userId + 1,
            rating: 7,
          })
        ])
      );
    });
  });

  describe('Query: userReviews', () => {
    it('should get reviews by a user', async () => {
      // Create another movie and review by the same user
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);
      
      await createTestReview({
        userId,
        movieId: anotherMovie.id,
        rating: 6,
        review: 'Not as good'
      });

      const query = `
        query GetUserReviews($userId: ID!, $limit: Int, $offset: Int) {
          userReviews(userId: $userId, limit: $limit, offset: $offset) {
            id
            userId
            movieId
            rating
            review
          }
        }
      `;

      // Add services to context
      const context = {
        movieReviewService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockImplementation((id) => Promise.resolve(
            id === testMovie.id ? testMovie : anotherMovie
          ))
        }
      };

      const response = await server.executeOperation({
        query,
        variables: { 
          userId,
          limit: 10,
          offset: 0
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.userReviews).toBeInstanceOf(Array);
      expect(response.body.data?.userReviews.length).toBe(2);
      expect(response.body.data?.userReviews[0].userId).toBe(userId);
      expect(response.body.data?.userReviews[1].userId).toBe(userId);
      expect(response.body.data?.userReviews).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            movieId: testMovie.id,
            rating: testReview.rating,
          }),
          expect.objectContaining({
            movieId: anotherMovie.id,
            rating: 6,
          })
        ])
      );
    });
  });

  describe('Query: reviewStats', () => {
    it('should get review statistics for a movie', async () => {
      // Create additional reviews for the same movie by different users
      await createTestUser({ id: userId + 1, username: 'user2' });
      await createTestUser({ id: userId + 2, username: 'user3' });
      await createTestUser({ id: userId + 3, username: 'user4' });
      
      await createTestReview({
        userId: userId + 1,
        movieId: testMovie.id,
        rating: 7,
        review: 'Good movie'
      });
      
      await createTestReview({
        userId: userId + 2,
        movieId: testMovie.id,
        rating: 9,
        review: 'Excellent movie'
      });
      
      await createTestReview({
        userId: userId + 3,
        movieId: testMovie.id,
        rating: 5,
        review: 'Average movie'
      });

      const query = `
        query GetReviewStats($movieId: ID!) {
          reviewStats(movieId: $movieId) {
            total
            average
            distribution {
              stars1
              stars2
              stars3
              stars4
              stars5
            }
          }
        }
      `;

      // Add services to context and authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieReviewService,
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query,
        variables: { movieId: testMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.reviewStats).toHaveProperty('total');
      expect(response.body.data?.reviewStats).toHaveProperty('average');
      expect(response.body.data?.reviewStats).toHaveProperty('distribution');
      expect(response.body.data?.reviewStats.total).toBe(4); // Total of 4 reviews
      
      // Average should be (8+7+9+5)/4 = 7.25
      expect(response.body.data?.reviewStats.average).toBeCloseTo(7.25);
    });
  });
});
