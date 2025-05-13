import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { AuthService } from '../services/AuthService';
import { MovieService } from '../services/MovieService';
import { WatchlistService } from '../services/WatchlistService';
import { IUser, SearchInput } from '../types';
import { Context } from '../types/context';

@Resolver()
export class AuthResolver {
	@Mutation(() => AuthPayload)
	async register(
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string
	) {
		return AuthService.register(username, email, password);
	}

	@Mutation(() => AuthPayload)
	async login(@Arg('email') email: string, @Arg('password') password: string) {
		return AuthService.login(email, password);
	}

	@Query(() => User)
	@Authorized()
	async me(@Ctx() { user }: Context) {
		return user;
	}
}

@Resolver()
export class MovieResolver {
	@Query(() => Movie)
	@Authorized()
	async movie(@Arg('id') id: string, @Ctx() { user }: Context) {
		return MovieService.getMovie(id, user);
	}

	@Query(() => [Movie])
	@Authorized()
	async movies(
		@Arg('input', { nullable: true }) input: SearchInput,
		@Ctx() { user }: Context
	) {
		return MovieService.getMovies(input || {}, user);
	}

	@Mutation(() => Movie)
	@Authorized()
	async addMovie(@Arg('input') input: MovieInput, @Ctx() { user }: Context) {
		return MovieService.addMovie(input, user);
	}

	@Mutation(() => Movie)
	@Authorized()
	async updateMovie(
		@Arg('id') id: string,
		@Arg('input') input: MovieInput,
		@Ctx() { user }: Context
	) {
		return MovieService.updateMovie(id, input, user);
	}

	@Mutation(() => Boolean)
	@Authorized()
	async deleteMovie(@Arg('id') id: string, @Ctx() { user }: Context) {
		return MovieService.deleteMovie(id, user);
	}

	@Mutation(() => Boolean)
	@Authorized()
	async toggleFavorite(
		@Arg('movieId') movieId: string,
		@Ctx() { user }: Context
	) {
		return MovieService.toggleFavorite(movieId, user);
	}

	@Query(() => [Movie])
	@Authorized()
	async favorites(
		@Arg('input', { nullable: true }) input: SearchInput,
		@Ctx() { user }: Context
	) {
		return MovieService.getFavorites(user, input || {});
	}
}

@Resolver()
export class WatchlistResolver {
	@Mutation(() => Watchlist)
	@Authorized()
	async createWatchlist(
		@Arg('name') name: string,
		@Arg('description', { nullable: true }) description: string,
		@Arg('isPublic', { nullable: true }) isPublic: boolean,
		@Ctx() { user }: Context
	) {
		return WatchlistService.createWatchlist(name, user, description, isPublic);
	}

	@Mutation(() => Watchlist)
	@Authorized()
	async updateWatchlist(
		@Arg('id') id: string,
		@Arg('input') input: WatchlistInput,
		@Ctx() { user }: Context
	) {
		return WatchlistService.updateWatchlist(id, user, input);
	}

	@Mutation(() => Boolean)
	@Authorized()
	async deleteWatchlist(@Arg('id') id: string, @Ctx() { user }: Context) {
		return WatchlistService.deleteWatchlist(id, user);
	}

	@Query(() => Watchlist)
	@Authorized()
	async watchlist(@Arg('id') id: string, @Ctx() { user }: Context) {
		return WatchlistService.getWatchlist(id, user);
	}

	@Query(() => [Watchlist])
	@Authorized()
	async myWatchlists(
		@Arg('input', { nullable: true }) input: SearchInput,
		@Ctx() { user }: Context
	) {
		return WatchlistService.getUserWatchlists(user, input || {});
	}

	@Query(() => [Watchlist])
	async publicWatchlists(@Arg('input', { nullable: true }) input: SearchInput) {
		return WatchlistService.getPublicWatchlists(input || {});
	}

	@Mutation(() => Watchlist)
	@Authorized()
	async reorderWatchlistMovies(
		@Arg('id') id: string,
		@Arg('movieIds', () => [String]) movieIds: string[],
		@Ctx() { user }: Context
	) {
		return WatchlistService.reorderMovies(id, user, movieIds);
	}
}
