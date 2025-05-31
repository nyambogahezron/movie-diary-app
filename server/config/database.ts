import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'file:./db/database.sqlite3';

const client = createClient({
	url: dbUrl,
});

export const db = drizzle(client, { schema });

export { schema };
