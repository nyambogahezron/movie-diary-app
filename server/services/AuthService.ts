import jwt from 'jsonwebtoken';
import { User } from '../helpers/User';
import { JwtPayload, User as UserType } from '../types';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { EmailService } from './EmailService';
import Token from '../utils/signedTokens';

export class AuthService {
	private static readonly JWT_SECRET = process.env.JWT_SECRET!;
	private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
	private static readonly ACCESS_TOKEN_EXPIRY = '15m';
	private static readonly REFRESH_TOKEN_EXPIRY = '7d';
	private static readonly RESET_TOKEN_SECRET =
		process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET!;

	static async register(
		name: string,
		username: string,
		email: string,
		password: string,
		ipAddress?: string
	) {
		const isEmailTaken = await User.findByEmail(email);
		const isUserNameTaken = await User.findByUsername(username);

		if (isEmailTaken || isUserNameTaken) {
			throw new BadRequestError(`Email or username already exists`);
		}

		const emailVerificationToken = crypto.randomBytes(32).toString('hex');
		const emailVerificationExpires = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		).toISOString(); // 24 hours

		const user = await User.create({
			name,
			username,
			email,
			password,
			emailVerificationToken,
			emailVerificationExpires,
			lastLoginIp: ipAddress,
			lastLoginAt: new Date().toISOString(),
		});

		await EmailService.sendVerificationEmail(user, emailVerificationToken);

		await EmailService.sendWelcomeEmail(user);

		return { user };
	}

	static async login(
		identifier: string,
		password: string,
		ipAddress?: string,
		deviceInfo?: string
	) {
		const user = await User.findUser(identifier);

		if (!user) {
			throw new BadRequestError('Invalid credentials');
		}

		const isPasswordValid = await User.comparePassword(user.password, password);

		if (!isPasswordValid) {
			throw new BadRequestError('Invalid credentials');
		}

		if (!user.isEmailVerified) {
			throw new UnauthorizedError('Please verify your email address first');
		}

		// Check if this is a new login from different IP
		const previousIp = user.lastLoginIp;
		if (ipAddress && previousIp && ipAddress !== previousIp) {
			// New device detected - send notification email
			await EmailService.sendNewLoginAlert(
				user,
				ipAddress,
				deviceInfo || 'Unknown device'
			);
		}

		await User.updateLoginInfo(
			user.id,
			ipAddress || null,
			new Date().toISOString()
		);

		const { accessToken, refreshToken } = this.generateTokens(user, deviceInfo);

		return { token: accessToken, refreshToken, user };
	}

	static async verifyToken(token: string): Promise<UserType> {
		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;

			// Find user by ID from token
			const user = await User.findById(decoded.userId);

			if (!user) {
				throw new BadRequestError('User not found');
			}

			return user;
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new BadRequestError('Token expired');
			}
			throw new BadRequestError('Invalid token');
		}
	}

	static async refreshAccessToken(
		refreshToken: string
	): Promise<{ accessToken: string }> {
		try {
			const decoded = jwt.verify(
				refreshToken,
				this.JWT_REFRESH_SECRET
			) as JwtPayload;

			const user = await User.findById(decoded.userId);

			if (!user) {
				throw new BadRequestError('User not found');
			}

			if (!user.isEmailVerified) {
				throw new UnauthorizedError('Please verify your email address first');
			}

			const accessToken = this.generateAccessToken(user, decoded.deviceInfo);

			return { accessToken };
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new BadRequestError('Refresh token expired, please login again');
			}
			throw new BadRequestError('Invalid refresh token');
		}
	}

	static async verifyEmail(token: string): Promise<UserType> {
		const user = await User.verifyEmail(token);

		if (!user) {
			throw new BadRequestError('Invalid or expired verification token');
		}

		return user;
	}

	static async requestPasswordReset(email: string) {
		const user = await User.findByEmail(email);

		if (!user) {
			throw new BadRequestError('User not found');
		}

		// Generate a 6-digit reset code
		const resetCode = Token.generateResetCode();
		// Hash the reset code for storage
		const hashedResetToken = Token.hashResetCode(resetCode, user.id);
		const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

		await db
			.update(users)
			.set({
				passwordResetToken: hashedResetToken,
				passwordResetExpires: resetExpires,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, user.id));

		// Send the plain text code to the user's email
		await EmailService.sendPasswordResetEmail(user, resetCode);

		return;
	}

	static async resetPassword(code: string, email: string, newPassword: string) {
		// First find user by email
		const user = await User.findByEmail(email);

		if (!user) {
			throw new BadRequestError('User not found');
		}

		// Check if user has a reset token
		if (!user.passwordResetToken) {
			throw new BadRequestError('No reset code requested');
		}

		// Check if reset code has expired based on passwordResetExpires field
		if (
			user.passwordResetExpires &&
			new Date(user.passwordResetExpires) < new Date()
		) {
			throw new BadRequestError('Reset code has expired');
		}

		// Verify the reset code against stored hash
		const isValidCode = Token.verifyResetCode(code, user.passwordResetToken);
		if (!isValidCode) {
			throw new BadRequestError('Invalid reset code');
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await db
			.update(users)
			.set({
				password: hashedPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, user.id));

		await EmailService.sendPasswordChangeNotification(user);
	}

	static async updateEmail(userId: number, newEmail: string) {
		const existingUser = await User.findByEmail(newEmail);

		if (existingUser) {
			throw new BadRequestError('Email is already registered');
		}

		const user = await User.findById(userId);
		if (!user) {
			throw new BadRequestError('User not found');
		}

		const oldEmail = user.email;

		await User.updateEmail(userId, newEmail);

		const verificationToken = crypto.randomBytes(32).toString('hex');
		const verificationExpires = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		).toISOString();

		await db
			.update(users)
			.set({
				emailVerificationToken: verificationToken,
				emailVerificationExpires: verificationExpires,
			})
			.where(eq(users.id, userId));

		await EmailService.sendEmailChangeNotification(user, oldEmail, newEmail);

		user.email = newEmail;
		await EmailService.sendVerificationEmail(user, verificationToken);
	}

	private static generateTokens(
		user: UserType,
		deviceInfo?: string
	): {
		accessToken: string;
		refreshToken: string;
	} {
		const accessToken = this.generateAccessToken(user, deviceInfo);
		const refreshToken = this.generateRefreshToken(user, deviceInfo);

		return { accessToken, refreshToken };
	}

	private static generateAccessToken(
		user: UserType,
		deviceInfo?: string
	): string {
		return jwt.sign({ userId: user.id, deviceInfo }, this.JWT_SECRET, {
			expiresIn: this.ACCESS_TOKEN_EXPIRY,
			algorithm: 'HS256',
		});
	}

	private static generateRefreshToken(
		user: UserType,
		deviceInfo?: string
	): string {
		return jwt.sign({ userId: user.id, deviceInfo }, this.JWT_REFRESH_SECRET, {
			expiresIn: this.REFRESH_TOKEN_EXPIRY,
			algorithm: 'HS256',
		});
	}
}
