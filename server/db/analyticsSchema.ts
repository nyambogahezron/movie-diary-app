import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { users } from './schema';

// Table to store request analytics data
export const requestLogs = sqliteTable('request_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	method: text('method').notNull(),
	path: text('path').notNull(),
	endpoint: text('endpoint').notNull(), // Normalized endpoint path (without params)
	statusCode: integer('status_code').notNull(),
	responseTime: integer('response_time').notNull(), // in milliseconds
	timestamp: text('timestamp')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	contentLength: integer('content_length'),
	query: text('query'), // JSON string of query parameters
	body: text('body'), // JSON string of request body (sanitized)
});

// Table to store aggregated analytics for users
export const userAnalytics = sqliteTable('user_analytics', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	totalRequests: integer('total_requests').notNull().default(0),
	lastActivity: text('last_activity')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	avgResponseTime: integer('avg_response_time').notNull().default(0),
	date: text('date').notNull(), // YYYY-MM-DD format
});

// Table to store aggregated analytics for endpoints
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
	date: text('date').notNull(), // YYYY-MM-DD format
});
