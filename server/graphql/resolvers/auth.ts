import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLContext } from '../context';
import { AuthService } from '../../services/AuthService';
import { AuthController } from '../../controllers/AuthController';

export const authResolvers: IResolvers = {
	Mutation: {
		register: async (
			_parent,
			{ email, username, password },
			context: GraphQLContext
		) => {
			const authPayload = await AuthService.register(
				'',
				username,
				email,
				password
			);
			// Set cookies
			context.res.cookie('accessToken', authPayload.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});
			if (authPayload.refreshToken) {
				context.res.cookie('refreshToken', authPayload.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});
			}
			return {
				user: authPayload.user,
				token: authPayload.token,
				refreshToken: authPayload.refreshToken,
			};
		},

		login: async (_parent, { email, password }, context: GraphQLContext) => {
			const authPayload = await AuthService.login(email, password);
			// Set cookies
			context.res.cookie('accessToken', authPayload.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});
			if (authPayload.refreshToken) {
				context.res.cookie('refreshToken', authPayload.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});
			}
			return {
				user: authPayload.user,
				token: authPayload.token,
				refreshToken: authPayload.refreshToken,
			};
		},

		logout: async (_parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			// Clear cookies
			context.res.clearCookie('accessToken');
			context.res.clearCookie('refreshToken');
			return true;
		},

		refreshToken: async (
			_parent,
			{ refreshToken },
			context: GraphQLContext
		) => {
			const { accessToken } = await AuthService.refreshAccessToken(
				refreshToken
			);
			// Set new access token cookie
			context.res.cookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});
			return { token: accessToken };
		},

		requestPasswordReset: async (
			_parent,
			{ email },
			context: GraphQLContext
		) => {
			// TODO: Implement password reset request
			throw new Error('Not implemented');
		},

		resetPassword: async (
			_parent,
			{ token, newPassword },
			context: GraphQLContext
		) => {
			// TODO: Implement password reset
			throw new Error('Not implemented');
		},

		changePassword: async (
			_parent,
			{ currentPassword, newPassword },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			// TODO: Implement password change
			throw new Error('Not implemented');
		},

		resendVerificationEmail: async (
			_parent,
			_args,
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			// TODO: Implement resend verification email
			throw new Error('Not implemented');
		},

		verifyEmail: async (_parent, { token }, context: GraphQLContext) => {
			// TODO: Implement email verification
			throw new Error('Not implemented');
		},
	},

	Query: {
		checkPasswordResetToken: async (
			_parent,
			{ token },
			context: GraphQLContext
		) => {
			// TODO: Implement token validation
			throw new Error('Not implemented');
		},

		verifyEmail: async (_parent, { token }, context: GraphQLContext) => {
			// TODO: Implement email verification
			throw new Error('Not implemented');
		},
	},
};
