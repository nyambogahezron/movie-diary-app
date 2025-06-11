import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: process.env.PORT || 4000,
	nodeEnv: process.env.NODE_ENV || 'development',
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

	// JWT Configuration
	jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

	// SMTP Configuration
	smtp: {
		host: process.env.SMTP_HOST || 'smtp.example.com',
		port: parseInt(process.env.SMTP_PORT || '587', 10),
		secure: process.env.SMTP_SECURE === 'true',
		user: process.env.SMTP_USER || 'user@example.com',
		password: process.env.SMTP_PASSWORD || 'password',
		from: process.env.SMTP_FROM || 'noreply@example.com',
	},

	// Rate Limiting
	rateLimit: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		authWindowMs: 60 * 60 * 1000, // 1 hour
		authMax: 5, // limit auth endpoints to 5 requests per hour
	},

	// Security
	bcryptSaltRounds: 10,
	maxLoginAttempts: 5,
	accountLockoutDuration: 15 * 60 * 1000, // 15 minutes
	emailVerificationExpiresIn: '24h',
	passwordResetExpiresIn: '1h',

	// Database
	database: {
		url: process.env.DATABASE_URL || 'file:./dev.db',
	},
} as const;
