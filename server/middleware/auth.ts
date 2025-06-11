import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/user';

// Extend Express Request type
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number;
				email: string;
				username: string;
				role?: string;
			};
		}
	}
}

export const authMiddleware = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		// Get token from Authorization header or cookie
		const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

		if (!token) {
			return next();
		}

		// Verify token
		const decoded = jwt.verify(token, config.security.jwtSecret) as {
			id: number;
			email: string;
			username: string;
			role?: string;
		};

		// Attach user to request
		req.user = decoded;

		next();
	} catch (error) {
		// Token is invalid or expired
		next();
	}
};

// Middleware to require authentication
export const requireAuth = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (!req.user) {
		throw new Error('Authentication required');
	}
	next();
};

// Middleware to require admin role (if you implement roles later)
export const requireAdmin = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (!req.user) {
		throw new Error('Authentication required');
	}
	// Add role check when you implement roles
	// if (req.user.role !== 'admin') {
	//   throw new Error('Admin access required');
	// }
	next();
};
