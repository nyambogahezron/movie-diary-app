import { ObjectType, Field, ID, InputType, Float, Int } from 'type-graphql';
import { Types } from 'mongoose';
import { IUser, IMovie, IWatchlist, IFavorite } from '../types';

@ObjectType()
export class User implements Partial<IUser> {
	@Field(() => ID)
	_id: string;

	@Field()
	username: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	avatar?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class Movie implements Partial<IMovie> {
	@Field(() => ID)
	_id: string;

	@Field()
	title: string;

	@Field()
	tmdbId: string;

	@Field({ nullable: true })
	posterPath?: string;

	@Field({ nullable: true })
	releaseDate?: Date;

	@Field({ nullable: true })
	overview?: string;

	@Field(() => Float, { nullable: true })
	rating?: number;

	@Field({ nullable: true })
	watchDate?: Date;

	@Field({ nullable: true })
	review?: string;

	@Field(() => [String], { nullable: true })
	genres?: string[];

	@Field(() => User)
	user: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class Watchlist implements Partial<IWatchlist> {
	@Field(() => ID)
	_id: string;

	@Field(() => User)
	user: User;

	@Field(() => [Movie])
	movies: Movie[];

	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	isPublic: boolean;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class Favorite implements Partial<IFavorite> {
	@Field(() => ID)
	_id: string;

	@Field(() => User)
	user: User;

	@Field(() => Movie)
	movie: Movie;

	@Field()
	createdAt: Date;
}

@ObjectType()
export class AuthPayload {
	@Field()
	token: string;

	@Field(() => User)
	user: User;
}

@InputType()
export class MovieInput {
	@Field()
	title: string;

	@Field()
	tmdbId: string;

	@Field({ nullable: true })
	posterPath?: string;

	@Field({ nullable: true })
	releaseDate?: Date;

	@Field({ nullable: true })
	overview?: string;

	@Field(() => Float, { nullable: true })
	rating?: number;

	@Field({ nullable: true })
	watchDate?: Date;

	@Field({ nullable: true })
	review?: string;

	@Field(() => [String], { nullable: true })
	genres?: string[];
}

@InputType()
export class WatchlistInput {
	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	isPublic?: boolean;
}

@InputType()
export class SearchInput {
	@Field(() => Int, { nullable: true })
	limit?: number;

	@Field(() => Int, { nullable: true })
	offset?: number;

	@Field({ nullable: true })
	search?: string;

	@Field({ nullable: true })
	sortBy?: string;

	@Field({ nullable: true })
	sortOrder?: 'asc' | 'desc';
}
