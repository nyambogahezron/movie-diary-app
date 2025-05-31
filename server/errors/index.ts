export class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: number = 500,
		public code?: string
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string = 'Authentication failed') {
		super(message, 401, 'AUTHENTICATION_ERROR');
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Not authorized') {
		super(message, 403, 'AUTHORIZATION_ERROR');
	}
}

export class ValidationError extends AppError {
	constructor(message: string = 'Validation failed') {
		super(message, 400, 'VALIDATION_ERROR');
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404, 'NOT_FOUND_ERROR');
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource already exists') {
		super(message, 409, 'CONFLICT_ERROR');
	}
}
