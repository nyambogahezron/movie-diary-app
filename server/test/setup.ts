import { client, db } from './db/test-db';
import * as schema from './db/schema';
import { migrate } from 'drizzle-orm/libsql/migrator';

// Setup function to run before all tests
export async function setupTestDatabase() {
	try {
		// Apply migrations
		await migrate(db, { migrationsFolder: './db/migrations' });

		// You can add seed data here if needed
	} catch (error) {
		console.error('Error setting up test database:', error);
		throw error;
	}
}

// Teardown function to run after all tests
export async function teardownTestDatabase() {
	try {
		// Close database connection
		await client.close();
	} catch (error) {
		console.error('Error closing test database connection:', error);
	}
}
