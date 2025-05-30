import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authValidation } from '../validations/auth.validation';

const router = express.Router();

router.post(
	'/register',
	validate(authValidation.register),
	AuthController.register
);
router.post('/login', validate(authValidation.login), AuthController.login);
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.post(
	'/refresh-token',
	validate(authValidation.refreshToken),
	AuthController.refreshToken
);

export default router;
