import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './db/schema.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'file:./db/database.sqlite3',
	},
} satisfies Config;
