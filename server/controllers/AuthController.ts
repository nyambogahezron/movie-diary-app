import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
	static async register(req: Request, res: Response): Promise<void> {
		try {
			const { username, email, password } = req.body;

			if (!username || !email || !password) {
				res
					.status(400)
					.json({ error: 'Username, email, and password are required' });
				return;
			}

			const authPayload = await AuthService.register(username, email, password);

			if (authPayload.refreshToken) {
				res.cookie('refreshToken', authPayload.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});
			}

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

	static async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				res.status(400).json({ error: 'Email and password are required' });
				return;
			}

			const authPayload = await AuthService.login(email, password);

			if (authPayload.refreshToken) {
				res.cookie('refreshToken', authPayload.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});
			}

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

	static async getCurrentUser(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'Not authenticated' });
				return;
			}

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

	static async refreshToken(req: Request, res: Response): Promise<void> {
		try {
			const refreshToken = req.cookies.refreshToken;

			// Validate request
			if (!refreshToken) {
				res.status(400).json({ error: 'Refresh token is required' });
				return;
			}

			// Generate new access token
			const { accessToken } = await AuthService.refreshAccessToken(
				refreshToken
			);

			// Return the new access token
			res.status(200).json({
				message: 'Token refreshed successfully',
				data: {
					token: accessToken,
				},
			});
		} catch (error) {
			if ((error as Error).name === 'AuthenticationError') {
				// Clear the invalid refresh token cookie
				res.clearCookie('refreshToken');
				res.status(401).json({ error: (error as Error).message });
				return;
			}

			console.error('Refresh token error:', error);
			res.status(500).json({ error: 'An error occurred during token refresh' });
		}
	}
}
