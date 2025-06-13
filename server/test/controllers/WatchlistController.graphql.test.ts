import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie, createTestWatchlist } from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { WatchlistService } from '../../services/watchlist';
import { MovieService } from '../../services/movie';

// Load user service mock
import '../__mocks__/userService';

describe('WatchlistController - GraphQL', () => {
  let server: ApolloServer;
  let authToken: string;
  let userId: number;
  let watchlistService: WatchlistService;
  let movieService: MovieService;
  let testMovie: any;
  let testWatchlist: any;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user
    const { user, token } = await createTestUser();
    authToken = token;
    userId = user.id;
    
    // Create services
    watchlistService = new WatchlistService();
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
    // Clear watchlists and movies before each test
    await db.delete(schema.watchlists);
    await db.delete(schema.watchlistMovies);
    await db.delete(schema.movies);
    
    // Create test movie
    testMovie = await createTestMovie({
      title: 'Test Movie',
      tmdbId: '12345',
      overview: 'Test overview',
      genres: ['Action', 'Drama']
    }, userId);

    // Create test watchlist
    testWatchlist = await createTestWatchlist({
      name: 'Test Watchlist',
      description: 'Test description',
      isPublic: true,
      userId
    });
  });

  describe('Mutation: createWatchlist', () => {
    it('should create a new watchlist', async () => {
      const watchlistData = {
        name: 'New Watchlist',
        description: 'New description',
        isPublic: true
      };

      const mutation = `
        mutation CreateWatchlist($input: WatchlistInput!) {
          createWatchlist(input: $input) {
            id
            name
            description
            isPublic
            userId
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
        watchlistService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { input: watchlistData }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.createWatchlist).toHaveProperty('id');
      expect(response.body.data?.createWatchlist.name).toBe(watchlistData.name);
      expect(response.body.data?.createWatchlist.description).toBe(watchlistData.description);
      expect(response.body.data?.createWatchlist.userId).toBe(userId);

      // Check database
      const watchlists = await db.select().from(schema.watchlists);
      expect(watchlists.length).toBe(2); // The test watchlist + the new one
      expect(watchlists.find(w => w.name === watchlistData.name)).toBeDefined();
    });

    it('should return error if not authenticated', async () => {
      const watchlistData = {
        name: 'New Watchlist',
        description: 'New description',
        isPublic: true
      };

      const mutation = `
        mutation CreateWatchlist($input: WatchlistInput!) {
          createWatchlist(input: $input) {
            id
            name
          }
        }
      `;

      // Context without user
      const context = {
        watchlistService
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { input: watchlistData }
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Mutation: updateWatchlist', () => {
    it('should update an existing watchlist', async () => {
      const updateData = {
        name: 'Updated Watchlist',
        description: 'Updated description',
        isPublic: false
      };

      const mutation = `
        mutation UpdateWatchlist($id: ID!, $input: WatchlistInput!) {
          updateWatchlist(id: $id, input: $input) {
            id
            name
            description
            isPublic
            userId
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
        watchlistService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        }
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { 
          id: testWatchlist.id,
          input: updateData 
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.updateWatchlist).toHaveProperty('id');
      expect(response.body.data?.updateWatchlist.id).toBe(testWatchlist.id);
      expect(response.body.data?.updateWatchlist.name).toBe(updateData.name);
      expect(response.body.data?.updateWatchlist.description).toBe(updateData.description);

      // Check database
      const watchlists = await db.select().from(schema.watchlists);
      const updatedWatchlist = watchlists.find(w => w.id === testWatchlist.id);
      expect(updatedWatchlist?.name).toBe(updateData.name);
      expect(updatedWatchlist?.description).toBe(updateData.description);
    });
  });

  describe('Mutation: addMovieToWatchlist', () => {
    it('should add a movie to a watchlist', async () => {
      const mutation = `
        mutation AddMovieToWatchlist($watchlistId: ID!, $movieId: ID!) {
          addMovieToWatchlist(watchlistId: $watchlistId, movieId: $movieId) {
            id
            watchlistId
            movieId
            status
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
        watchlistService,
        movieService
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { 
          watchlistId: testWatchlist.id,
          movieId: testMovie.id
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.addMovieToWatchlist).toHaveProperty('id');
      expect(response.body.data?.addMovieToWatchlist.watchlistId).toBe(testWatchlist.id);
      expect(response.body.data?.addMovieToWatchlist.movieId).toBe(testMovie.id);

      // Check database
      const watchlistMovies = await db.select().from(schema.watchlistMovies);
      expect(watchlistMovies.length).toBe(1);
      expect(watchlistMovies[0].watchlistId).toBe(testWatchlist.id);
      expect(watchlistMovies[0].movieId).toBe(testMovie.id);
    });
  });

  describe('Query: watchlist', () => {
    it('should get a watchlist by id', async () => {
      const query = `
        query GetWatchlist($id: ID!) {
          watchlist(id: $id) {
            id
            name
            description
            isPublic
            userId
          }
        }
      `;

      // Add user to context
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        watchlistService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
        }
      };

      const response = await server.executeOperation({
        query,
        variables: { id: testWatchlist.id }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.watchlist).toHaveProperty('id');
      expect(response.body.data?.watchlist.id).toBe(testWatchlist.id);
      expect(response.body.data?.watchlist.name).toBe(testWatchlist.name);
      expect(response.body.data?.watchlist.userId).toBe(userId);
    });
  });

  describe('Query: watchlists', () => {
    it('should get watchlists for a user', async () => {
      // Create another watchlist
      await createTestWatchlist({
        name: 'Second Watchlist',
        description: 'Another description',
        isPublic: true,
        userId
      });

      const query = `
        query GetWatchlists($userId: ID!, $limit: Int, $offset: Int) {
          watchlists(userId: $userId, limit: $limit, offset: $offset) {
            id
            name
            description
            isPublic
            userId
          }
        }
      `;

      // Add user to context
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        watchlistService,
        userService: {
          findById: jest.fn().mockResolvedValue({ id: userId, username: 'testuser' })
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
      expect(response.body.data?.watchlists).toBeInstanceOf(Array);
      expect(response.body.data?.watchlists.length).toBe(2); // We created 2 watchlists
      expect(response.body.data?.watchlists[0]).toHaveProperty('name');
      expect(response.body.data?.watchlists[1]).toHaveProperty('name');
    });
  });

  describe('Query: watchlistMovies', () => {
    it('should get movies in a watchlist', async () => {
      // Add a movie to the watchlist first
      await watchlistService.addMovie(testWatchlist.id, testMovie.id);

      const query = `
        query GetWatchlistMovies($watchlistId: ID!, $limit: Int, $offset: Int) {
          watchlistMovies(watchlistId: $watchlistId, limit: $limit, offset: $offset) {
            id
            title
            overview
          }
        }
      `;

      // Add user to context
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        watchlistService,
        movieService
      };

      const response = await server.executeOperation({
        query,
        variables: { 
          watchlistId: testWatchlist.id,
          limit: 10,
          offset: 0
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.watchlistMovies).toBeInstanceOf(Array);
      expect(response.body.data?.watchlistMovies.length).toBe(1);
      expect(response.body.data?.watchlistMovies[0].id).toBe(testMovie.id);
      expect(response.body.data?.watchlistMovies[0].title).toBe(testMovie.title);
    });
  });

  describe('Query: watchlistByStatus', () => {
    it('should get movies by status in a watchlist', async () => {
      // Add a movie to the watchlist with WATCHED status
      await db.insert(schema.watchlistMovies).values({
        watchlistId: testWatchlist.id,
        movieId: testMovie.id,
        status: 'WATCHED'
      });

      const query = `
        query GetWatchlistByStatus($status: WatchStatus!, $limit: Int, $offset: Int) {
          watchlistByStatus(status: $status, limit: $limit, offset: $offset) {
            id
            title
            overview
          }
        }
      `;

      // Add user to context
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        watchlistService,
        movieService
      };

      const response = await server.executeOperation({
        query,
        variables: { 
          status: 'WATCHED',
          limit: 10,
          offset: 0
        }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.watchlistByStatus).toBeInstanceOf(Array);
      expect(response.body.data?.watchlistByStatus.length).toBe(1);
      expect(response.body.data?.watchlistByStatus[0].id).toBe(testMovie.id);
      expect(response.body.data?.watchlistByStatus[0].title).toBe(testMovie.title);
    });
  });
});
