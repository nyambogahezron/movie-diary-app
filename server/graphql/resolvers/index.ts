import { mergeResolvers } from '@graphql-tools/merge';
import { authResolvers } from './auth';
import { userResolvers } from './user';
import { movieResolvers } from './movie';
import { reviewResolvers } from './review';
import { watchlistResolvers } from './watchlist';
import { favoriteResolvers } from './favorite';
import { advancedResolvers } from './advanced';

const resolvers = mergeResolvers([
	authResolvers,
	userResolvers,
	movieResolvers,
	reviewResolvers,
	watchlistResolvers,
	favoriteResolvers,
	advancedResolvers,
]);

export default resolvers;
