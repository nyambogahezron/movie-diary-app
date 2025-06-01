import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request using express-validator rules
 * @param validations - Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			await Promise.all(validations.map((validation) => validation.run(req)));

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.status(400).json({
					error: 'Validation error',
					details: errors.array(),
				});
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
