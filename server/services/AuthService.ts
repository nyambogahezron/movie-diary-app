import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthPayload, JwtPayload, User as UserType } from '../types';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Define a custom error for authentication issues
export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthenticationError';
	}
}

export class AuthService {
	private static readonly JWT_SECRET =
		process.env.JWT_SECRET || 'your-super-secret-jwt-key';

	static async register(
		username: string,
		email: string,
		password: string
	): Promise<AuthPayload> {
		// Check if user already exists with this email
		const existingUserByEmail = await User.findByEmail(email);
		if (existingUserByEmail) {
			throw new AuthenticationError('Email is already registered');
		}

		// Check if user already exists with this username
		const existingUserByUsername = await User.findByUsername(username);
		if (existingUserByUsername) {
			throw new AuthenticationError('Username is already taken');
		}

		// Create new user
		const user = await User.create({ username, email, password });

		// Generate token
		const token = this.generateToken(user);

		return { token, user };
	}

	static async login(email: string, password: string): Promise<AuthPayload> {
		// Find user by email
		const user = await User.findByEmail(email);
		if (!user) {
			throw new AuthenticationError('Invalid credentials');
		}

		// Verify password
		const isPasswordValid = await User.comparePassword(user.password, password);
		if (!isPasswordValid) {
			throw new AuthenticationError('Invalid credentials');
		}

		// Generate token
		const token = this.generateToken(user);

		return { token, user };
	}

	static async verifyToken(token: string): Promise<UserType> {
		try {
			// Verify and decode the token
			const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;

			// Find user by ID from token
			const user = await User.findById(decoded.userId);

			if (!user) {
				throw new AuthenticationError('User not found');
			}

			return user;
		} catch (error) {
			throw new AuthenticationError('Invalid or expired token');
		}
	}

	private static generateToken(user: UserType): string {
		return jwt.sign({ userId: user.id }, this.JWT_SECRET, { expiresIn: '7d' });
	}
}
