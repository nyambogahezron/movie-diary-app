import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/errors';
import { NextFunction, Request, Response } from 'express';

export default function ErrorHandlerMiddleware(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// default error
	let customError = new CustomError({
		message: 'Something went wrong, please try again later',
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
	});

	// check if error is an instance of CustomError
	if (err instanceof CustomError) {
		res.status(err.statusCode).json({ message: err.message });
		return;
	}

	if (err.name === 'AuthenticationError') {
		customError = new CustomError({
			message: err.message,
			statusCode: StatusCodes.BAD_REQUEST,
		});
		res.status(customError.statusCode).json({ message: customError.message });
		return;
	}

	if (err.name === 'Validation error' || Array.isArray((err as any).errors)) {
		const validationError = err as any;
		res.status(StatusCodes.BAD_REQUEST).json({
			error: 'Validation error',
			details: validationError.errors || [],
		});
		return;
	}

	if (err.name === 'CastError') {
		customError = new CustomError({
			message: 'Invalid ID',
			statusCode: StatusCodes.BAD_REQUEST,
		});
		res.status(customError.statusCode).json({ message: customError.message });
		return;
	}

	if ((err as any).code === 11000) {
		customError = new CustomError({
			message: 'Duplicate field value entered',
			statusCode: StatusCodes.BAD_REQUEST,
		});
		res.status(customError.statusCode).json({ message: customError.message });
		return;
	}

	// check if error is a JWT error
	if (err.name === 'JsonWebTokenError') {
		customError = new CustomError({
			message: 'Invalid token',
			statusCode: StatusCodes.UNAUTHORIZED,
		});
		res.status(customError.statusCode).json({ message: customError.message });
		return;
	}

	if (err.name === 'TokenExpiredError') {
		customError = new CustomError({
			message: 'Token expired',
			statusCode: StatusCodes.UNAUTHORIZED,
		});
		res.status(customError.statusCode).json({ message: customError.message });
		return;
	}

	res.status(customError.statusCode).json({
		message: customError.message,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	});
}
