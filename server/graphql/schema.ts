import { gql } from 'apollo-server-express';
import { directiveDefinitions } from './directives';

export const typeDefs = gql`
	${directiveDefinitions}

	enum UserRole {
		USER
		ADMIN
		MODERATOR
	}

	enum AuthErrorCode {
		INVALID_CREDENTIALS
		EMAIL_NOT_VERIFIED
		ACCOUNT_LOCKED
		TOKEN_EXPIRED
		INVALID_TOKEN
		RATE_LIMIT_EXCEEDED
		PASSWORD_RESET_EXPIRED
		EMAIL_ALREADY_EXISTS
		USERNAME_ALREADY_EXISTS
	}

	type AuthError {
		code: AuthErrorCode!
		message: String!
	}

	type AuthPayload {
		token: String!
		refreshToken: String!
		user: User!
	}

	type RefreshTokenPayload {
		token: String!
		refreshToken: String!
	}

	type PasswordResetPayload {
		success: Boolean!
		message: String!
	}

	type EmailVerificationPayload {
		success: Boolean!
		message: String!
	}

	type User {
		id: ID!
		email: String!
		username: String!
		role: UserRole!
		isEmailVerified: Boolean!
		isAccountLocked: Boolean!
		createdAt: String!
		updatedAt: String!
		reviews: [MovieReview!]!
		watchlists: [Watchlist!]!
		favorites: [Favorite!]!
		posts: [Post!]!
	}

	type Query {
		# User queries
		me: User @auth
		user(id: ID!): User @auth
		users(limit: Int, offset: Int): [User!]! @auth(role: "ADMIN")
		verifyEmail(token: String!): EmailVerificationPayload!
		checkPasswordResetToken(token: String!): Boolean!

		# Movie queries
		movie(id: ID!): Movie
		movies(search: String, limit: Int, offset: Int): [Movie!]!
		popularMovies(limit: Int): [Movie!]!

		# Review queries
		review(id: ID!): MovieReview
		reviews(movieId: ID, userId: ID, limit: Int, offset: Int): [MovieReview!]!
		userReviews(userId: ID!, limit: Int, offset: Int): [MovieReview!]!
		movieReviews(movieId: ID!, limit: Int, offset: Int): [MovieReview!]!

		# Watchlist queries
		watchlist(id: ID!): Watchlist @auth
		watchlists(userId: ID!, limit: Int, offset: Int): [Watchlist!]! @auth
		watchlistMovies(watchlistId: ID!, limit: Int, offset: Int): [Movie!]! @auth

		# Favorite queries
		favorites(userId: ID!, limit: Int, offset: Int): [Favorite!]! @auth
		isFavorite(movieId: ID!): Boolean! @auth

		# Advanced movie search
		searchMovies(input: MovieSearchInput!): MovieSearchResult! @auth

		# User statistics and analytics
		userStats(userId: ID!): UserStats! @auth
		userActivity(userId: ID!, type: ActivityType, limit: Int): [UserActivity!]!
			@auth
		userMonthlyStats(userId: ID!, year: Int!): [MonthlyStats!]! @auth

		# Movie recommendations
		recommendedMovies(limit: Int = 10): [Movie!]! @auth
		similarMovies(movieId: ID!, limit: Int = 10): [Movie!]! @auth
		popularMoviesByGenre(genre: String!, limit: Int = 10): [Movie!]! @auth

		# Advanced watchlist queries
		watchlistByStatus(status: WatchStatus!, limit: Int, offset: Int): [Movie!]!
			@auth
		watchlistByYear(year: Int!, limit: Int, offset: Int): [Movie!]! @auth
		watchlistByGenre(genre: String!, limit: Int, offset: Int): [Movie!]! @auth

		# Review analytics
		reviewStats(movieId: ID!): ReviewStats! @auth
		topReviewedMovies(limit: Int = 10): [Movie!]! @auth
		recentReviews(limit: Int = 10): [MovieReview!]! @auth

		# Post queries
		post(id: ID!): Post
		posts(userId: ID, limit: Int, offset: Int): [Post!]!
		userPosts(userId: ID!, limit: Int, offset: Int): [Post!]!
		postComments(postId: ID!, limit: Int, offset: Int): [PostComment!]!
		isPostLiked(postId: ID!): Boolean! @auth
	}

	type Mutation {
		# Auth mutations
		register(email: String!, username: String!, password: String!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!
		logout: Boolean! @auth
		refreshToken(refreshToken: String!): RefreshTokenPayload!

		# Password management
		requestPasswordReset(email: String!): PasswordResetPayload!
		resetPassword(token: String!, newPassword: String!): PasswordResetPayload!
		changePassword(currentPassword: String!, newPassword: String!): Boolean!
			@auth

		# Email verification
		resendVerificationEmail: EmailVerificationPayload! @auth
		verifyEmail(token: String!): EmailVerificationPayload!

		# Account management
		updateProfile(username: String, email: String): User! @auth
		deleteAccount(password: String!): Boolean! @auth

		# Admin mutations
		updateUserRole(userId: ID!, role: UserRole!): User! @auth(role: "ADMIN")
		lockUserAccount(userId: ID!, reason: String): Boolean! @auth(role: "ADMIN")
		unlockUserAccount(userId: ID!): Boolean! @auth(role: "ADMIN")

		# Movie mutations
		createMovie(input: CreateMovieInput!): Movie! @auth
		updateMovie(id: ID!, input: UpdateMovieInput!): Movie! @auth
		deleteMovie(id: ID!): Boolean! @auth

		# Review mutations
		createReview(input: CreateReviewInput!): MovieReview! @auth
		updateReview(id: ID!, input: UpdateReviewInput!): MovieReview! @auth
		deleteReview(id: ID!, input: UpdateReviewInput!): Boolean! @auth

		# Watchlist mutations
		createWatchlist(input: CreateWatchlistInput!): Watchlist! @auth
		updateWatchlist(id: ID!, input: UpdateWatchlistInput!): Watchlist! @auth
		deleteWatchlist(id: ID!): Boolean! @auth
		addMovieToWatchlist(watchlistId: ID!, movieId: ID!): Watchlist! @auth
		removeMovieFromWatchlist(watchlistId: ID!, movieId: ID!): Watchlist! @auth

		# Favorite mutations
		addFavorite(movieId: ID!): Favorite! @auth
		removeFavorite(movieId: ID!): Boolean! @auth

		# Batch operations
		batchMovieOperation(input: BatchMovieInput!): BatchOperationResult! @auth
		batchReviewOperation(
			movieIds: [ID!]!
			action: BatchAction!
		): BatchOperationResult! @auth

		# Advanced movie management
		updateMovieStatus(
			movieId: ID!
			status: WatchStatus!
			rating: Int
			review: String
		): MovieReview! @auth
		updateMultipleMovies(input: [UpdateMovieInput!]!): [MovieReview!]! @auth

		# Review management
		updateReview(reviewId: ID!, rating: Int, content: String): MovieReview!
			@auth
		deleteReview(reviewId: ID!): Boolean! @auth
		reportReview(reviewId: ID!, reason: String!): Boolean! @auth

		# Watchlist management
		reorderWatchlist(movieIds: [ID!]!): Boolean! @auth
		updateWatchlistPriority(movieId: ID!, priority: Int!): Boolean! @auth
		bulkUpdateWatchlistStatus(movieIds: [ID!]!, status: WatchStatus!): Boolean!
			@auth

		# User preferences
		updateUserPreferences(preferences: UserPreferencesInput!): User! @auth
		updateNotificationSettings(settings: NotificationSettingsInput!): User!
			@auth

		# Post mutations
		createPost(input: CreatePostInput!): Post! @auth
		updatePost(id: ID!, input: UpdatePostInput!): Post! @auth
		deletePost(id: ID!): Boolean! @auth
		likePost(postId: ID!): PostLike! @auth
		unlikePost(postId: ID!): Boolean! @auth
		createPostComment(input: CreatePostCommentInput!): PostComment! @auth
		updatePostComment(id: ID!, input: UpdatePostCommentInput!): PostComment!
			@auth
		deletePostComment(id: ID!): Boolean! @auth
	}

	type Movie {
		id: ID!
		title: String!
		overview: String
		posterPath: String
		releaseDate: String
		createdAt: String!
		updatedAt: String!
		reviews: [MovieReview!]!
		averageRating: Float
		reviewCount: Int!
		isFavorite: Boolean
	}

	type MovieReview {
		id: ID!
		movieId: ID!
		userId: ID!
		rating: Int!
		review: String
		createdAt: String!
		updatedAt: String!
		user: User!
		movie: Movie!
	}

	type Watchlist {
		id: ID!
		userId: ID!
		name: String!
		description: String
		createdAt: String!
		updatedAt: String!
		movies: [Movie!]!
		movieCount: Int!
		user: User!
	}

	type Favorite {
		id: ID!
		userId: ID!
		movieId: ID!
		createdAt: String!
		movie: Movie!
		user: User!
	}

	type Post {
		id: ID!
		userId: ID!
		title: String!
		content: String!
		createdAt: String!
		updatedAt: String!
		user: User!
		likes: [PostLike!]!
		comments: [PostComment!]!
		likeCount: Int!
		commentCount: Int!
	}

	type PostLike {
		id: ID!
		postId: ID!
		userId: ID!
		createdAt: String!
		user: User!
		post: Post!
	}

	type PostComment {
		id: ID!
		postId: ID!
		userId: ID!
		content: String!
		createdAt: String!
		updatedAt: String!
		user: User!
		post: Post!
	}

	input CreateMovieInput {
		title: String!
		overview: String
		posterPath: String
		releaseDate: String
	}

	input UpdateMovieInput {
		movieId: ID!
		status: WatchStatus
		rating: Int
		review: String
	}

	input CreateReviewInput {
		movieId: ID!
		rating: Int!
		review: String
	}

	input UpdateReviewInput {
		rating: Int
		review: String
	}

	input CreateWatchlistInput {
		name: String!
		description: String
	}

	input UpdateWatchlistInput {
		name: String
		description: String
	}

	type MovieSearchInput {
		query: String
		year: Int
		genre: String
		minRating: Float
		maxRating: Float
		sortBy: MovieSortField
		sortOrder: SortOrder
		page: Int
		limit: Int
	}

	enum MovieSortField {
		TITLE
		YEAR
		RATING
		POPULARITY
		CREATED_AT
	}

	enum SortOrder {
		ASC
		DESC
	}

	type MovieSearchResult {
		movies: [Movie!]!
		total: Int!
		page: Int!
		totalPages: Int!
		hasMore: Boolean!
	}

	type UserStats {
		totalReviews: Int!
	}

	type NotificationSettingsInput {
		emailNotifications: Boolean
		reviewNotifications: Boolean
		watchlistNotifications: Boolean
		systemNotifications: Boolean
	}

	input CreatePostInput {
		title: String!
		content: String!
	}

	input UpdatePostInput {
		title: String
		content: String
	}

	input CreatePostCommentInput {
		postId: ID!
		content: String!
	}

	input UpdatePostCommentInput {
		content: String!
	}
`;

export default typeDefs;
