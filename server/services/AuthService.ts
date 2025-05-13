import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser, AuthPayload, JwtPayload } from '../types';
import { AuthenticationError } from '../utils/errors';

export class AuthService {
	private static readonly JWT_SECRET =
		process.env.JWT_SECRET || 'your-super-secret-jwt-key';

	static async register(
		username: string,
		email: string,
		password: string
	): Promise<AuthPayload> {
		// Check if user already exists
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			throw new AuthenticationError('User already exists');
		}

		// Create new user
		const user = new User({ username, email, password });
		await user.save();

		// Generate token
		const token = this.generateToken(user);

		return { token, user };
	}

	static async login(email: string, password: string): Promise<AuthPayload> {
		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			throw new AuthenticationError('Invalid credentials');
		}

		// Check password
		const isValid = await user.comparePassword(password);
		if (!isValid) {
			throw new AuthenticationError('Invalid credentials');
		}

		// Generate token
		const token = this.generateToken(user);

		return { token, user };
	}

	static async verifyToken(token: string): Promise<IUser> {
		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
			const user = await User.findById(decoded.userId);

			if (!user) {
				throw new AuthenticationError('User not found');
			}

			return user;
		} catch (error) {
			throw new AuthenticationError('Invalid token');
		}
	}

	private static generateToken(user: IUser): string {
		return jwt.sign({ userId: user._id }, this.JWT_SECRET, { expiresIn: '7d' });
	}
}
