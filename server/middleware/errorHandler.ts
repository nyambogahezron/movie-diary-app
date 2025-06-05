import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
	status: string;
	message: string;
	stack?: string;
}

export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if (process.env.NODE_ENV !== 'test') {
	// 	console.error('ERROR 💥', err.name + ':', err.message);
	// }

	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err.message || 'Something went wrong!';

	const response: ErrorResponse = {
		status: 'error',
		message,
	};

	if (process.env.NODE_ENV === 'development') {
		response.stack = err.stack;
	}

	res.status(statusCode).json(response);
};
