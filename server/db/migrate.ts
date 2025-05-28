import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Define the path to the migrations folder
const migrationsFolder = path.join(__dirname, 'migrations');
const metaFolder = path.join(migrationsFolder, 'meta');

// Ensure meta directory exists
if (!fs.existsSync(metaFolder)) {
	fs.mkdirSync(metaFolder, { recursive: true });
}

// Ensure _journal.json exists
const journalPath = path.join(metaFolder, '_journal.json');
if (!fs.existsSync(journalPath)) {
	fs.writeFileSync(
		journalPath,
		JSON.stringify({
			version: '5',
			entries: [],
		})
	);
}

async function runMigrations() {
	try {
		// Create a database connection
		const dbUrl = process.env.DATABASE_URL || 'file:./movie-diary.db';
		const client = createClient({ url: dbUrl });
		const db = drizzle(client, { schema });

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
