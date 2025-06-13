import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import {
	createTestUser,
	createTestPost,
	createTestPostComment,
} from '../utils';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { PostService } from '../../services/PostService';
import { PostLikeService } from '../../services/PostLikeService';
import { PostCommentService } from '../../services/PostCommentService';

// Load user service mock
import '../__mocks__/userService';

describe('PostController - GraphQL', () => {
	let server: ApolloServer;
	let authToken: string;
	let userId: number;
	let postService: PostService;
	let postLikeService: PostLikeService;
	let postCommentService: PostCommentService;
	let testPost: any;

	beforeAll(async () => {
		await setupTestDatabase();

		// Create test user
		const { user, token } = await createTestUser();
		authToken = token;
		userId = user.id;

		// Create services
		postService = new PostService();
		postLikeService = new PostLikeService();
		postCommentService = new PostCommentService();

		// Create Apollo Server for testing
		server = new ApolloServer({
			typeDefs,
			resolvers,
		});

		await server.start();
	});

	afterAll(async () => {
		await server.stop();
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear posts, post likes, post comments before each test
		await db.delete(schema.postComments);
		await db.delete(schema.postLikes);
		await db.delete(schema.posts);

		// Create test post
		testPost = await createTestPost({
			userId,
			title: 'Test Post',
			content: 'This is a test post content',
		});
	});

	describe('Mutation: createPost', () => {
		it('should create a new post', async () => {
			const postData = {
				input: {
					title: 'New Post',
					content: 'This is a new post content',
				},
			};

			const mutation = `
        mutation CreatePost($input: PostInput!) {
          createPost(input: $input) {
            id
            userId
            title
            content
            createdAt
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: postData,
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.createPost).toHaveProperty('id');
			expect(response.body.data?.createPost.title).toBe(postData.input.title);
			expect(response.body.data?.createPost.content).toBe(
				postData.input.content
			);
			expect(response.body.data?.createPost.userId).toBe(userId);

			// Check database
			const posts = await db.select().from(schema.posts);
			expect(posts.length).toBe(2); // The test post + the new one
			expect(posts.find((p) => p.title === postData.input.title)).toBeDefined();
		});

		it('should return error if not authenticated', async () => {
			const postData = {
				input: {
					title: 'New Post',
					content: 'This is a new post content',
				},
			};

			const mutation = `
        mutation CreatePost($input: PostInput!) {
          createPost(input: $input) {
            id
            title
          }
        }
      `;

			// Context without user
			const context = {
				postService,
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: postData,
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors?.[0].message).toContain('Not authenticated');
		});
	});

	describe('Mutation: updatePost', () => {
		it('should update an existing post', async () => {
			const updateData = {
				id: testPost.id,
				input: {
					title: 'Updated Post',
					content: 'Updated content for the post',
				},
			};

			const mutation = `
        mutation UpdatePost($id: ID!, $input: PostUpdateInput!) {
          updatePost(id: $id, input: $input) {
            id
            userId
            title
            content
            updatedAt
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: updateData,
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.updatePost).toHaveProperty('id');
			expect(response.body.data?.updatePost.id).toBe(testPost.id);
			expect(response.body.data?.updatePost.title).toBe(updateData.input.title);
			expect(response.body.data?.updatePost.content).toBe(
				updateData.input.content
			);

			// Check database
			const posts = await db.select().from(schema.posts);
			const updatedPost = posts.find((p) => p.id === testPost.id);
			expect(updatedPost?.title).toBe(updateData.input.title);
			expect(updatedPost?.content).toBe(updateData.input.content);
		});

		it('should not allow updating a post by another user', async () => {
			const updateData = {
				id: testPost.id,
				input: {
					title: 'Updated Post',
					content: 'Updated content for the post',
				},
			};

			const mutation = `
        mutation UpdatePost($id: ID!, $input: PostUpdateInput!) {
          updatePost(id: $id, input: $input) {
            id
          }
        }
      `;

			// Context with different user
			const context = {
				user: {
					id: userId + 1, // Different user ID
					email: 'other@example.com',
					username: 'otheruser',
				},
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId + 1, username: 'otheruser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: updateData,
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors?.[0].message).toContain('Not authorized');
		});
	});

	describe('Mutation: deletePost', () => {
		it('should delete a post', async () => {
			const mutation = `
        mutation DeletePost($id: ID!) {
          deletePost(id: $id)
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: { id: testPost.id },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.deletePost).toBe(true);

			// Check database
			const posts = await db.select().from(schema.posts);
			expect(posts.length).toBe(0);
		});
	});

	describe('Mutation: likePost', () => {
		it('should like a post', async () => {
			const mutation = `
        mutation LikePost($postId: ID!) {
          likePost(postId: $postId) {
            id
            userId
            postId
            createdAt
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				postLikeService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: { postId: testPost.id },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.likePost).toHaveProperty('id');
			expect(response.body.data?.likePost.userId).toBe(userId);
			expect(response.body.data?.likePost.postId).toBe(testPost.id);

			// Check database
			const likes = await db.select().from(schema.postLikes);
			expect(likes.length).toBe(1);
			expect(likes[0].postId).toBe(testPost.id);
			expect(likes[0].userId).toBe(userId);
		});
	});

	describe('Mutation: unlikePost', () => {
		it('should unlike a post', async () => {
			// First like the post
			await db.insert(schema.postLikes).values({
				userId,
				postId: testPost.id,
			});

			const mutation = `
        mutation UnlikePost($postId: ID!) {
          unlikePost(postId: $postId)
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				postLikeService,
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: { postId: testPost.id },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.unlikePost).toBe(true);

			// Check database
			const likes = await db.select().from(schema.postLikes);
			expect(likes.length).toBe(0);
		});
	});

	describe('Mutation: createPostComment', () => {
		it('should create a comment on a post', async () => {
			const commentData = {
				input: {
					postId: testPost.id,
					content: 'This is a test comment',
				},
			};

			const mutation = `
        mutation CreatePostComment($input: PostCommentInput!) {
          createPostComment(input: $input) {
            id
            userId
            postId
            content
            createdAt
          }
        }
      `;

			// Mock context with authenticated user
			const context = {
				user: {
					id: userId,
					email: 'test@example.com',
					username: 'testuser',
				},
				postService,
				postCommentService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query: mutation,
					variables: commentData,
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.createPostComment).toHaveProperty('id');
			expect(response.body.data?.createPostComment.userId).toBe(userId);
			expect(response.body.data?.createPostComment.postId).toBe(testPost.id);
			expect(response.body.data?.createPostComment.content).toBe(
				commentData.input.content
			);

			// Check database
			const comments = await db.select().from(schema.postComments);
			expect(comments.length).toBe(1);
			expect(comments[0].postId).toBe(testPost.id);
			expect(comments[0].content).toBe(commentData.input.content);
		});
	});

	describe('Query: post', () => {
		it('should get a post by id', async () => {
			const query = `
        query GetPost($id: ID!) {
          post(id: $id) {
            id
            userId
            title
            content
            createdAt
            user {
              id
              username
            }
          }
        }
      `;

			// Add services to context
			const context = {
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: { id: testPost.id },
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.post).toHaveProperty('id');
			expect(response.body.data?.post.id).toBe(testPost.id);
			expect(response.body.data?.post.title).toBe(testPost.title);
			expect(response.body.data?.post.content).toBe(testPost.content);
			expect(response.body.data?.post.user).toHaveProperty('id');
			expect(response.body.data?.post.user.id).toBe(userId);
			expect(response.body.data?.post.user.username).toBe('testuser');
		});
	});

	describe('Query: posts', () => {
		it('should get posts with pagination', async () => {
			// Create additional posts
			await createTestPost({
				userId,
				title: 'Second Post',
				content: 'Content for second post',
			});

			await createTestPost({
				userId,
				title: 'Third Post',
				content: 'Content for third post',
			});

			const query = `
        query GetPosts($limit: Int, $offset: Int) {
          posts(limit: $limit, offset: $offset) {
            id
            title
            content
            createdAt
          }
        }
      `;

			// Add services to context
			const context = {
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: {
						limit: 2,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.posts).toBeInstanceOf(Array);
			expect(response.body.data?.posts.length).toBe(2); // Limited to 2 posts

			// Get the next page
			const secondPageResponse = await server.executeOperation(
				{
					query,
					variables: {
						limit: 2,
						offset: 2,
					},
				},
				{ contextValue: context }
			);

			expect(secondPageResponse.body.errors).toBeUndefined();
			expect(secondPageResponse.body.data?.posts).toBeInstanceOf(Array);
			expect(secondPageResponse.body.data?.posts.length).toBe(1); // Only 1 post left
		});

		it('should get posts by user', async () => {
			// Create a second user with their own posts
			const otherUserId = userId + 1;
			await createTestUser({ id: otherUserId, username: 'otheruser' });

			// Create posts for the other user
			await createTestPost({
				userId: otherUserId,
				title: 'Other User Post',
				content: 'Content from other user',
			});

			const query = `
        query GetPosts($userId: ID, $limit: Int, $offset: Int) {
          posts(userId: $userId, limit: $limit, offset: $offset) {
            id
            userId
            title
            content
          }
        }
      `;

			// Add services to context
			const context = {
				postService,
				userService: {
					findById: jest.fn().mockImplementation((id) =>
						Promise.resolve({
							id,
							username: id === userId ? 'testuser' : 'otheruser',
						})
					),
				},
			};

			// Get posts for the other user
			const response = await server.executeOperation(
				{
					query,
					variables: {
						userId: otherUserId,
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.posts).toBeInstanceOf(Array);
			expect(response.body.data?.posts.length).toBe(1);
			expect(response.body.data?.posts[0].userId).toBe(otherUserId);
			expect(response.body.data?.posts[0].title).toBe('Other User Post');
		});
	});

	describe('Query: userPosts', () => {
		it('should get posts for a specific user', async () => {
			// Create additional posts for the user
			await createTestPost({
				userId,
				title: 'Second Post',
				content: 'Content for second post',
			});

			const query = `
        query GetUserPosts($userId: ID!, $limit: Int, $offset: Int) {
          userPosts(userId: $userId, limit: $limit, offset: $offset) {
            id
            userId
            title
            content
          }
        }
      `;

			// Add services to context
			const context = {
				postService,
				userService: {
					findById: jest
						.fn()
						.mockResolvedValue({ id: userId, username: 'testuser' }),
				},
			};

			const response = await server.executeOperation(
				{
					query,
					variables: {
						userId,
						limit: 10,
						offset: 0,
					},
				},
				{ contextValue: context }
			);

			expect(response.body.errors).toBeUndefined();
			expect(response.body.data?.userPosts).toBeInstanceOf(Array);
			expect(response.body.data?.userPosts.length).toBe(2); // Should return both posts
			expect(
				response.body.data?.userPosts.every((p) => p.userId === userId)
			).toBe(true);
		});
	});
});
