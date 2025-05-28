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
		const token = authHeader.split(' ')[1];

		if (!token) {
			res.status(401).json({ error: 'Invalid authentication token format' });
			return;
		}

		// Verify the token and get the user
		const user = await AuthService.verifyToken(token);

		// Add the user to the request object
		req.user = user;

		// Continue to the next middleware or route handler
		next();
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
			const token = authHeader.split(' ')[1];

			if (token) {
				// Verify the token and get the user
				const user = await AuthService.verifyToken(token);

				// Add the user to the request object
				req.user = user;
			}
		}

		// Continue to the next middleware or route handler regardless of authentication
		next();
	} catch (error) {
		// If authentication fails, just continue without setting req.user
		next();
	}
};
