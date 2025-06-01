import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const migrationsFolder = path.join(__dirname, 'migrations');
const metaFolder = path.join(migrationsFolder, 'meta');

if (!fs.existsSync(metaFolder)) {
	fs.mkdirSync(metaFolder, { recursive: true });
}

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
		const dbUrl = process.env.DATABASE_URL || 'file:./db/database.sqlite3';
		const client = createClient({ url: dbUrl });
		const db = drizzle(client, { schema });

		console.log('Running migrations...');
		await migrate(db, { migrationsFolder });
		console.log('Migrations completed successfully!');

		await client.close();
	} catch (error) {
		console.error('Error running migrations:', error);
		process.exit(1);
	}
}

runMigrations();
