import { Request, Response } from 'express';
import { UserService } from '../services/user';
import { MovieService } from '../services/movie';
import { WatchlistService } from '../services/watchlist';
import { MovieReviewService } from '../services/movieReview';
import { FavoriteService } from '../services/favorite';
import { PostService } from '../services/PostService';
import { PostLikeService } from '../services/PostLikeService';
import { PostCommentService } from '../services/PostCommentService';

export interface GraphQLContext {
	req: Request;
	res: Response;
	user?: {
		id: number;
		email: string;
		username: string;
		role?: string;
	};
	services: {
		user: UserService;
		movie: MovieService;
		watchlist: WatchlistService;
		review: MovieReviewService;
		favorite: FavoriteService;
		post: PostService;
		postLike: PostLikeService;
		postComment: PostCommentService;
	};
	userService: UserService;
	movieService: MovieService;
	watchlistService: WatchlistService;
	movieReviewService: MovieReviewService;
	favoriteService: FavoriteService;
	postService: PostService;
	postLikeService: PostLikeService;
	postCommentService: PostCommentService;
}
