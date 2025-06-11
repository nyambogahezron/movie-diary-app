import { Request, Response, NextFunction } from 'express';
import { GraphQLError } from 'graphql';
import { ValidationError } from '../utils/validation';
import {
	NotFoundError,
	UnauthorizedError,
	BadRequestError,
	ForbiddenError,
} from '../utils/errors';
import { config } from '../config';

// Custom error types
export class DatabaseError extends Error {
	constructor(message: string, public originalError?: any) {
		super(message);
		this.name = 'DatabaseError';
	}
}

export class RateLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RateLimitError';
	}
}

export class ServiceUnavailableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ServiceUnavailableError';
	}
}

// Error codes mapping
const errorCodes = {
	ValidationError: 'VALIDATION_ERROR',
	NotFoundError: 'NOT_FOUND',
	UnauthorizedError: 'UNAUTHORIZED',
	BadRequestError: 'BAD_REQUEST',
	ForbiddenError: 'FORBIDDEN',
	DatabaseError: 'DATABASE_ERROR',
	RateLimitError: 'RATE_LIMIT_EXCEEDED',
	ServiceUnavailableError: 'SERVICE_UNAVAILABLE',
} as const;

// Format error for response
function formatError(error: Error) {
	const code =
		errorCodes[error.name as keyof typeof errorCodes] ||
		'INTERNAL_SERVER_ERROR';
	const status = getHttpStatus(code);

	const formattedError = {
		code,
		message: error.message,
		status,
		...(config.nodeEnv === 'development' && { stack: error.stack }),
	};

	// Add validation errors if present
	if (error instanceof ValidationError) {
		formattedError['errors'] = error.errors;
	}

	// Add original error for database errors in development
	if (error instanceof DatabaseError && config.nodeEnv === 'development') {
		formattedError['originalError'] = error.originalError;
	}

	return formattedError;
}

// Get HTTP status code for error
function getHttpStatus(code: string): number {
	const statusMap: Record<string, number> = {
		VALIDATION_ERROR: 400,
		NOT_FOUND: 404,
		UNAUTHORIZED: 401,
		BAD_REQUEST: 400,
		FORBIDDEN: 403,
		DATABASE_ERROR: 500,
		RATE_LIMIT_EXCEEDED: 429,
		SERVICE_UNAVAILABLE: 503,
		INTERNAL_SERVER_ERROR: 500,
	};
	return statusMap[code] || 500;
}

// Express error handler middleware
export function errorHandler(
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const formattedError = formatError(error);
	const status = formattedError.status;

	// Log error
	console.error(
		`[${new Date().toISOString()}] ${error.name}: ${error.message}`
	);
	if (error.stack) {
		console.error(error.stack);
	}

	// Send error response
	res.status(status).json({
		error: formattedError,
	});
}

// GraphQL error formatter
export function formatGraphQLError(error: GraphQLError) {
	const originalError = error.originalError as Error;

	if (originalError) {
		// Handle known error types
		if (originalError instanceof ValidationError) {
			return {
				message: 'Validation failed',
				code: 'VALIDATION_ERROR',
				errors: originalError.errors,
				path: error.path,
			};
		}

		if (originalError instanceof NotFoundError) {
			return {
				message: originalError.message,
				code: 'NOT_FOUND',
				path: error.path,
			};
		}

		if (originalError instanceof UnauthorizedError) {
			return {
				message: originalError.message,
				code: 'UNAUTHORIZED',
				path: error.path,
			};
		}

		if (originalError instanceof BadRequestError) {
			return {
				message: originalError.message,
				code: 'BAD_REQUEST',
				path: error.path,
			};
		}

		if (originalError instanceof ForbiddenError) {
			return {
				message: originalError.message,
				code: 'FORBIDDEN',
				path: error.path,
			};
		}

		if (originalError instanceof DatabaseError) {
			return {
				message: 'Database operation failed',
				code: 'DATABASE_ERROR',
				path: error.path,
				...(config.nodeEnv === 'development' && {
					originalError: originalError.originalError,
				}),
			};
		}

		if (originalError instanceof RateLimitError) {
			return {
				message: originalError.message,
				code: 'RATE_LIMIT_EXCEEDED',
				path: error.path,
			};
		}

		if (originalError instanceof ServiceUnavailableError) {
			return {
				message: originalError.message,
				code: 'SERVICE_UNAVAILABLE',
				path: error.path,
			};
		}
	}

	// Handle unknown errors
	return {
		message:
			config.nodeEnv === 'production' ? 'Internal server error' : error.message,
		code: 'INTERNAL_SERVER_ERROR',
		path: error.path,
		...(config.nodeEnv === 'development' && { stack: error.stack }),
	};
}

// Error boundary for async functions
export function asyncErrorBoundary(fn: Function) {
	return async (...args: any[]) => {
		try {
			return await fn(...args);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred');
		}
	};
}

// Database error handler
export function handleDatabaseError(error: any): never {
	console.error('Database error:', error);

	if (error.code === '23505') {
		// Unique violation
		throw new BadRequestError('A record with this value already exists');
	}

	if (error.code === '23503') {
		// Foreign key violation
		throw new BadRequestError('Referenced record does not exist');
	}

	if (error.code === '22P02') {
		// Invalid text representation
		throw new BadRequestError('Invalid input value');
	}

	throw new DatabaseError('Database operation failed', error);
}

// Rate limit error handler
export function handleRateLimitError(limit: number, windowMs: number): never {
	const retryAfter = Math.ceil(windowMs / 1000);
	throw new RateLimitError(
		`Too many requests. Please try again after ${retryAfter} seconds. ` +
			`Limit: ${limit} requests per ${windowMs / 1000 / 60} minutes.`
	);
}

// Service availability check
export function checkServiceAvailability(service: string): void {
	// Implement service health checks here
	// For example, check database connection, external API status, etc.
	if (!isServiceHealthy(service)) {
		throw new ServiceUnavailableError(
			`${service} service is currently unavailable`
		);
	}
}

function isServiceHealthy(service: string): boolean {
	// Implement actual health check logic here
	return true;
}
