import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { User as UserType } from '../types';

export class User {
	static async create(userData: {
		username: string;
		email: string;
		password: string;
		avatar?: string;
	}): Promise<UserType> {
		// Validate input
		if (!userData.username || userData.username.length < 3) {
			throw new Error('Username must be at least 3 characters long');
		}

		if (!userData.email) {
			throw new Error('Email is required');
		}

		if (!userData.password || userData.password.length < 6) {
			throw new Error('Password must be at least 6 characters long');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Insert user
		const result = await db
			.insert(users)
			.values({
				username: userData.username,
				email: userData.email.toLowerCase(),
				password: hashedPassword,
				avatar: userData.avatar || null,
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
}
