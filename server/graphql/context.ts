import { Request, Response } from 'express';
import { UserService } from '../services/user';
import { MovieService } from '../services/movie';
import { WatchlistService } from '../services/watchlist';
import { MovieReviewService } from '../services/movieReview';
import { FavoriteService } from '../services/favorite';

export interface GraphQLContext {
	req: Request;
	res: Response;
	user?: {
		id: number;
		email: string;
		username: string;
		role?: string;
	};
	userService: UserService;
	movieService: MovieService;
	watchlistService: WatchlistService;
	movieReviewService: MovieReviewService;
	favoriteService: FavoriteService;
}
