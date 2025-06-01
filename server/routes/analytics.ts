import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

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

router.use(authMiddleware, superUserCheck);

router.get('/endpoints', analyticsController.getEndpointAnalytics);
router.get(
	'/endpoints/:endpoint/:method',
	analyticsController.getEndpointDetail
);
router.get('/users', analyticsController.getUserAnalytics);
router.get('/users/:userId', analyticsController.getUserDetail);
router.get('/system', analyticsController.getSystemAnalytics);
router.get('/real-time', analyticsController.getRealTimeAnalytics);

export default router;
