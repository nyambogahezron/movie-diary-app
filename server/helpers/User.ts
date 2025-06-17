import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { User as UserType } from '../types';

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

		return result[0] as unknown as UserType;
	}

	static async findByEmail(email: string): Promise<UserType | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()));
		return result[0] as unknown as UserType;
	}

	static async findById(id: number): Promise<UserType | undefined> {
		const result = await db.select().from(users).where(eq(users.id, id));
		return result[0] as unknown as UserType;
	}

	static async findUser(identifier: string) {
		const result =
			(await db.select().from(users).where(eq(users.username, identifier))) ||
			(await db
				.select()
				.from(users)
				.where(eq(users.email, identifier.toLowerCase())));

		return result[0] as unknown as UserType;
	}

	static async findByUsername(username: string): Promise<UserType | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, username));
		return result[0] as unknown as UserType;
	}

	static async comparePassword(
		hashedPassword: string,
		candidatePassword: string
	): Promise<boolean> {
		return bcrypt.compare(candidatePassword, hashedPassword);
	}

	static async updateAvatar(userId: number, avatar: string): Promise<void> {
		await db
			.update(users)
			.set({ avatar, updatedAt: new Date().toISOString() })
			.where(eq(users.id, userId));
	}

	static async updateLoginInfo(
		userId: number,
		ip: string | null,
		timestamp: string
	): Promise<void> {
		await db
			.update(users)
			.set({
				lastLoginIp: ip,
				lastLoginAt: timestamp,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));
	}

	static async verifyEmail(
		verificationToken: string
	): Promise<UserType | undefined> {
		// Find user with this verification token
		const result = await db
			.select()
			.from(users)
			.where(eq(users.emailVerificationToken, verificationToken));

		if (result.length === 0) {
			return undefined;
		}

		const user = result[0] as unknown as UserType;

		// Check if token is expired
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

	static async updatePassword(userId: number, password: string): Promise<void> {
		const hashedPassword = await bcrypt.hash(password, 10);

		await db
			.update(users)
			.set({
				password: hashedPassword,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));
	}

	static async updateEmail(userId: number, email: string): Promise<void> {
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
