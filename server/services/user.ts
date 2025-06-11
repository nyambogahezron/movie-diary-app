import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../errors';

export class UserService {
	async findById(id: string) {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}

	async findAll({ limit = 10, offset = 0 }) {
		return await db.query.users.findMany({
			limit,
			offset,
		});
	}

	async create({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}) {
		const hashedPassword = await bcrypt.hash(password, 10);
		const [user] = await db
			.insert(users)
			.values({
				email,
				username,
				password: hashedPassword,
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

	async generateToken(user: { id: string; email: string; username: string }) {
		return jwt.sign(
			{ id: user.id, email: user.email, username: user.username },
			config.security.jwtSecret,
			{ expiresIn: '7d' }
		);
	}
}
