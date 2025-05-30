import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { User } from '../types';

// Extend Express Request to include user
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

		// Extract the token (remove 'Bearer ' prefix)
		const parts = authHeader.split(' ');

		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			res.status(401).json({ error: 'Invalid authentication token format' });
			return;
		}

		const token = parts[1];

		// Verify the token and get the user
		try {
			const user = await AuthService.verifyToken(token);

			// Add the user to the request object
			req.user = user;

			// Continue to the next middleware or route handler
			next();
		} catch (error: any) {
			// Check if token is expired
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

// Optional middleware to check authentication without requiring it
export const optionalAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			// Extract the token (remove 'Bearer ' prefix)
			const parts = authHeader.split(' ');

			if (parts.length === 2 && parts[0] === 'Bearer') {
				const token = parts[1];

				try {
					// Verify the token and get the user
					const user = await AuthService.verifyToken(token);

					// Add the user to the request object
					req.user = user;
				} catch (error) {
					// Silently fail and proceed without authentication
				}
			}
		}

		// Continue to the next middleware or route handler regardless of authentication
		next();
	} catch (error) {
		// If authentication fails, just continue without setting req.user
		next();
	}
};
