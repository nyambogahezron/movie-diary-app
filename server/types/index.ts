import { Document, Types } from 'mongoose';

export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IMovie extends Document {
	_id: Types.ObjectId;
	title: string;
	tmdbId: string;
	posterPath?: string;
	releaseDate?: Date;
	overview?: string;
	rating?: number;
	watchDate?: Date;
	review?: string;
	genres?: string[];
	user: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IWatchlist extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	movies: Types.ObjectId[];
	name: string;
	description?: string;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IFavorite extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	movie: Types.ObjectId;
	createdAt: Date;
}

export interface AuthPayload {
	token: string;
	user: IUser;
}

export interface JwtPayload {
	userId: string;
	iat?: number;
	exp?: number;
}

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
