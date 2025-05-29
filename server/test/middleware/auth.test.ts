import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/auth';
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

	it('should call next() when valid token is provided', () => {
		mockReq = {
			headers: {
				authorization: `Bearer ${validToken}`,
			},
		};

		authenticate(mockReq as Request, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalled();
		expect(mockReq.userId).toBe(userId);
	});

	it('should return 401 when no token is provided', () => {
		mockReq = {
			headers: {},
		};

		authenticate(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({
			error: 'Authentication required',
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token format is invalid', () => {
		mockReq = {
			headers: {
				authorization: 'InvalidTokenFormat',
			},
		};

		authenticate(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({
			error: 'Invalid token format',
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token is invalid', () => {
		mockReq = {
			headers: {
				authorization: 'Bearer invalidtoken',
			},
		};

		authenticate(mockReq as Request, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
		expect(mockNext).not.toHaveBeenCalled();
	});
});
