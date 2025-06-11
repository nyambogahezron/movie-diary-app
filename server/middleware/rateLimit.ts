import rateLimit from 'express-rate-limit';
import { config } from '../config';

// General rate limiter for all routes
export const generalRateLimiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max,
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
export const authRateLimiter = rateLimit({
	windowMs: config.rateLimit.authWindowMs,
	max: config.rateLimit.authMax,
	message: 'Too many authentication attempts, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for password reset requests
export const passwordResetRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3, // 3 attempts per hour
	message: 'Too many password reset attempts, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

// Rate limiter for email verification requests
export const emailVerificationRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3, // 3 attempts per hour
	message: 'Too many email verification attempts, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});
