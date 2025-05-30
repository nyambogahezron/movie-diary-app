import { Request, Response, NextFunction } from 'express';

// Define a base error class that all our custom errors will extend from
export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true; // This means it's a known error that we can handle gracefully

		Error.captureStackTrace(this, this.constructor);
	}
}

// Error handler middleware
export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Log all errors
	console.error('ERROR 💥', err);

	// Default error information
	let statusCode = 500;
	let message = 'Something went wrong';
	let errorDetails: any = null;

	// If it's an operational error (one we threw ourselves)
	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;

		// In development mode, send stack trace
		if (process.env.NODE_ENV === 'development') {
			errorDetails = {
				stack: err.stack,
			};
		}
	} else if (err.name === 'ValidationError') {
		// Handle validation errors
		statusCode = 400;
		message = 'Validation error';
	} else if (err.name === 'JsonWebTokenError') {
		// Handle JWT errors
		statusCode = 401;
		message = 'Invalid token. Please log in again';
	} else if (err.name === 'TokenExpiredError') {
		// Handle expired token errors
		statusCode = 401;
		message = 'Your token has expired! Please log in again';
	} else {
		// Unexpected error
		if (process.env.NODE_ENV === 'development') {
			errorDetails = {
				stack: err.stack,
			};
		}
	}

	// Send error response
	res.status(statusCode).json({
		status: 'error',
		message,
		...(errorDetails && { details: errorDetails }),
		...(process.env.NODE_ENV === 'development' && {
			timestamp: new Date().toISOString(),
		}),
	});
};
