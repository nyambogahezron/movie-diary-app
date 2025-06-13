import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import AsyncHandler from '../middleware/asyncHandler';
import { BadRequestError } from '../errors';

export class AuthController {
	static register = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { name, username, email, password } = req.body;

			if (!name || !username || !email || !password) {
				res
					.status(400)
					.json({ error: 'Username, email, and password are required' });
				return;
			}

			const authPayload = await AuthService.register(
				name,
				username,
				email,
				password
			);

			// Set access token cookie
			res.cookie('accessToken', authPayload.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			// Set refresh token cookie
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
					user: {
						id: authPayload.user.id,
						name: authPayload.user.name,
						username: authPayload.user.username,
						email: authPayload.user.email,
						avatar: authPayload.user.avatar,
						createdAt: authPayload.user.createdAt,
					},
				},
			});
		}
	);

	static login = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { username, email, password } = req.body;

			const loginIdentifier = username || email;

			if (!loginIdentifier || !password) {
				throw new BadRequestError('Invalid Credentials ');
			}

			const authPayload = await AuthService.login(loginIdentifier, password);

			// Set access token cookie
			res.cookie('accessToken', authPayload.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			// Set refresh token cookie
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
					user: {
						id: authPayload.user.id,
						username: authPayload.user.username,
						email: authPayload.user.email,
						avatar: authPayload.user.avatar,
						createdAt: authPayload.user.createdAt,
					},
				},
			});
		}
	);

	static getCurrentUser = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
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
					},
				},
			});
		}
	);

	static refreshToken = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const refreshToken = req.cookies.refreshToken;

			if (!refreshToken) {
				res.status(400).json({ error: 'Refresh token is required' });
				return;
			}

			const { accessToken } = await AuthService.refreshAccessToken(
				refreshToken
			);

			// Set new access token cookie
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			res.status(200).json({
				message: 'Token refreshed successfully',
			});
		}
	);
}
