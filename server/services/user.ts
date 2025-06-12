import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class UserService {
	async findById(id: number) {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}

	async findAll({
		limit = 10,
		offset = 0,
	}: {
		limit?: number;
		offset?: number;
	}) {
		return await db.query.users.findMany({
			limit,
			offset,
		});
	}

	async create({
		email,
		username,
		password,
		name,
	}: {
		email: string;
		username: string;
		password: string;
		name: string;
	}) {
		const hashedPassword = await bcrypt.hash(password, 10);
		const [user] = await db
			.insert(users)
			.values({
				email,
				username,
				password: hashedPassword,
				name,
			})
			.returning();
		return user;
	}

	async authenticate(email: string, password: string) {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (!user) {
			throw new Error('Invalid credentials');
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			throw new Error('Invalid credentials');
		}

		return user;
	}

	async generateToken(user: { id: number; email: string; username: string }) {
		return jwt.sign(
			{ id: user.id, email: user.email, username: user.username },
			config.jwtSecret,
			{ expiresIn: '7d' }
		);
	}

	async update(
		id: number,
		input: {
			email?: string;
			username?: string;
			name?: string;
			avatar?: string;
			role?: 'USER' | 'ADMIN' | 'MODERATOR';
			isEmailVerified?: boolean;
			isAccountLocked?: boolean;
		}
	) {
		const [user] = await db
			.update(users)
			.set({
				...input,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, id))
			.returning();

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return user;
	}

	async verifyPassword(id: number, password: string) {
		const user = await this.findById(id);
		return bcrypt.compare(password, user.password);
	}

	async delete(id: number) {
		const [user] = await db.delete(users).where(eq(users.id, id)).returning();

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return true;
	}

	async updatePreferences(
		id: number,
		preferences: {
			emailNotifications?: boolean;
			pushNotifications?: boolean;
			theme?: 'light' | 'dark' | 'system';
			language?: string;
		}
	) {
		const [user] = await db
			.update(users)
			.set({
				preferences: JSON.stringify(preferences),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, id))
			.returning();

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return user;
	}

	async updateNotificationSettings(
		id: number,
		settings: {
			emailNotifications?: boolean;
			pushNotifications?: boolean;
			marketingEmails?: boolean;
			reviewNotifications?: boolean;
			watchlistNotifications?: boolean;
		}
	) {
		const [user] = await db
			.update(users)
			.set({
				notificationSettings: JSON.stringify(settings),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, id))
			.returning();

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return user;
	}

	async getUserFromToken(token: string) {
		try {
			const decoded = jwt.verify(token, config.jwtSecret) as { id: number };
			return this.findById(decoded.id);
		} catch (error) {
			throw new Error('Invalid token');
		}
	}
}
