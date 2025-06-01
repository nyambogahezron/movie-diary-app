import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import AsyncHandler from '../middleware/asyncHandler';

export class AnalyticsController {
	private analyticsService: AnalyticsService;

	constructor() {
		this.analyticsService = new AnalyticsService();
	}

	getEndpointAnalytics = AsyncHandler(async (req: Request, res: Response) => {
		const { startDate, endDate } = req.query;
		const endpoints = await this.analyticsService.getEndpointAnalytics(
			startDate as string,
			endDate as string
		);
		res.json(endpoints);
	});

	getEndpointDetail = AsyncHandler(async (req: Request, res: Response) => {
		const { endpoint, method } = req.params;
		const { startDate, endDate } = req.query;
		const details = await this.analyticsService.getEndpointDetail(
			endpoint,
			method,
			startDate as string,
			endDate as string
		);
		res.json(details);
	});

	getUserAnalytics = AsyncHandler(async (req: Request, res: Response) => {
		const { startDate, endDate, limit, offset } = req.query;
		const users = await this.analyticsService.getUserAnalytics(
			startDate as string,
			endDate as string,
			parseInt(limit as string) || 50,
			parseInt(offset as string) || 0
		);
		res.json(users);
	});

	getUserDetail = AsyncHandler(async (req: Request, res: Response) => {
		const { userId } = req.params;
		const { startDate, endDate } = req.query;
		const details = await this.analyticsService.getUserDetail(
			parseInt(userId),
			startDate as string,
			endDate as string
		);
		res.json(details);
	});

	getSystemAnalytics = AsyncHandler(async (req: Request, res: Response) => {
		const { startDate, endDate } = req.query;
		const systemStats = await this.analyticsService.getSystemAnalytics(
			startDate as string,
			endDate as string
		);
		res.json(systemStats);
	});

	getRealTimeAnalytics = AsyncHandler(async (req: Request, res: Response) => {
		const realTimeData = await this.analyticsService.getRealTimeAnalytics();
		res.json(realTimeData);
	});
}
