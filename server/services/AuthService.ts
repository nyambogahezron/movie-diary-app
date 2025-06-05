import jwt from 'jsonwebtoken';
import { User } from '../helpers/User';
import { AuthPayload, JwtPayload, User as UserType } from '../types';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthenticationError';
	}
}

export class AuthService {
	private static readonly JWT_SECRET =
		process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
	private static readonly JWT_REFRESH_SECRET =
		process.env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex');
	private static readonly ACCESS_TOKEN_EXPIRY = '15m';
	private static readonly REFRESH_TOKEN_EXPIRY = '7d';

	static async register(
		name: string,
		username: string,
		email: string,
		password: string
	): Promise<AuthPayload> {
		const existingUserByEmail = await User.findByEmail(email);
		if (existingUserByEmail) {
			throw new AuthenticationError('Email is already registered');
		}

		const existingUserByUsername = await User.findByUsername(username);
		if (existingUserByUsername) {
			throw new AuthenticationError('Username is already taken');
		}

		const user = await User.create({ name, username, email, password });

		const { accessToken, refreshToken } = this.generateTokens(user);

		return { token: accessToken, refreshToken, user };
	}

	static async login(email: string, password: string): Promise<AuthPayload> {
		const user = await User.findByEmail(email);
		if (!user) {
			throw new AuthenticationError('Invalid credentials');
		}

		const isPasswordValid = await User.comparePassword(user.password, password);
		if (!isPasswordValid) {
			throw new AuthenticationError('Invalid credentials');
		}

		const { accessToken, refreshToken } = this.generateTokens(user);

		return { token: accessToken, refreshToken, user };
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
			if (error instanceof jwt.TokenExpiredError) {
				throw new AuthenticationError('Token expired');
			}
			throw new AuthenticationError('Invalid token');
		}
	}

	static async refreshAccessToken(
		refreshToken: string
	): Promise<{ accessToken: string }> {
		try {
			// Verify the refresh token
			const decoded = jwt.verify(
				refreshToken,
				this.JWT_REFRESH_SECRET
			) as JwtPayload;

			// Find user by ID
			const user = await User.findById(decoded.userId);

			if (!user) {
				throw new AuthenticationError('User not found');
			}

			// Generate a new access token
			const accessToken = this.generateAccessToken(user);

			return { accessToken };
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new AuthenticationError(
					'Refresh token expired, please login again'
				);
			}
			throw new AuthenticationError('Invalid refresh token');
		}
	}

	private static generateTokens(user: UserType): {
		accessToken: string;
		refreshToken: string;
	} {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		return { accessToken, refreshToken };
	}

	private static generateAccessToken(user: UserType): string {
		return jwt.sign({ userId: user.id }, this.JWT_SECRET, {
			expiresIn: this.ACCESS_TOKEN_EXPIRY,
			algorithm: 'HS256',
		});
	}

	private static generateRefreshToken(user: UserType): string {
		return jwt.sign({ userId: user.id }, this.JWT_REFRESH_SECRET, {
			expiresIn: this.REFRESH_TOKEN_EXPIRY,
			algorithm: 'HS256',
		});
	}
}
