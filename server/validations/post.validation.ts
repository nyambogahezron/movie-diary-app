import { body, param, query } from 'express-validator';

export const validatePostCreate = [
	body('title')
		.isString()
		.notEmpty()
		.withMessage('Title is required')
		.isLength({ max: 255 })
		.withMessage('Title cannot exceed 255 characters'),

	body('tmdbId').isString().notEmpty().withMessage('TMDB ID is required'),

	body('posterPath')
		.optional()
		.isString()
		.withMessage('Poster path must be a string'),

	body('content')
		.isString()
		.notEmpty()
		.withMessage('Content is required')
		.isLength({ max: 2000 })
		.withMessage('Content cannot exceed 2000 characters'),

	body('isPublic')
		.optional()
		.isBoolean()
		.withMessage('isPublic must be a boolean'),
];

export const validatePostUpdate = [
	param('id').isInt().withMessage('Invalid post ID format'),

	body('title')
		.optional()
		.isString()
		.notEmpty()
		.withMessage('Title cannot be empty')
		.isLength({ max: 255 })
		.withMessage('Title cannot exceed 255 characters'),

	body('content')
		.optional()
		.isString()
		.notEmpty()
		.withMessage('Content cannot be empty')
		.isLength({ max: 2000 })
		.withMessage('Content cannot exceed 2000 characters'),

	body('isPublic')
		.optional()
		.isBoolean()
		.withMessage('isPublic must be a boolean'),
];

export const validatePostIdParam = [
	param('id').isInt().withMessage('Invalid post ID format'),
];

export const validatePostComment = [
	param('id').isInt().withMessage('Invalid post ID format'),

	body('content')
		.isString()
		.notEmpty()
		.withMessage('Comment content is required')
		.isLength({ max: 1000 })
		.withMessage('Comment cannot exceed 1000 characters'),
];

export const validateCommentUpdate = [
	param('commentId').isInt().withMessage('Invalid comment ID format'),

	body('content')
		.isString()
		.notEmpty()
		.withMessage('Comment content is required')
		.isLength({ max: 1000 })
		.withMessage('Comment cannot exceed 1000 characters'),
];

export const validateCommentIdParam = [
	param('commentId').isInt().withMessage('Invalid comment ID format'),
];

export const validatePostQuery = [
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 100'),

	query('offset')
		.optional()
		.isInt({ min: 0 })
		.withMessage('Offset must be a non-negative integer'),

	query('sortBy').optional().isString().withMessage('Sort by must be a string'),

	query('sortOrder')
		.optional()
		.isIn(['asc', 'desc'])
		.withMessage('Sort order must be either "asc" or "desc"'),

	query('isPublic')
		.optional()
		.isIn(['true', 'false'])
		.withMessage('isPublic must be either "true" or "false"'),
];
