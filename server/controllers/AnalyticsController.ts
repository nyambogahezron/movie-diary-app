import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
	private analyticsService: AnalyticsService;

	constructor() {
		this.analyticsService = new AnalyticsService();
	}

	/**
	 * Get summary of endpoint analytics
	 */
	async getEndpointAnalytics(req: Request, res: Response) {
		try {
			const { startDate, endDate } = req.query;
			const endpoints = await this.analyticsService.getEndpointAnalytics(
				startDate as string,
				endDate as string
			);
			return res.json(endpoints);
		} catch (error) {
			console.error('Error fetching endpoint analytics:', error);
			return res
				.status(500)
				.json({ error: 'Failed to fetch endpoint analytics' });
		}
	}

	/**
	 * Get detailed analytics for a specific endpoint
	 */
	async getEndpointDetail(req: Request, res: Response) {
		try {
			const { endpoint, method } = req.params;
			const { startDate, endDate } = req.query;
			const details = await this.analyticsService.getEndpointDetail(
				endpoint,
				method,
				startDate as string,
				endDate as string
			);
			return res.json(details);
		} catch (error) {
			console.error('Error fetching endpoint details:', error);
			return res
				.status(500)
				.json({ error: 'Failed to fetch endpoint details' });
		}
	}

	/**
	 * Get summary of user analytics
	 */
	async getUserAnalytics(req: Request, res: Response) {
		try {
			const { startDate, endDate, limit, offset } = req.query;
			const users = await this.analyticsService.getUserAnalytics(
				startDate as string,
				endDate as string,
				parseInt(limit as string) || 50,
				parseInt(offset as string) || 0
			);
			return res.json(users);
		} catch (error) {
			console.error('Error fetching user analytics:', error);
			return res.status(500).json({ error: 'Failed to fetch user analytics' });
		}
	}

	/**
	 * Get detailed analytics for a specific user
	 */
	async getUserDetail(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const { startDate, endDate } = req.query;
			const details = await this.analyticsService.getUserDetail(
				parseInt(userId),
				startDate as string,
				endDate as string
			);
			return res.json(details);
		} catch (error) {
			console.error('Error fetching user details:', error);
			return res.status(500).json({ error: 'Failed to fetch user details' });
		}
	}

	/**
	 * Get overall system analytics
	 */
	async getSystemAnalytics(req: Request, res: Response) {
		try {
			const { startDate, endDate } = req.query;
			const systemStats = await this.analyticsService.getSystemAnalytics(
				startDate as string,
				endDate as string
			);
			return res.json(systemStats);
		} catch (error) {
			console.error('Error fetching system analytics:', error);
			return res
				.status(500)
				.json({ error: 'Failed to fetch system analytics' });
		}
	}

	/**
	 * Get real-time analytics for the past hour
	 */
	async getRealTimeAnalytics(req: Request, res: Response) {
		try {
			const realTimeData = await this.analyticsService.getRealTimeAnalytics();
			return res.json(realTimeData);
		} catch (error) {
			console.error('Error fetching real-time analytics:', error);
			return res
				.status(500)
				.json({ error: 'Failed to fetch real-time analytics' });
		}
	}
}
