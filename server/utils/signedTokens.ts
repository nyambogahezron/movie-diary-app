import crypto from 'crypto';

class Token {
	private static RESET_TOKEN_SECRET =
		process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET!;

	static createSignedResetToken(userId: number): string {
		const tokenData = crypto.randomBytes(32).toString('hex');
		const timestamp = Date.now().toString();

		const payload = `${userId}.${tokenData}.${timestamp}`;
		const signature = crypto
			.createHmac('sha256', this.RESET_TOKEN_SECRET)
			.update(payload)
			.digest('hex');

		return `${payload}.${signature}`;
	}

	static createSignedToken(data: string): string {
		const tokenData = crypto.randomBytes(32).toString('hex');
		const timestamp = Date.now().toString();
		const payload = `${tokenData}.${timestamp}.${data}`;
		const signature = crypto
			.createHmac('sha256', this.RESET_TOKEN_SECRET)
			.update(payload)
			.digest('hex');

		return `${payload}.${signature}`;
	}

	static verifyResetToken(token: string): {
		isValid: boolean;
		userId?: number;
	} {
		try {
			const [userId, tokenData, timestamp, signature] = token.split('.');

			if (!userId || !tokenData || !timestamp || !signature) {
				return { isValid: false };
			}

			const payload = `${userId}.${tokenData}.${timestamp}`;
			const expectedSignature = crypto
				.createHmac('sha256', this.RESET_TOKEN_SECRET)
				.update(payload)
				.digest('hex');

			const isValid = crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expectedSignature)
			);

			return {
				isValid,
				userId: isValid ? parseInt(userId, 10) : undefined,
			};
		} catch (error) {
			return { isValid: false };
		}
	}

	static verifyTokenWithUserId(token: string, userId: number): boolean {
		try {
			const parts = token.split('.');
			if (parts.length === 4) {
				const [tokenUserId, tokenData, timestamp, signature] = parts;

				if (parseInt(tokenUserId, 10) !== userId) {
					return false;
				}

				const payload = `${userId}.${tokenData}.${timestamp}`;
				const expectedSignature = crypto
					.createHmac('sha256', this.RESET_TOKEN_SECRET)
					.update(payload)
					.digest('hex');

				return crypto.timingSafeEqual(
					Buffer.from(signature),
					Buffer.from(expectedSignature)
				);
			} else if (parts.length === 2) {
				const [payload, signature] = parts;

				const expectedSignature = crypto
					.createHmac('sha256', this.RESET_TOKEN_SECRET)
					.update(payload)
					.digest('hex');

				return crypto.timingSafeEqual(
					Buffer.from(signature),
					Buffer.from(expectedSignature)
				);
			}

			return false;
		} catch (error) {
			return false;
		}
	}

	static generateResetCode(): string {
		const buffer = crypto.randomBytes(4);
		// Convert to a number and ensure it's 6 digits
		const code = (parseInt(buffer.toString('hex'), 16) % 900000) + 100000;
		return code.toString();
	}

	static hashResetCode(code: string, userId: number): string {
		const timestamp = Date.now().toString();
		const dataToHash = `${userId}-${code}-${timestamp}`;
		const hash = crypto
			.createHmac('sha256', this.RESET_TOKEN_SECRET)
			.update(dataToHash)
			.digest('hex');

		// Store userId and timestamp with the hash for validation
		return `${userId}.${timestamp}.${hash}`;
	}

	static verifyResetCode(code: string, storedHash: string): boolean {
		try {
			const [userId, timestamp, hash] = storedHash.split('.');

			if (!userId || !timestamp || !hash) {
				return false;
			}

			const codeTime = parseInt(timestamp, 10);
			const currentTime = Date.now();
			if (currentTime - codeTime > 60 * 60 * 1000) {
				// 1 hour expiration
				return false;
			}

			const dataToHash = `${userId}-${code}-${timestamp}`;
			const expectedHash = crypto
				.createHmac('sha256', this.RESET_TOKEN_SECRET)
				.update(dataToHash)
				.digest('hex');

			return crypto.timingSafeEqual(
				Buffer.from(hash),
				Buffer.from(expectedHash)
			);
		} catch (error) {
			return false;
		}
	}
}

export default Token;
