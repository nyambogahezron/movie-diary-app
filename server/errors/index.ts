import { AppError } from '../middleware/errorHandler';

export class AuthenticationError extends AppError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Not authorized') {
		super(message, 403, 'AUTHORIZATION_ERROR');
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource already exists') {
		super(message, 409, 'CONFLICT_ERROR');
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string) {
		super(message, 403);
	}
}
