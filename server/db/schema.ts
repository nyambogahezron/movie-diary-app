import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	role: text('role', { enum: ['USER', 'ADMIN', 'MODERATOR'] })
		.notNull()
		.default('USER'),
	isEmailVerified: integer('is_email_verified', { mode: 'boolean' })
		.notNull()
		.default(false),
	isAccountLocked: integer('is_account_locked', { mode: 'boolean' })
		.notNull()
		.default(false),
	emailVerificationToken: text('email_verification_token'),
	emailVerificationTokenExpires: text('email_verification_token_expires'),
	passwordResetToken: text('password_reset_token'),
	passwordResetTokenExpires: text('password_reset_token_expires'),
	failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
	lastFailedLogin: text('last_failed_login'),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const refreshTokens = sqliteTable('refresh_tokens', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const loginAttempts = sqliteTable('login_attempts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id, {
		onDelete: 'cascade',
	}),
	ipAddress: text('ip_address').notNull(),
	userAgent: text('user_agent'),
	success: integer('success', { mode: 'boolean' }).notNull(),
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const movies = sqliteTable('movies', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	tmdbId: text('tmdb_id').notNull(),
	posterPath: text('poster_path'),
	releaseDate: text('release_date'),
	overview: text('overview'),
	rating: integer('rating'),
	watchDate: text('watch_date'),
	review: text('review'),
	genres: text('genres'),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const watchlists = sqliteTable('watchlists', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const watchlistMovies = sqliteTable('watchlist_movies', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	watchlistId: integer('watchlist_id')
		.notNull()
		.references(() => watchlists.id, { onDelete: 'cascade' }),
	movieId: integer('movie_id')
		.notNull()
		.references(() => movies.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const favorites = sqliteTable('favorites', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	movieId: integer('movie_id')
		.notNull()
		.references(() => movies.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const movieReviews = sqliteTable('movie_reviews', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	movieId: integer('movie_id')
		.notNull()
		.references(() => movies.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	rating: integer('rating'),
	isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	tmdbId: text('tmdb_id').notNull(),
	posterPath: text('poster_path'),
	title: text('title').notNull(),
	content: text('content').notNull(),
	likesCount: integer('likes_count').notNull().default(0),
	commentsCount: integer('comments_count').notNull().default(0),
	isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const postLikes = sqliteTable('post_likes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	postId: integer('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const postComments = sqliteTable('post_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	postId: integer('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const requestLogs = sqliteTable('request_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	method: text('method').notNull(),
	path: text('path').notNull(),
	endpoint: text('endpoint').notNull(),
	statusCode: integer('status_code').notNull(),
	responseTime: integer('response_time').notNull(),
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	contentLength: integer('content_length'),
	query: text('query'),
	body: text('body'),
});

export const userAnalytics = sqliteTable('user_analytics', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	totalRequests: integer('total_requests').notNull().default(0),
	lastActivity: text('last_activity')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	avgResponseTime: integer('avg_response_time').notNull().default(0),
	date: text('date').notNull(),
});

export const endpointAnalytics = sqliteTable('endpoint_analytics', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	endpoint: text('endpoint').notNull(), // Normalized endpoint path
	method: text('method').notNull(),
	totalRequests: integer('total_requests').notNull().default(0),
	avgResponseTime: integer('avg_response_time').notNull().default(0),
	minResponseTime: integer('min_response_time'),
	maxResponseTime: integer('max_response_time'),
	successCount: integer('success_count').notNull().default(0),
	errorCount: integer('error_count').notNull().default(0),
	date: text('date').notNull(),
});
