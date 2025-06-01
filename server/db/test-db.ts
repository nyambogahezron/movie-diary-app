import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
	url: 'file::memory:',
});

export const db = drizzle(client);

export { client };
