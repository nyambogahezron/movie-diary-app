import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie } from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { MovieService } from '../../services/movie';
import { FavoriteService } from '../../services/favorite';
import jwt from 'jsonwebtoken';

// Load user service mock
import '../__mocks__/userService';

describe('MovieController - GraphQL', () => {
  let server: ApolloServer;
  let authToken: string;
  let userId: number;
  let movieService: MovieService;
  let favoriteService: FavoriteService;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user
    const { user, token } = await createTestUser();
    authToken = token;
    userId = user.id;
    
    // Create services
    movieService = new MovieService();
    favoriteService = new FavoriteService();
    
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
    // Clear movies before each test
    await db.delete(schema.movies);
  });

  describe('Mutation: createMovie', () => {
    it('should create a new movie', async () => {
      const movieData = {
        title: 'Test Movie',
        tmdbId: '12345',
        posterPath: '/test/path.jpg',
        releaseDate: '2023-01-01',
        overview: 'Test overview',
        genres: ['Action', 'Drama']
      };

      // Mock context with authenticated user
      const context = {
        user: {
          id: userId,
          email: 'test@example.com',
          username: 'testuser'
        },
        movieService,
        favoriteService
      };

      const mutation = `
        mutation CreateMovie($input: MovieInput!) {
          createMovie(input: $input) {
            id
            title
            tmdbId
            posterPath
            releaseDate
            overview
          }
        }
      `;

      const response = await server.executeOperation({
        query: mutation,
        variables: { input: movieData }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.createMovie).toHaveProperty('id');
      expect(response.body.data?.createMovie.title).toBe(movieData.title);
      expect(response.body.data?.createMovie.tmdbId).toBe(movieData.tmdbId);

      // Check database
      const movies = await db.select().from(schema.movies);
      expect(movies.length).toBe(1);
      expect(movies[0].title).toBe(movieData.title);
    });

    it('should return error if not authenticated', async () => {
      const movieData = {
        title: 'Unauthorized Movie',
        tmdbId: '12345',
        posterPath: '/test/path.jpg',
        releaseDate: '2023-01-01',
        overview: 'Test overview',
        genres: ['Action', 'Drama']
      };

      const mutation = `
        mutation CreateMovie($input: MovieInput!) {
          createMovie(input: $input) {
            id
            title
          }
        }
      `;

      // Context without user
      const context = {
        movieService,
        favoriteService
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: { input: movieData }
      }, { contextValue: context });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Query: movies', () => {
    beforeEach(async () => {
      // Create test movies
      await createTestMovie({ title: 'Movie 1', tmdbId: '111' }, userId);
      await createTestMovie({ title: 'Movie 2', tmdbId: '222' }, userId);
      await createTestMovie({ title: 'Movie 3', tmdbId: '333' }, userId);
    });

    it('should get all movies for the user', async () => {
      const query = `
        query GetMovies($limit: Int, $offset: Int) {
          movies(limit: $limit, offset: $offset) {
            id
            title
            tmdbId
            overview
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
        movieService,
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { limit: 10, offset: 0 }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data?.movies)).toBeTruthy();
      expect(response.body.data?.movies.length).toBe(3);
      expect(response.body.data?.movies[0]).toHaveProperty('id');
      expect(response.body.data?.movies[0]).toHaveProperty('title');
    });

    it('should filter movies by search term', async () => {
      const query = `
        query GetMovies($search: String, $limit: Int, $offset: Int) {
          movies(search: $search, limit: $limit, offset: $offset) {
            id
            title
            tmdbId
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
        movieService,
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { search: 'Movie 2', limit: 10, offset: 0 }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data?.movies)).toBeTruthy();
      expect(response.body.data?.movies.length).toBe(1);
      expect(response.body.data?.movies[0].title).toBe('Movie 2');
    });
  });

  describe('Query: movie', () => {
    let movieId: string;

    beforeEach(async () => {
      // Create a test movie
      const movie = await createTestMovie(
        { title: 'Single Movie', tmdbId: '999', overview: 'Test single movie' },
        userId
      );
      movieId = movie.id.toString();
    });

    it('should get a single movie by ID', async () => {
      const query = `
        query GetMovie($id: ID!) {
          movie(id: $id) {
            id
            title
            tmdbId
            overview
            posterPath
            releaseDate
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
        movieService,
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { id: movieId }
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.movie).toBeDefined();
      expect(response.body.data?.movie.id).toBe(movieId);
      expect(response.body.data?.movie.title).toBe('Single Movie');
      expect(response.body.data?.movie.tmdbId).toBe('999');
    });

    it('should return null if movie not found', async () => {
      const query = `
        query GetMovie($id: ID!) {
          movie(id: $id) {
            id
            title
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
        movieService,
        favoriteService
      };

      const response = await server.executeOperation({
        query,
        variables: { id: '9999' } // Non-existent ID
      }, { contextValue: context });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.movie).toBeNull();
    });
  });

  describe('Mutation: updateMovie', () => {
    let movieId: string;

    beforeEach(async () => {
      // Create a test movie
      const movie = await createTestMovie(
        { title: 'Movie to Update', tmdbId: '555' },
        userId
      );
      movieId = movie.id.toString();
    });

    it('should update an existing movie', async () => {
      const updateData = {
        title: 'Updated Movie Title',
        overview: 'This is an updated overview'
      };

      const mutation = `
        mutation UpdateMovie($id: ID!, $input: MovieUpdateInput!) {
          updateMovie(id: $id, input: $input) {
            id
            title
            overview
            tmdbId
          }
        }
      `;

      const response = await request
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: mutation,
          variables: { id: movieId, input: updateData }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.updateMovie).toBeDefined();
      expect(response.body.data.updateMovie.id).toBe(movieId);
      expect(response.body.data.updateMovie.title).toBe(updateData.title);
      expect(response.body.data.updateMovie.overview).toBe(updateData.overview);

      // Verify database was updated
      const updatedMovie = await db.query.movies.findFirst({
        where: (movies) => movies.id.equals(parseInt(movieId))
      });
      expect(updatedMovie?.title).toBe(updateData.title);
      expect(updatedMovie?.overview).toBe(updateData.overview);
    });

    it('should return error when trying to update non-existent movie', async () => {
      const updateData = {
        title: 'This Should Fail',
      };

      const mutation = `
        mutation UpdateMovie($id: ID!, $input: MovieUpdateInput!) {
          updateMovie(id: $id, input: $input) {
            id
            title
          }
        }
      `;

      const response = await request
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: mutation,
          variables: { id: '99999', input: updateData }
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Mutation: deleteMovie', () => {
    let movieId: string;

    beforeEach(async () => {
      // Create a test movie
      const movie = await createTestMovie(
        { title: 'Movie to Delete', tmdbId: '777' },
        userId
      );
      movieId = movie.id.toString();
    });

    it('should delete an existing movie', async () => {
      const mutation = `
        mutation DeleteMovie($id: ID!) {
          deleteMovie(id: $id)
        }
      `;

      const response = await request
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: mutation,
          variables: { id: movieId }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.deleteMovie).toBe(true);

      // Verify movie was removed from database
      const movies = await db.query.movies.findMany({
        where: (movies) => movies.id.equals(parseInt(movieId))
      });
      expect(movies.length).toBe(0);
    });
  });

  describe('Query: popularMovies', () => {
    beforeEach(async () => {
      // Create several test movies with varying popularity
      await createTestMovie({ 
        title: 'Popular Movie 1', 
        tmdbId: '101', 
        popularity: 8.5 
      }, userId);
      await createTestMovie({ 
        title: 'Popular Movie 2', 
        tmdbId: '102', 
        popularity: 9.0 
      }, userId);
      await createTestMovie({ 
        title: 'Popular Movie 3', 
        tmdbId: '103', 
        popularity: 7.5 
      }, userId);
    });

    it('should return popular movies in descending order of popularity', async () => {
      const query = `
        query GetPopularMovies($limit: Int) {
          popularMovies(limit: $limit) {
            id
            title
            tmdbId
            popularity
          }
        }
      `;

      const response = await request
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query,
          variables: { limit: 2 }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.popularMovies).toBeInstanceOf(Array);
      expect(response.body.data.popularMovies.length).toBe(2);
      
      // First movie should be the most popular
      expect(response.body.data.popularMovies[0].title).toBe('Popular Movie 2');
    });
  });
});
