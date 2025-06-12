import jwt from 'jsonwebtoken';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

// Mocking the user service methods used in tests
jest.mock('../../services/user', () => {
	const originalModule = jest.requireActual('../../services/user');

	return {
		...originalModule,
		UserService: jest.fn().mockImplementation(() => ({
			...originalModule.UserService.prototype,
			getUserFromToken: jest.fn(async (token) => {
				try {
					const decoded = jwt.verify(
						token,
						process.env.JWT_SECRET || 'test_secret'
					) as any;

					if (decoded && decoded.id) {
						// Find user by ID
						const user = await db.query.users.findFirst({
							where: eq(schema.users.id, decoded.id),
						});

						if (user) {
							return {
								id: user.id,
								email: user.email,
								username: user.username,
								role: user.role,
							};
						}
					}
					return null;
				} catch (error) {
					console.error('Error decoding token:', error);
					return null;
				}
			}),
		})),
	};
});
