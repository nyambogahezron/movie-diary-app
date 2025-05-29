import { WatchlistService } from '../../services/WatchlistService';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { createTestUser } from '../utils';
import { eq } from 'drizzle-orm';

describe('WatchlistService', () => {
	let userId: number;

	beforeAll(async () => {
		await setupTestDatabase();
		// Create a test user
		const { user } = await createTestUser();
		userId = user.id;
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear watchlists before each test
		await db.delete(schema.watchlists);
	});

	describe('createWatchlist', () => {
		it('should create a new watchlist and return it', async () => {
			const watchlistData = {
				name: 'My Watchlist',
				description: 'Test description',
				isPublic: true,
			};

			const result = await WatchlistService.createWatchlist({
				...watchlistData,
				userId,
			});

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('name', watchlistData.name);
			expect(result).toHaveProperty('description', watchlistData.description);
			expect(result).toHaveProperty('isPublic', watchlistData.isPublic);

			// Check database
			const watchlists = await db.select().from(schema.watchlists);
			expect(watchlists.length).toBe(1);
			expect(watchlists[0].name).toBe(watchlistData.name);
			expect(watchlists[0].userId).toBe(userId);
		});
	});

	describe('getWatchlistsByUserId', () => {
		beforeEach(async () => {
			// Create test watchlists
			await db.insert(schema.watchlists).values([
				{
					name: 'Watchlist 1',
					description: 'Test 1',
					isPublic: false,
					userId,
				},
				{
					name: 'Watchlist 2',
					description: 'Test 2',
					isPublic: true,
					userId,
				},
				{
					name: 'Watchlist 3',
					description: 'Test 3',
					isPublic: false,
					userId: 999, // Different user
				},
			]);
		});

		it('should return only watchlists for the specified user', async () => {
			const watchlists = await WatchlistService.getWatchlistsByUserId(userId);

			expect(watchlists).toBeInstanceOf(Array);
			expect(watchlists.length).toBe(2);
			expect(watchlists[0]).toHaveProperty('name');
			expect(watchlists.map((w) => w.name)).toContain('Watchlist 1');
			expect(watchlists.map((w) => w.name)).toContain('Watchlist 2');
			expect(watchlists.map((w) => w.name)).not.toContain('Watchlist 3');
		});
	});

	describe('getWatchlistById', () => {
		let watchlistId: number;

		beforeEach(async () => {
			// Create a test watchlist
			const result = await db
				.insert(schema.watchlists)
				.values({
					name: 'Get By ID Watchlist',
					description: 'Test description',
					isPublic: false,
					userId,
				})
				.returning();

			watchlistId = result[0].id;
		});

		it('should return watchlist when valid ID is provided', async () => {
			const watchlist = await WatchlistService.getWatchlistById(watchlistId);

			expect(watchlist).toHaveProperty('id', watchlistId);
			expect(watchlist).toHaveProperty('name', 'Get By ID Watchlist');
		});

		it('should return null when watchlist does not exist', async () => {
			const watchlist = await WatchlistService.getWatchlistById(9999);
			expect(watchlist).toBeNull();
		});
	});

	describe('updateWatchlist', () => {
		let watchlistId: number;

		beforeEach(async () => {
			// Create a test watchlist
			const result = await db
				.insert(schema.watchlists)
				.values({
					name: 'Original Name',
					description: 'Original description',
					isPublic: false,
					userId,
				})
				.returning();

			watchlistId = result[0].id;
		});

		it('should update watchlist and return updated data', async () => {
			const updateData = {
				name: 'Updated Name',
				description: 'Updated description',
				isPublic: true,
			};

			const result = await WatchlistService.updateWatchlist(
				watchlistId,
				updateData
			);

			expect(result).toHaveProperty('id', watchlistId);
			expect(result).toHaveProperty('name', updateData.name);
			expect(result).toHaveProperty('description', updateData.description);
			expect(result).toHaveProperty('isPublic', updateData.isPublic);

			// Check database
			const watchlists = await db
				.select()
				.from(schema.watchlists)
				.where(eq(schema.watchlists.id, watchlistId));

			expect(watchlists[0].name).toBe(updateData.name);
			expect(watchlists[0].isPublic).toBe(updateData.isPublic);
		});

		it('should return null when watchlist does not exist', async () => {
			const result = await WatchlistService.updateWatchlist(9999, {
				name: 'Updated Name',
			});
			expect(result).toBeNull();
		});
	});

	describe('deleteWatchlist', () => {
		let watchlistId: number;

		beforeEach(async () => {
			// Create a test watchlist
			const result = await db
				.insert(schema.watchlists)
				.values({
					name: 'Delete Me',
					description: 'To be deleted',
					isPublic: false,
					userId,
				})
				.returning();

			watchlistId = result[0].id;
		});

		it('should delete watchlist and return success', async () => {
			const success = await WatchlistService.deleteWatchlist(watchlistId);

			expect(success).toBe(true);

			// Check database
			const watchlists = await db
				.select()
				.from(schema.watchlists)
				.where(eq(schema.watchlists.id, watchlistId));

			expect(watchlists.length).toBe(0);
		});

		it('should return false when watchlist does not exist', async () => {
			const success = await WatchlistService.deleteWatchlist(9999);
			expect(success).toBe(false);
		});
	});
});
