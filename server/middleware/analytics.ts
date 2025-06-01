import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { requestLogs } from '../db/analyticsSchema';
import { eq, and, sql } from 'drizzle-orm';
import { userAnalytics, endpointAnalytics } from '../db/analyticsSchema';

const normalizeEndpoint = (path: string): string => {
	return path.replace(/\/[0-9]+(?=\/|$)/g, '/:id');
};

const sanitizeRequestBody = (body: any): any => {
	if (!body) return null;

	const sanitized = { ...body };

	const sensitiveFields = [
		'password',
		'token',
		'authToken',
		'refreshToken',
		'jwt',
		'secret',
	];
	sensitiveFields.forEach((field) => {
		if (field in sanitized) {
			sanitized[field] = '[REDACTED]';
		}
	});

	return sanitized;
};

export const analyticsMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.path === '/health' || req.path.startsWith('/api/analytics')) {
		return next();
	}

	const startTime = Date.now();
	const requestMethod = req.method;
	const requestPath = req.path;
	const endpoint = normalizeEndpoint(requestPath);
	const userAgent = req.get('user-agent') || 'unknown';
	const ipAddress =
		(req.headers['x-forwarded-for'] as string) ||
		req.connection.remoteAddress ||
		'unknown';

	const originalSend = res.send;
	const originalJson = res.json;
	const originalEnd = res.end;

	res.send = function (body?: any): Response {
		const responseTime = Date.now() - startTime;
		const statusCode = res.statusCode;
		const userId = req.user?.id;
		const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

		(async () => {
			try {
				await db.insert(requestLogs).values({
					userId: userId,
					method: requestMethod,
					path: requestPath,
					endpoint: endpoint,
					statusCode: statusCode,
					responseTime: responseTime,
					userAgent: userAgent,
					ipAddress: ipAddress,
					contentLength: body ? Buffer.from(String(body)).length : 0,
					query: JSON.stringify(req.query),
					body: JSON.stringify(sanitizeRequestBody(req.body)),
				});

				if (userId) {
					const existingUserAnalytics = await db
						.select()
						.from(userAnalytics)
						.where(
							and(
								eq(userAnalytics.userId, userId),
								eq(userAnalytics.date, today)
							)
						);

					if (existingUserAnalytics.length > 0) {
						const current = existingUserAnalytics[0];
						await db
							.update(userAnalytics)
							.set({
								totalRequests: current.totalRequests + 1,
								lastActivity: sql`CURRENT_TIMESTAMP`,
								avgResponseTime: Math.round(
									(current.avgResponseTime * current.totalRequests +
										responseTime) /
										(current.totalRequests + 1)
								),
							})
							.where(
								and(
									eq(userAnalytics.userId, userId),
									eq(userAnalytics.date, today)
								)
							);
					} else {
						await db.insert(userAnalytics).values({
							userId: userId,
							totalRequests: 1,
							avgResponseTime: responseTime,
							date: today,
						});
					}
				}

				const existingEndpointAnalytics = await db
					.select()
					.from(endpointAnalytics)
					.where(
						and(
							eq(endpointAnalytics.endpoint, endpoint),
							eq(endpointAnalytics.method, requestMethod),
							eq(endpointAnalytics.date, today)
						)
					);

				const isSuccess = statusCode >= 200 && statusCode < 400;

				if (existingEndpointAnalytics.length > 0) {
					const current = existingEndpointAnalytics[0];
					await db
						.update(endpointAnalytics)
						.set({
							totalRequests: current.totalRequests + 1,
							avgResponseTime: Math.round(
								(current.avgResponseTime * current.totalRequests +
									responseTime) /
									(current.totalRequests + 1)
							),
							minResponseTime: Math.min(
								current.minResponseTime || responseTime,
								responseTime
							),
							maxResponseTime: Math.max(
								current.maxResponseTime || responseTime,
								responseTime
							),
							successCount: current.successCount + (isSuccess ? 1 : 0),
							errorCount: current.errorCount + (isSuccess ? 0 : 1),
						})
						.where(
							and(
								eq(endpointAnalytics.endpoint, endpoint),
								eq(endpointAnalytics.method, requestMethod),
								eq(endpointAnalytics.date, today)
							)
						);
				} else {
					await db.insert(endpointAnalytics).values({
						endpoint: endpoint,
						method: requestMethod,
						totalRequests: 1,
						avgResponseTime: responseTime,
						minResponseTime: responseTime,
						maxResponseTime: responseTime,
						successCount: isSuccess ? 1 : 0,
						errorCount: isSuccess ? 0 : 1,
						date: today,
					});
				}
			} catch (error) {
				console.error('Error logging analytics:', error);
			}
		})();

		return originalSend.call(this, body);
	};

	res.json = function (body?: any): Response {
		return originalJson.call(this, body);
	};

	res.end = function (
		chunk?: any,
		encodingOrCallback?: BufferEncoding | (() => void),
		callback?: () => void
	): Response {
		if (typeof encodingOrCallback === 'function') {
			return originalEnd.call(this, chunk, 'utf8', encodingOrCallback);
		}
		return originalEnd.call(
			this,
			chunk,
			encodingOrCallback || 'utf8',
			callback
		);
	};

	next();
};
