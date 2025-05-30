// Types for the application entities
export interface User {
	id: number;
	username: string;
	email: string;
	password: string;
	avatar?: string | null;
	createdAt: string;
	updatedAt: string;
}

// Keeping IUser for backward compatibility
export interface IUser {
	id: number;
	username: string;
	email: string;
	password: string;
	avatar?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Movie {
	id: number;
	title: string;
	tmdbId: string;
	posterPath?: string | null;
	releaseDate?: string | null;
	overview?: string | null;
	rating?: number | null;
	watchDate?: string | null;
	review?: string | null;
	genres?: string | null; // JSON string of genres
	userId: number;
	createdAt: string;
	updatedAt: string;
}

// Input type for creating/updating movies
export interface MovieInput {
	title: string;
	tmdbId: string;
	posterPath?: string | null;
	releaseDate?: string | null;
	overview?: string | null;
	rating?: number | null;
	watchDate?: string | null;
	review?: string | null;
	genres?: string[]; // Array of genre strings
	userId?: number;
}

export interface IMovie {
	id: number;
	title: string;
	tmdbId: string;
	posterPath?: string | null;
	releaseDate?: string | null;
	overview?: string | null;
	rating?: number | null;
	watchDate?: string | null;
	review?: string | null;
	genres?: string | null; // JSON string of genres
	userId: number;
	createdAt: string;
	updatedAt: string;
}

export interface Watchlist {
	id: number;
	userId: number;
	name: string;
	description?: string | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

// Input type for creating/updating watchlists
export interface WatchlistInput {
	name: string;
	description?: string | null;
	isPublic?: boolean;
	userId?: number;
}

export interface IWatchlist {
	id: number;
	userId: number;
	name: string;
	description?: string | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface WatchlistMovie {
	id: number;
	watchlistId: number;
	movieId: number;
	createdAt: string;
}

export interface Favorite {
	id: number;
	userId: number;
	movieId: number;
	createdAt: string;
}

export interface IFavorite {
	id: number;
	userId: number;
	movieId: number;
	createdAt: string;
}

export interface AuthPayload {
	token: string;
	refreshToken?: string; // Optional for backward compatibility
	user: User;
}

export interface JwtPayload {
	userId: number;
	iat?: number;
	exp?: number;
}

// API request query parameter types
export interface PaginationInput {
	limit?: number;
	offset?: number;
}

export interface SortInput {
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface SearchInput extends PaginationInput, SortInput {
	search?: string;
}

// Movie Review interfaces
export interface MovieReview {
	id: number;
	userId: number;
	movieId: number;
	content: string;
	rating?: number | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

// Input type for creating/updating movie reviews
export interface MovieReviewInput {
	content: string;
	rating?: number | null;
	isPublic?: boolean;
	userId?: number;
	movieId?: number;
}

export interface IMovieReview {
	id: number;
	userId: number;
	movieId: number;
	content: string;
	rating?: number | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

// Post related interfaces
export interface Post {
	id: number;
	userId: number;
	tmdbId: string;
	posterPath?: string | null;
	title: string;
	content: string;
	likesCount: number;
	commentsCount: number;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

// Input type for creating/updating posts
export interface PostInput {
	tmdbId: string;
	posterPath?: string | null;
	title: string;
	content: string;
	isPublic?: boolean;
	userId?: number;
}

export interface PostLike {
	id: number;
	userId: number;
	postId: number;
	createdAt: string;
}

export interface PostComment {
	id: number;
	userId: number;
	postId: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	username?: string; // For display purposes when returning comments
	avatar?: string | null; // For display purposes when returning comments
}

// Input type for creating post comments
export interface PostCommentInput {
	content: string;
	userId?: number;
	postId?: number;
}

// Search params for posts
export interface PostSearchInput extends SearchInput {
	userId?: number;
	isPublic?: boolean;
}
