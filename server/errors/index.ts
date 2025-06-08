import { StatusCodes } from 'http-status-codes';

export default class CustomError extends Error {
	statusCode: number;

	constructor({
		message,
		statusCode,
	}: {
		message: string;
		statusCode: number;
	}) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super({ message, statusCode: StatusCodes.NOT_FOUND });
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super({ message, statusCode: StatusCodes.BAD_REQUEST });
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super({ message, statusCode: StatusCodes.UNAUTHORIZED });
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super({ message, statusCode: StatusCodes.FORBIDDEN });
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string) {
		super({ message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR });
		this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	}
}
