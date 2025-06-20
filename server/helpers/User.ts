import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { User as UserType } from '../types';
import { BadRequestError } from '../utils/errors';

export class User {
	static async create(userData: {
		name: string;
		username: string;
		email: string;
		password: string;
		avatar?: string;
		emailVerificationToken?: string;
		emailVerificationExpires?: string;
		passwordResetToken?: string;
		passwordResetExpires?: string;
		lastLoginIp?: string;
		lastLoginAt?: string;
	}): Promise<UserType> {
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		const result = await db
			.insert(users)
			.values({
				name: userData.name,
				username: userData.username,
				email: userData.email.toLowerCase(),
				password: hashedPassword,
				avatar: userData.avatar || null,
				isEmailVerified: false,
				emailVerificationToken: userData.emailVerificationToken,
				emailVerificationExpires: userData.emailVerificationExpires,
				passwordResetToken: userData.passwordResetToken,
				passwordResetExpires: userData.passwordResetExpires,
				lastLoginAt: userData.lastLoginAt,
				lastLoginIp: userData.lastLoginIp,
			})
			.returning();

		return result[0] as UserType;
	}

	static async findByEmail(email: string) {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()));
		return result[0] as UserType;
	}

	static async findById(id: number) {
		const result = await db.select().from(users).where(eq(users.id, id));
		return result[0] as UserType;
	}

	static async findByUsername(username: string) {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, username));
		return result[0] as UserType;
	}

	static async findUser(identifier: string) {
		const resultByUsername = this.findByUsername(identifier);
		if (resultByUsername) {
			return resultByUsername;
		}

		const resultByEmail = await this.findByEmail(identifier);
		if (resultByEmail) {
			return resultByEmail;
		}

		return undefined;
	}

	static async comparePassword(
		hashedPassword: string,
		candidatePassword: string
	) {
		return bcrypt.compare(candidatePassword, hashedPassword);
	}

	static async updateAvatar(userId: number, avatar: string) {
		await db
			.update(users)
			.set({ avatar, updatedAt: new Date().toISOString() })
			.where(eq(users.id, userId));
	}

	static async updateLoginInfo(
		userId: number,
		ip: string | null,
		timestamp: string
	) {
		await db
			.update(users)
			.set({
				lastLoginIp: ip,
				lastLoginAt: timestamp,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));
	}

	static async verifyEmail(verificationToken: string) {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.emailVerificationToken, verificationToken));

		if (result.length === 0) {
			return undefined;
		}

		const user = result[0] as UserType;

		if (!user.isEmailVerified) {
			throw new BadRequestError(
				'Email is already verified or verification token is invalid'
			);
		}

		if (
			user.emailVerificationExpires &&
			new Date(user.emailVerificationExpires) < new Date()
		) {
			return undefined;
		}

		// Mark email as verified
		await db
			.update(users)
			.set({
				isEmailVerified: true,
				emailVerificationToken: null,
				emailVerificationExpires: null,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, user.id));

		return user;
	}

	static async updatePassword(userId: number, password: string) {
		const hashedPassword = await bcrypt.hash(password, 10);

		await db
			.update(users)
			.set({
				password: hashedPassword,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));
	}

	static async updateEmail(userId: number, email: string) {
		await db
			.update(users)
			.set({
				email: email.toLowerCase(),
				isEmailVerified: false,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));
	}
}
