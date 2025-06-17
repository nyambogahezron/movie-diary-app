import express from 'express';
import { PostController } from '../controllers/PostController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
	validatePostCreate,
	validatePostUpdate,
	validatePostIdParam,
	validatePostComment,
	validateCommentUpdate,
	validateCommentIdParam,
	validatePostQuery,
} from '../utils/validations/post.validation';

const router = express.Router();

// Public routes (no authentication required)
router.get('/feed', validate(validatePostQuery), PostController.getFeed);
router.get('/:id', validate(validatePostIdParam), PostController.getPost);
router.get(
	'/:id/comments',
	validate(validatePostIdParam),
	PostController.getComments
);

// Protected routes (require authentication)
router.use(authMiddleware);

// Post CRUD operations
router.get('/', validate(validatePostQuery), PostController.getUserPosts);
router.post('/', validate(validatePostCreate), PostController.createPost);
router.put('/:id', validate(validatePostUpdate), PostController.updatePost);
router.delete('/:id', validate(validatePostIdParam), PostController.deletePost);

// Post like operations
router.post(
	'/:id/like',
	validate(validatePostIdParam),
	PostController.likePost
);
router.delete(
	'/:id/like',
	validate(validatePostIdParam),
	PostController.unlikePost
);

// Post comment operations
router.post(
	'/:id/comments',
	validate(validatePostComment),
	PostController.addComment
);
router.put(
	'/comments/:commentId',
	validate(validateCommentUpdate),
	PostController.updateComment
);
router.delete(
	'/comments/:commentId',
	validate(validateCommentIdParam),
	PostController.deleteComment
);

export default router;
