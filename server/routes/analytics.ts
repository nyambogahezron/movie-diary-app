import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

// Super user role check middleware
const superUserCheck = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.user || req.user.role !== 'admin') {
		res
			.status(403)
			.json({ error: 'Access denied. Super user privileges required.' });
		return;
	}
	next();
};

// All analytics routes require authentication and super user privileges
router.use(authMiddleware, superUserCheck);

// Endpoint analytics
router.get('/endpoints', (req: Request, res: Response) => {
	analyticsController.getEndpointAnalytics(req, res);
});

router.get('/endpoints/:endpoint/:method', (req: Request, res: Response) => {
	analyticsController.getEndpointDetail(req, res);
});

// User analytics
router.get('/users', (req: Request, res: Response) => {
	analyticsController.getUserAnalytics(req, res);
});

router.get('/users/:userId', (req: Request, res: Response) => {
	analyticsController.getUserDetail(req, res);
});

// System analytics
router.get('/system', (req: Request, res: Response) => {
	analyticsController.getSystemAnalytics(req, res);
});

// Real-time analytics
router.get('/real-time', (req: Request, res: Response) => {
	analyticsController.getRealTimeAnalytics(req, res);
});

export default router;
