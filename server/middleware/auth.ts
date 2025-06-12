import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/user';
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
	_res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

		if (!token) {
			return next();
		}

		const decoded = jwt.verify(token, config.jwtSecret) as {
			id: number;
			email: string;
			username: string;
			role?: string;
		};

		const userService = new UserService();
		const user = await userService.findById(decoded.id);

		req.user = user;

		next();
	} catch (error) {
		next();
	}
};

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

export const requireAdmin = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (!req.user) {
		throw new Error('Authentication required');
	}
	next();
};
