import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../middleware/auth';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import { createTestUser } from '../utils';

// Mock Express objects
const mockResponse = () => {
	const res = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

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
			headers: {
				authorization: `Bearer ${validToken}`,
			},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalled();
		expect(mockReq.user?.id).toBe(userId);
	});

	it('should return 401 when no token is provided', async () => {
		mockReq = {
			headers: {},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({
			error: 'No authentication token provided',
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token format is invalid', async () => {
		mockReq = {
			headers: {
				authorization: 'InvalidTokenFormat',
			},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({
			error: 'Invalid authentication token format',
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token is invalid', async () => {
		mockReq = {
			headers: {
				authorization: 'Bearer invalidtoken',
			},
		};

		await authMiddleware(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveProperty('error');
		expect(mockNext).not.toHaveBeenCalled();
	});
});
