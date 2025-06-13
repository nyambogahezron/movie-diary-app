import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie, createTestFavorite } from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { FavoriteService } from '../../services/favorite';
import { MovieService } from '../../services/movie';

// Load user service mock
import '../__mocks__/userService';

describe('FavoriteController - GraphQL', () => {
  let server: ApolloServer;
  let authToken: string;
  let userId: number;
  let favoriteService: FavoriteService;
  let movieService: MovieService;
  let testMovie: any;
  let testFavorite: any;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user
    const { user, token } = await createTestUser();
    authToken = token;
    userId = user.id;
    
    // Create services
    favoriteService = new FavoriteService();
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
    // Clear favorites and movies before each test
    await db.delete(schema.favorites);
    await db.delete(schema.movies);
    
    // Create test movie
    testMovie = await createTestMovie({
      title: 'Test Movie',
      tmdbId: '12345',
      overview: 'Test overview',
      genres: ['Action', 'Drama']
    }, userId);

    // Create test favorite
    testFavorite = await createTestFavorite({ userId, movieId: testMovie.id });
  });

  describe('Mutation: addFavorite', () => {
    it('should add a movie to favorites', async () => {
      // Create another movie for testing adding to favorites
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);

      const mutation = `
        mutation AddFavorite($movieId: ID!) {
          addFavorite(movieId: $movieId) {
            id
            userId
            movieId
            createdAt
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
        favoriteService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        },
        movieService: {
          findById: jest.fn().mockResolvedValue(anotherMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { movieId: anotherMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.addFavorite).toHaveProperty('id');
      expect(response.body.data?.addFavorite.userId).toBe(userId);
      expect(response.body.data?.addFavorite.movieId).toBe(anotherMovie.id);

      // Check database
      const favorites = await db.select().from(schema.favorites);
      expect(favorites.length).toBe(2); // The test favorite + the new one
      expect(favorites.find(f => f.movieId === anotherMovie.id)).toBeDefined();
    });

    it('should not allow adding a movie that is already a favorite', async () => {
      const mutation = `
        mutation AddFavorite($movieId: ID!) {
          addFavorite(movieId: $movieId) {
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
        favoriteService,
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { movieId: testMovie.id } // Already a favorite
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('already in favorites');
    });
  });

  describe('Mutation: removeFavorite', () => {
    it('should remove a movie from favorites', async () => {
      const mutation = `
        mutation RemoveFavorite($movieId: ID!) {
          removeFavorite(movieId: $movieId)
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        favoriteService,
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { movieId: testMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.removeFavorite).toBe(true);

      // Check database
      const favorites = await db.select().from(schema.favorites);
      expect(favorites.length).toBe(0);
    });

    it('should fail when trying to remove a movie that is not a favorite', async () => {
      // Create another movie that is not a favorite
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);

      const mutation = `
        mutation RemoveFavorite($movieId: ID!) {
          removeFavorite(movieId: $movieId)
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        favoriteService,
        movieService: {
          findById: jest.fn().mockResolvedValue(anotherMovie)
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { movieId: anotherMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('not in favorites');
    });
  });

  describe('Query: favorites', () => {
    it('should get favorite movies for a user', async () => {
      // Create another movie and add it to favorites
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);
      
      await createTestFavorite({ userId, movieId: anotherMovie.id });

      const query = `
        query GetFavorites($userId: ID!, $limit: Int, $offset: Int) {
          favorites(userId: $userId, limit: $limit, offset: $offset) {
            id
            userId
            movieId
            movie {
              id
              title
            }
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
        favoriteService,
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
      expect(response.body.data?.favorites).toBeInstanceOf(Array);
      expect(response.body.data?.favorites.length).toBe(2);
      expect(response.body.data?.favorites[0]).toHaveProperty('movie');
      expect(response.body.data?.favorites[1]).toHaveProperty('movie');
      
      // Check that both movies are in the response
      const movieIds = response.body.data?.favorites.map(f => f.movieId);
      expect(movieIds).toContain(testMovie.id);
      expect(movieIds).toContain(anotherMovie.id);
    });

    it('should not allow accessing favorites of other users without authentication', async () => {
      const otherUserId = userId + 1;

      const query = `
        query GetFavorites($userId: ID!, $limit: Int, $offset: Int) {
          favorites(userId: $userId, limit: $limit, offset: $offset) {
            id
          }
        }
      `;

      // Context without authenticated user
      const context = {
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { 
          userId: otherUserId,
          limit: 10,
          offset: 0
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Query: isFavorite', () => {
    it('should check if a movie is in user favorites', async () => {
      const query = `
        query IsFavorite($movieId: ID!) {
          isFavorite(movieId: $movieId)
        }
      `;

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { movieId: testMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.isFavorite).toBe(true);

      // Create another movie and check it's not a favorite
      const anotherMovie = await createTestMovie({
        title: 'Another Movie',
        tmdbId: '67890',
        overview: 'Another overview',
        genres: ['Comedy']
      }, userId);

      const response2 = await server.executeOperation({
        query,
        variables: { movieId: anotherMovie.id }
      }, { contextValue: context });

      expect(response2.body.errors).toBeUndefined();
      expect(response2.body.data?.isFavorite).toBe(false);
    });

    it('should fail if user is not authenticated', async () => {
      const query = `
        query IsFavorite($movieId: ID!) {
          isFavorite(movieId: $movieId)
        }
      `;

      // Context without authenticated user
      const context = {
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { movieId: testMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Movie resolver: isFavorite', () => {
    it('should resolve isFavorite field for a movie', async () => {
      const query = `
        query GetMovie($id: ID!) {
          movie(id: $id) {
            id
            title
            isFavorite
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
        movieService: {
          findById: jest.fn().mockResolvedValue(testMovie)
        },
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { id: testMovie.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.movie).toHaveProperty('isFavorite');
      expect(response.body.data?.movie.isFavorite).toBe(true);
    });
  });
});
