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
