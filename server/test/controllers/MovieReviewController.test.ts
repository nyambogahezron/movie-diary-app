import supertest from 'supertest';
import { createTestApp } from '../test-app';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser, createTestMovie } from '../utils';
import { sql } from 'drizzle-orm';

const app = createTestApp();
const testRequest = supertest(app);

// Clean up database before each test
beforeEach(async () => {
	await db.delete(schema.movieReviews);
	await db.delete(schema.movies);
	await db.delete(schema.users);
});

describe('MovieReviewController', () => {
	describe('POST /api/movies/:id/reviews', () => {
		it('should create a new review', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'Great movie!',
				rating: 5,
			};

			const response = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			expect(response.status).toBe(201);
			expect(response.body.message).toBe('Review created successfully');
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.content).toBe(reviewData.content);
			expect(response.body.data.rating).toBe(reviewData.rating);
			expect(response.body.data.userId).toBe(user.id);
			expect(response.body.data.movieId).toBe(movie.id);
		});

		it('should return 400 if content is missing', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const response = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({ rating: 8 });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Review content is required');
		});

		it('should return 400 if user already reviewed the movie', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'First review',
				rating: 8,
			};

			// Create first review
			await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			// Try to create another review for the same movie
			const response = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					content: 'Second review attempt',
					rating: 7,
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('You have already reviewed this movie');
		});
	});

	describe('GET /api/movies/:id/reviews', () => {
		it('should get all reviews for a movie', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'Test review',
				rating: 8,
			};

			await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const response = await testRequest
				.get(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBe(1);
			expect(response.body.data[0].content).toBe(reviewData.content);
			expect(response.body.data[0].rating).toBe(reviewData.rating);
		});
	});

	describe('GET /api/reviews/:id', () => {
		it('should get a review by id', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'Test review',
				rating: 8,
			};

			const createResponse = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			const response = await testRequest
				.get(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty('id', reviewId);
			expect(response.body.data.content).toBe(reviewData.content);
			expect(response.body.data.rating).toBe(reviewData.rating);
		});

		it('should return 404 if review not found', async () => {
			const { token } = await createTestUser();

			const response = await testRequest
				.get('/api/reviews/999')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body.error).toBe('Review not found');
		});
	});

	describe('PUT /api/reviews/:id', () => {
		it('should update a review', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'Original review',
				rating: 8,
			};

			const createResponse = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			const updateData = {
				content: 'Updated review',
				rating: 9,
			};

			const response = await testRequest
				.put(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.data.content).toBe(updateData.content);
			expect(response.body.data.rating).toBe(updateData.rating);
		});

		it('should return 403 if user is not the owner of the review', async () => {
			const { user: user1, token: token1 } = await createTestUser();
			const { user: user2, token: token2 } = await createTestUser({
				username: 'user2',
				email: 'user2@example.com',
			});

			const movie = await createTestMovie({}, user1.id);

			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token1}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			const updateData = {
				content: 'Updated by another user',
			};

			const response = await testRequest
				.put(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token2}`)
				.send(updateData);

			expect(response.status).toBe(403);
			expect(response.body.error).toBe(
				'You do not have permission to update this review'
			);
		});
	});

	describe('DELETE /api/reviews/:id', () => {
		it('should delete a review', async () => {
			const { user, token } = await createTestUser();
			const movie = await createTestMovie({}, user.id);

			const reviewData = {
				content: 'Test review',
				rating: 8,
			};

			const createResponse = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			const response = await testRequest
				.delete(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Review deleted successfully');

			// Try to get the deleted review
			const getResponse = await testRequest
				.get(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(getResponse.status).toBe(404);
		});

		it('should return 403 if user is not the owner of the review', async () => {
			const { user: user1, token: token1 } = await createTestUser();
			const { user: user2, token: token2 } = await createTestUser({
				username: 'user2',
				email: 'user2@example.com',
			});

			const movie = await createTestMovie({}, user1.id);

			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await testRequest
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token1}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			const response = await testRequest
				.delete(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token2}`);

			expect(response.status).toBe(403);
			expect(response.body.error).toBe(
				'You do not have permission to delete this review'
			);
		});
	});

	describe('GET /api/reviews', () => {
		it('should get all reviews by the current user', async () => {
			const { user, token } = await createTestUser();
			const movie1 = await createTestMovie({}, user.id);
			const movie2 = await createTestMovie({ title: 'Another Movie' }, user.id);

			// Create reviews for both movies
			await testRequest
				.post(`/api/movies/${movie1.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					content: 'Review for movie 1',
					rating: 8,
				});

			await testRequest
				.post(`/api/movies/${movie2.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					content: 'Review for movie 2',
					rating: 7,
				});

			// Get all reviews by the user
			const response = await testRequest
				.get('/api/reviews')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User reviews retrieved successfully');
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBe(2);
		});
	});
});
