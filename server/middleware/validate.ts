import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request using express-validator rules
 * @param validations - Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Execute all validations
		await Promise.all(validations.map((validation) => validation.run(req)));

		// Check if there were validation errors
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				error: 'Validation error',
				details: errors.array(),
			});
		}

		next();
	};
};
