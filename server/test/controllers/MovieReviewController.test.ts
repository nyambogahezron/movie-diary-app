import request from 'supertest';
import app from '../test-app';
import { db } from '../../db';
import { createTestUser, createTestMovie, authenticateUser } from '../utils';

// Clean up database before each test
beforeEach(async () => {
	await db.run('DELETE FROM movie_reviews');
	await db.run('DELETE FROM movies');
	await db.run('DELETE FROM users');
});

describe('MovieReviewController', () => {
	describe('POST /:movieId/reviews', () => {
		test('should create a new review for a movie', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
				isPublic: true,
			};

			const response = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			expect(response.status).toBe(201);
			expect(response.body.message).toBe('Review added successfully');
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.content).toBe(reviewData.content);
			expect(response.body.data.rating).toBe(reviewData.rating);
			expect(response.body.data.isPublic).toBe(reviewData.isPublic);
		});

		test('should return 400 if content is missing', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Try to create a review without content
			const response = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({ rating: 8 });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Review content is required');
		});

		test('should return 409 if user already reviewed the movie', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			// Create first review
			await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			// Try to create another review for the same movie
			const response = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			expect(response.status).toBe(409);
			expect(response.body.error).toBe('You have already reviewed this movie');
		});
	});

	describe('GET /:movieId/reviews', () => {
		test('should get all reviews for a movie', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			// Get all reviews for the movie
			const response = await request(app)
				.get(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Reviews retrieved successfully');
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBe(1);
			expect(response.body.data[0].content).toBe(reviewData.content);
			expect(response.body.data[0].rating).toBe(reviewData.rating);
		});
	});

	describe('GET /api/reviews/:id', () => {
		test('should get a review by ID', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			// Get the review by ID
			const response = await request(app)
				.get(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Review retrieved successfully');
			expect(response.body.data.id).toBe(reviewId);
			expect(response.body.data.content).toBe(reviewData.content);
			expect(response.body.data.rating).toBe(reviewData.rating);
		});

		test('should return 404 if review not found', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Try to get a non-existent review
			const response = await request(app)
				.get('/api/reviews/999')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body.error).toBe('Review not found');
		});
	});

	describe('PUT /api/reviews/:id', () => {
		test('should update a review', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			// Update the review
			const updateData = {
				content: 'Updated review content',
				rating: 9,
			};

			const response = await request(app)
				.put(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Review updated successfully');
			expect(response.body.data.content).toBe(updateData.content);
			expect(response.body.data.rating).toBe(updateData.rating);
		});

		test('should return 403 if user is not the owner of the review', async () => {
			// Create two test users
			const user1 = await createTestUser();
			const user2 = await createTestUser('user2', 'user2@example.com');

			const token1 = await authenticateUser(user1.email);
			const token2 = await authenticateUser(user2.email);

			// Create a test movie
			const movie = await createTestMovie(user1.id);

			// User 1 creates a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token1}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			// User 2 tries to update User 1's review
			const updateData = {
				content: 'Updated by another user',
			};

			const response = await request(app)
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
		test('should delete a review', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create a test movie
			const movie = await createTestMovie(user.id);

			// Create a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			// Delete the review
			const response = await request(app)
				.delete(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Review deleted successfully');

			// Try to get the deleted review
			const getResponse = await request(app)
				.get(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(getResponse.status).toBe(404);
		});

		test('should return 403 if user is not the owner of the review', async () => {
			// Create two test users
			const user1 = await createTestUser();
			const user2 = await createTestUser('user2', 'user2@example.com');

			const token1 = await authenticateUser(user1.email);
			const token2 = await authenticateUser(user2.email);

			// Create a test movie
			const movie = await createTestMovie(user1.id);

			// User 1 creates a review
			const reviewData = {
				content: 'This is a great movie!',
				rating: 8,
			};

			const createResponse = await request(app)
				.post(`/api/movies/${movie.id}/reviews`)
				.set('Authorization', `Bearer ${token1}`)
				.send(reviewData);

			const reviewId = createResponse.body.data.id;

			// User 2 tries to delete User 1's review
			const response = await request(app)
				.delete(`/api/reviews/${reviewId}`)
				.set('Authorization', `Bearer ${token2}`);

			expect(response.status).toBe(403);
			expect(response.body.error).toBe(
				'You do not have permission to delete this review'
			);
		});
	});

	describe('GET /api/reviews', () => {
		test('should get all reviews by the current user', async () => {
			// Create test user and authenticate
			const user = await createTestUser();
			const token = await authenticateUser(user.email);

			// Create two test movies
			const movie1 = await createTestMovie(user.id);
			const movie2 = await createTestMovie(user.id, 'Another Movie');

			// Create reviews for both movies
			await request(app)
				.post(`/api/movies/${movie1.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					content: 'Review for movie 1',
					rating: 8,
				});

			await request(app)
				.post(`/api/movies/${movie2.id}/reviews`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					content: 'Review for movie 2',
					rating: 7,
				});

			// Get all reviews by the user
			const response = await request(app)
				.get('/api/reviews')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('User reviews retrieved successfully');
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data.length).toBe(2);
		});
	});
});
