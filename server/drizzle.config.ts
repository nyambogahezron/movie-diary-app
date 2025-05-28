import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './db/schema.ts',
	out: './db/migrations',
	driver: 'd1-http',
	dialect: 'sqlite',
	dbCredentials: {
		accountId: process.env.D1_ACCOUNT_ID || '',
		databaseId: process.env.D1_DATABASE_ID || '',
		token: process.env.D1_TOKEN || '',
	},
} satisfies Config;
