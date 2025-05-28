import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Create a database connection
const dbUrl = process.env.DATABASE_URL || 'file:./movie-diary.db';

// Create SQLite client
const client = createClient({
	url: dbUrl,
});

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });

// Export schema for migrations
export { schema };
