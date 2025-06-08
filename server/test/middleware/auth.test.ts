import { Request, Response, NextFunction } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth';
import { createTestUser } from '../utils';
import { mockResponse } from '../test-utils';

describe('Authentication Middleware', () => {
	let userId: number;
	let validToken: string;
	let mockReq: Partial<Request>;
	let mockRes: Response;
	let mockNext: NextFunction;

	beforeAll(async () => {
		// Create a test user
		const { user, token } = await createTestUser();
		userId = user.id;
		validToken = token;
	});

	beforeEach(() => {
		mockReq = {};
		mockRes = mockResponse();
		mockNext = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call next() when valid token is provided', async () => {
		mockReq = {
			cookies: {
				accessToken: validToken,
			},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalled();
		expect(mockReq.user?.id).toBe(userId);
	});

	it('should return 401 when no token is provided', async () => {
		mockReq = {
			cookies: {},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({
			error: 'No authentication token provided',
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token is invalid', async () => {
		mockReq = {
			cookies: {
				accessToken: 'invalidtoken',
			},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveProperty('error');
		expect(mockNext).not.toHaveBeenCalled();
	});

	describe('Optional Auth Middleware', () => {
		it('should set user when valid token is provided', async () => {
			mockReq = {
				cookies: {
					accessToken: validToken,
				},
			};

			await optionalAuthMiddleware(mockReq as Request, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockReq.user?.id).toBe(userId);
		});

		it('should not set user when no token is provided', async () => {
			mockReq = {
				cookies: {},
			};

			await optionalAuthMiddleware(mockReq as Request, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockReq.user).toBeUndefined();
		});

		it('should not set user when token is invalid', async () => {
			mockReq = {
				cookies: {
					accessToken: 'invalidtoken',
				},
			};

			await optionalAuthMiddleware(mockReq as Request, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockReq.user).toBeUndefined();
		});
	});
});
