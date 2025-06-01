import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { User } from '../types';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			res.status(401).json({ error: 'No authentication token provided' });
			return;
		}

		const parts = authHeader.split(' ');

		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			res.status(401).json({ error: 'Invalid authentication token format' });
			return;
		}

		const token = parts[1];

		try {
			const user = await AuthService.verifyToken(token);

			req.user = user;

			next();
		} catch (error: any) {
			if (error.message === 'Token expired') {
				res.status(401).json({
					error: 'Token expired',
					code: 'TOKEN_EXPIRED',
				});
				return;
			}

			throw error;
		}
	} catch (error) {
		res
			.status(401)
			.json({ error: 'Authentication failed: ' + (error as Error).message });
	}
};

export const optionalAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const parts = authHeader.split(' ');

			if (parts.length === 2 && parts[0] === 'Bearer') {
				const token = parts[1];

				try {
					const user = await AuthService.verifyToken(token);

					req.user = user;
				} catch (error) {}
			}
		}

		next();
	} catch (error) {
		next();
	}
};
