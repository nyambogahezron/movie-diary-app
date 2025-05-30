import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try to load environment-specific .env file first
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
if (fs.existsSync(path.join(process.cwd(), envFile))) {
	dotenv.config({ path: envFile });
} else {
	// Fall back to default .env file
	dotenv.config();
}

// Configuration object
export const config = {
	// Server settings
	server: {
		port: process.env.PORT || 5000,
		nodeEnv: process.env.NODE_ENV || 'development',
		isProduction: process.env.NODE_ENV === 'production',
	},

	// Security settings
	security: {
		jwtSecret: process.env.JWT_SECRET || getSecretKey('jwt'),
		jwtRefreshSecret:
			process.env.JWT_REFRESH_SECRET || getSecretKey('jwtRefresh'),
		cookieSecret: process.env.COOKIE_SECRET || getSecretKey('cookie'),
		accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
		refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
		cors: {
			origin: process.env.CLIENT_URL || 'http://localhost:3000',
			credentials: true,
		},
	},

	// Database settings
	database: {
		url: process.env.DATABASE_URL || '',
	},

	// Rate limit settings
	rateLimit: {
		windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
		maxRequestsPerWindow: Number(process.env.RATE_LIMIT_MAX) || 100,
	},
};

// Generate a secure key if one doesn't exist
function getSecretKey(name: string): string {
	const crypto = require('crypto');
	console.warn(
		`WARNING: ${name.toUpperCase()}_SECRET not provided in environment variables. Using auto-generated key.`
	);
	return crypto.randomBytes(64).toString('hex');
}

// Validate essential configurations
function validateConfig() {
	const requiredConfigs: Record<string, string | undefined> = {
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
		COOKIE_SECRET: process.env.COOKIE_SECRET,
	};

	if (process.env.NODE_ENV === 'production') {
		for (const [key, value] of Object.entries(requiredConfigs)) {
			if (!value) {
				console.warn(`WARNING: ${key} is not set in production environment.`);
			}
		}
	}
}

validateConfig();
