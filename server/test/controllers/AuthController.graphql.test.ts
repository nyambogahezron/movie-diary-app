import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser } from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/AuthService';
import jwt from 'jsonwebtoken';

// Load user service mock
import '../__mocks__/userService';

describe('AuthController - GraphQL', () => {
  let server: ApolloServer;
  let authToken: string;
  let userId: number;
  let userService: UserService;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create services
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
    // Clear users before each test
    await db.delete(schema.users);
  });

  describe('Mutation: register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
      };

      const mutation = `
        mutation Register($email: String!, $username: String!, $password: String!) {
          register(email: $email, username: $username, password: $password) {
            user {
              id
              email
              username
              role
              isEmailVerified
            }
            token
            refreshToken
          }
        }
      `;

      // Mock response object
      const res = {
        cookie: jest.fn(),
      };

      const response = await server.executeOperation({
        query: mutation,
        variables: userData
      }, { contextValue: { userService, res } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.register).toHaveProperty('user');
      expect(response.body.data?.register.user).toHaveProperty('id');
      expect(response.body.data?.register.user.email).toBe(userData.email);
      expect(response.body.data?.register.user.username).toBe(userData.username);
      expect(response.body.data?.register.token).toBeTruthy();
      expect(response.body.data?.register.refreshToken).toBeTruthy();

      // Check database
      const users = await db.select().from(schema.users);
      expect(users.length).toBe(1);
      expect(users[0].email).toBe(userData.email);
    });

    it('should not register a user with existing email', async () => {
      // Create a user first
      await createTestUser({
        email: 'existing@example.com',
        username: 'existinguser',
      });

      const userData = {
        email: 'existing@example.com', // Same email
        username: 'newuser',
        password: 'Test123!@#',
      };

      const mutation = `
        mutation Register($email: String!, $username: String!, $password: String!) {
          register(email: $email, username: $username, password: $password) {
            user {
              id
            }
          }
        }
      `;

      const res = { cookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
        variables: userData
      }, { contextValue: { userService, res } });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Email already exists');
    });
  });

  describe('Mutation: login', () => {
    it('should login a registered user', async () => {
      // Create a test user
      const { user, token } = await createTestUser();
      
      const loginData = {
        email: user.email,
        password: 'password123', // Matches the password in createTestUser
      };

      const mutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            user {
              id
              email
              username
              role
            }
            token
            refreshToken
          }
        }
      `;

      const res = { cookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
        variables: loginData
      }, { contextValue: { userService, res } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.login).toHaveProperty('user');
      expect(response.body.data?.login.user.email).toBe(user.email);
      expect(response.body.data?.login.token).toBeTruthy();
      expect(response.body.data?.login.refreshToken).toBeTruthy();
    });

    it('should not login with invalid credentials', async () => {
      // Create a test user
      const { user } = await createTestUser();
      
      const loginData = {
        email: user.email,
        password: 'wrongpassword', // Wrong password
      };

      const mutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            user {
              id
            }
          }
        }
      `;

      const res = { cookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
        variables: loginData
      }, { contextValue: { userService, res } });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Invalid credentials');
    });
  });

  describe('Mutation: logout', () => {
    it('should logout a user', async () => {
      // Create a test user
      const { user, token } = await createTestUser();
      
      const mutation = `
        mutation Logout {
          logout
        }
      `;

      const res = { clearCookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
      }, { 
        contextValue: { 
          user: { id: user.id, email: user.email, username: user.username },
          res 
        } 
      });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.logout).toBe(true);
      expect(res.clearCookie).toHaveBeenCalled();
    });

    it('should fail to logout if not authenticated', async () => {
      const mutation = `
        mutation Logout {
          logout
        }
      `;

      const res = { clearCookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
      }, { contextValue: { res } });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Query: me', () => {
    it('should return the authenticated user', async () => {
      // Create a test user
      const { user, token } = await createTestUser();

      const query = `
        query Me {
          me {
            id
            email
            username
            role
          }
        }
      `;

      const response = await server.executeOperation({
        query,
      }, { 
        contextValue: { 
          user: { id: user.id, email: user.email, username: user.username },
          userService 
        } 
      });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.me).toHaveProperty('id');
      expect(response.body.data?.me.email).toBe(user.email);
      expect(response.body.data?.me.username).toBe(user.username);
    });

    it('should fail if not authenticated', async () => {
      const query = `
        query Me {
          me {
            id
          }
        }
      `;

      const response = await server.executeOperation({
        query,
      }, { contextValue: { userService } });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors?.[0].message).toContain('Not authenticated');
    });
  });

  describe('Mutation: refreshToken', () => {
    it('should refresh a valid token', async () => {
      // Create a test user
      const { user, token } = await createTestUser();
      
      // Mock the refreshToken functionality
      jest.spyOn(AuthService, 'refreshAccessToken').mockResolvedValueOnce({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      const mutation = `
        mutation RefreshToken($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            token
          }
        }
      `;

      const res = { cookie: jest.fn() };

      const response = await server.executeOperation({
        query: mutation,
        variables: { refreshToken: 'valid-refresh-token' }
      }, { contextValue: { res } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.refreshToken).toHaveProperty('token');
      expect(response.body.data?.refreshToken.token).toBe('new-access-token');
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
