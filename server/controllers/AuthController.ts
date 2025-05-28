import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
	// Register a new user
	static async register(req: Request, res: Response): Promise<void> {
		try {
			const { username, email, password } = req.body;

			// Validate request body
			if (!username || !email || !password) {
				res
					.status(400)
					.json({ error: 'Username, email, and password are required' });
				return;
			}

			// Register the user
			const authPayload = await AuthService.register(username, email, password);

			// Return the auth token and user info
			res.status(201).json({
				message: 'User registered successfully',
				data: {
					token: authPayload.token,
					user: {
						id: authPayload.user.id,
						username: authPayload.user.username,
						email: authPayload.user.email,
						avatar: authPayload.user.avatar,
						createdAt: authPayload.user.createdAt,
					},
				},
			});
		} catch (error) {
			if ((error as Error).name === 'AuthenticationError') {
				res.status(400).json({ error: (error as Error).message });
				return;
			}

			console.error('Registration error:', error);
			res.status(500).json({ error: 'An error occurred during registration' });
		}
	}

	// Login a user
	static async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			// Validate request body
			if (!email || !password) {
				res.status(400).json({ error: 'Email and password are required' });
				return;
			}

			// Login the user
			const authPayload = await AuthService.login(email, password);

			// Return the auth token and user info
			res.status(200).json({
				message: 'Login successful',
				data: {
					token: authPayload.token,
					user: {
						id: authPayload.user.id,
						username: authPayload.user.username,
						email: authPayload.user.email,
						avatar: authPayload.user.avatar,
						createdAt: authPayload.user.createdAt,
					},
				},
			});
		} catch (error) {
			if ((error as Error).name === 'AuthenticationError') {
				res.status(401).json({ error: (error as Error).message });
				return;
			}

			console.error('Login error:', error);
			res.status(500).json({ error: 'An error occurred during login' });
		}
	}

	// Get current user profile
	static async getCurrentUser(req: Request, res: Response): Promise<void> {
		try {
			// User is already attached to req by the auth middleware
			if (!req.user) {
				res.status(401).json({ error: 'Not authenticated' });
				return;
			}

			// Return user info
			res.status(200).json({
				message: 'User profile retrieved successfully',
				data: {
					user: {
						id: req.user.id,
						username: req.user.username,
						email: req.user.email,
						avatar: req.user.avatar,
						createdAt: req.user.createdAt,
					},
				},
			});
		} catch (error) {
			console.error('Get current user error:', error);
			res
				.status(500)
				.json({ error: 'An error occurred while getting user profile' });
		}
	}
}
