import { AuthService } from '../../services/AuthService';
import { User } from '../../helpers/User';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

describe('AuthService', () => {
	beforeAll(async () => {
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear users before each test
		await db.delete(schema.users);
	});

	describe('register', () => {
		it('should register a new user and return authentication payload', async () => {
			const userData = {
				name: 'Test User',
				username: 'testuser',
				email: 'test@example.com',
				password: 'Password123!',
			};

			const result = await AuthService.register(
				userData.name,
				userData.username,
				userData.email,
				userData.password
			);

			// Check that we get proper auth payload
			expect(result).toHaveProperty('token');
			expect(result).toHaveProperty('user');
			expect(result.user.username).toBe(userData.username);
			expect(result.user.email).toBe(userData.email);

			// Check database
			const users = await db
				.select()
				.from(schema.users)
				.where(eq(schema.users.email, userData.email));

			expect(users.length).toBe(1);
			expect(users[0].username).toBe(userData.username);

			// Check that password was hashed
			const passwordMatch = await bcrypt.compare(
				userData.password,
				users[0].password
			);
			expect(passwordMatch).toBe(true);
		});

		it('should throw error if username already exists', async () => {
			// Create a user first
			const existingUser = {
				name: 'Existing User',
				username: 'existinguser',
				email: 'unique@example.com',
				password: await bcrypt.hash('password', 10),
			};

			await db.insert(schema.users).values(existingUser);

			// Try to register with same username
			const userData = {
				name: 'Test User',
				username: 'existinguser',
				email: 'different@example.com',
				password: 'Password123!',
			};

			await expect(
				AuthService.register(
					userData.name,
					userData.username,
					userData.email,
					userData.password
				)
			).rejects.toThrow('Username already exists');
		});

		it('should throw error if email already exists', async () => {
			// Create a user first
			const existingUser = {
				name: 'Unique User',
				username: 'uniqueuser',
				email: 'existing@example.com',
				password: await bcrypt.hash('password', 10),
			};

			await db.insert(schema.users).values(existingUser);

			// Try to register with same email
			const userData = {
				name: 'Test User',
				username: 'differentuser',
				email: 'existing@example.com',
				password: 'Password123!',
			};

			await expect(
				AuthService.register(
					userData.name,
					userData.username,
					userData.email,
					userData.password
				)
			).rejects.toThrow('Email already exists');
		});
	});

	describe('login', () => {
		beforeEach(async () => {
			// Create a test user for login tests
			await db.insert(schema.users).values({
				name: 'Login User',
				username: 'loginuser',
				email: 'login@example.com',
				password: await bcrypt.hash('correctpassword', 10),
			});
		});

		it('should return auth payload when credentials are valid', async () => {
			const result = await AuthService.login(
				'login@example.com',
				'correctpassword'
			);

			expect(result).toHaveProperty('token');
			expect(result).toHaveProperty('user');
			expect(result.user.email).toBe('login@example.com');
			expect(result.user.username).toBe('loginuser');
		});

		it('should throw error when user does not exist', async () => {
			await expect(
				AuthService.login('nonexistent@example.com', 'anypassword')
			).rejects.toThrow('Invalid email or password');
		});

		it('should throw error when password is incorrect', async () => {
			await expect(
				AuthService.login('login@example.com', 'wrongpassword')
			).rejects.toThrow('Invalid email or password');
		});
	});

	describe('getUserById', () => {
		let userId: number;

		beforeEach(async () => {
			// Create a test user
			const result = await db
				.insert(schema.users)
				.values({
					name: 'Get By ID User',
					username: 'getbyiduser',
					email: 'getbyid@example.com',
					password: await bcrypt.hash('password', 10),
				})
				.returning();

			userId = result[0].id;
		});

		it('should return user when valid ID is provided', async () => {
			const user = await User.findById(userId);

			expect(user).toHaveProperty('id', userId);
			expect(user).toHaveProperty('username', 'getbyiduser');
			expect(user).toHaveProperty('email', 'getbyid@example.com');
		});

		it('should return null when user does not exist', async () => {
			const user = await User.findById(9999);
			expect(user).toBeNull();
		});
	});
});
