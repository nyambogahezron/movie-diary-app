import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Define the path to the migrations folder
const migrationsFolder = path.join(__dirname, 'migrations');

async function runMigrations() {
	try {
		// Create a database connection
		const dbUrl = process.env.DATABASE_URL || 'file:./movie-diary.db';
		const client = createClient({ url: dbUrl });
		const db = drizzle(client);

		// Run the migrations
		console.log('Running migrations...');
		await migrate(db, { migrationsFolder });
		console.log('Migrations completed successfully!');

		// Close the database connection
		await client.close();
	} catch (error) {
		console.error('Error running migrations:', error);
		process.exit(1);
	}
}

// Run the migrations
runMigrations();
