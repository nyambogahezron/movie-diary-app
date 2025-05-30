import { body } from 'express-validator';

/**
 * Validation rules for authentication endpoints
 */
export const authValidation = {
	/**
	 * Rules for user registration
	 */
	register: [
		body('username')
			.notEmpty()
			.withMessage('Username is required')
			.isLength({ min: 3, max: 30 })
			.withMessage('Username must be between 3 and 30 characters')
			.matches(/^[a-zA-Z0-9_]+$/)
			.withMessage('Username can only contain letters, numbers and underscores')
			.trim(),

		body('email')
			.notEmpty()
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Must provide a valid email address')
			.normalizeEmail(),

		body('password')
			.notEmpty()
			.withMessage('Password is required')
			.isLength({ min: 8 })
			.withMessage('Password must be at least 8 characters long')
			.matches(/[a-z]/)
			.withMessage('Password must contain at least one lowercase letter')
			.matches(/[A-Z]/)
			.withMessage('Password must contain at least one uppercase letter')
			.matches(/[0-9]/)
			.withMessage('Password must contain at least one number'),
	],

	/**
	 * Rules for user login
	 */
	login: [
		body('email')
			.notEmpty()
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Must provide a valid email address')
			.normalizeEmail(),

		body('password').notEmpty().withMessage('Password is required'),
	],

	/**
	 * Rules for refresh token
	 */
	refreshToken: [
		// No body validation needed as we use HTTP-only cookie
	],
};
