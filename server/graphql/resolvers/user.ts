import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { GraphQLContext } from '../context';

export const userResolvers: IResolvers = {
	Query: {
		me: async (_parent, _args, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.userService.findById(context.user.id);
		},

		user: async (_parent, { id }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}
			return await context.userService.findById(id);
		},

		users: async (
			_parent,
			{ limit = 10, offset = 0 },
			context: GraphQLContext
		) => {
			if (!context.user || context.user.role !== 'ADMIN') {
				throw new ForbiddenError('Not authorized');
			}
			return await context.userService.findAll({ limit, offset });
		},
	},

	Mutation: {
		updateProfile: async (
			_parent,
			{ username, email },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const updateData: Record<string, any> = {};
			if (username) updateData.username = username;
			if (email) updateData.email = email;

			return await context.userService.update(context.user.id, updateData);
		},

		deleteAccount: async (_parent, { password }, context: GraphQLContext) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			const isValid = await context.userService.verifyPassword(
				context.user.id,
				password
			);

			if (!isValid) {
				throw new AuthenticationError('Invalid password');
			}

			await context.userService.delete(context.user.id);
			return true;
		},

		updateUserRole: async (
			_parent,
			{ userId, role },
			context: GraphQLContext
		) => {
			if (!context.user || context.user.role !== 'ADMIN') {
				throw new ForbiddenError('Not authorized');
			}

			return await context.userService.update(userId, { role });
		},

		lockUserAccount: async (
			_parent,
			{ userId, reason },
			context: GraphQLContext
		) => {
			if (!context.user || context.user.role !== 'ADMIN') {
				throw new ForbiddenError('Not authorized');
			}

			await context.userService.update(userId, {
				isAccountLocked: true,
				lockReason: reason,
			});

			return true;
		},

		unlockUserAccount: async (_parent, { userId }, context: GraphQLContext) => {
			if (!context.user || context.user.role !== 'ADMIN') {
				throw new ForbiddenError('Not authorized');
			}

			await context.userService.update(userId, {
				isAccountLocked: false,
				lockReason: null,
			});

			return true;
		},

		updateUserPreferences: async (
			_parent,
			{ preferences },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.userService.updatePreferences(
				context.user.id,
				preferences
			);
		},

		updateNotificationSettings: async (
			_parent,
			{ settings },
			context: GraphQLContext
		) => {
			if (!context.user) {
				throw new AuthenticationError('Not authenticated');
			}

			return await context.userService.updateNotificationSettings(
				context.user.id,
				settings
			);
		},
	},

	User: {
		reviews: async (parent, _args, context: GraphQLContext) => {
			return await context.movieReviewService.findByUserId(parent.id);
		},

		watchlists: async (parent, _args, context: GraphQLContext) => {
			return await context.watchlistService.findByUserId(parent.id);
		},

		favorites: async (parent, _args, context: GraphQLContext) => {
			return await context.favoriteService.findByUserId(parent.id);
		},

		posts: async (parent, _args, context: GraphQLContext) => {
			return await context.postService.findByUserId(parent.id);
		},
	},
};
