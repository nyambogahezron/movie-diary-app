import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

// Create CSRF protection middleware
const csrfProtection = csrf({
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: true,
	},
});

/**
 * CSRF protection middleware
 * This middleware adds CSRF protection to routes that modify data
 */
export const csrfMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Skip CSRF for API routes that are called from mobile apps or other non-browser clients
	// We might want to implement a different security mechanism for these routes
	if (req.path.startsWith('/api/') && req.get('X-API-Client') === 'mobile') {
		return next();
	}

	// Apply CSRF protection
	return csrfProtection(req, res, next);
};

/**
 * Generate CSRF token middleware
 * This middleware generates and sends a CSRF token to the client
 */
export const generateCsrfToken = [
	csrfProtection,
	(req: Request, res: Response) => {
		// Send the CSRF token to the client
		res.status(200).json({
			csrfToken: req.csrfToken(),
		});
	},
];
