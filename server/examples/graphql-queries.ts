// Example GraphQL queries and mutations for testing
// Save these in a .graphql file or use them in your GraphQL client

// Authentication
const authExamples = `
# Register a new user
mutation Register {
  register(email: "test@example.com", username: "testuser", password: "Test123!@#") {
    user {
      id
      email
      username
      role
      isEmailVerified
    }
    accessToken
    refreshToken
  }
}

# Login
mutation Login {
  login(email: "test@example.com", password: "Test123!@#") {
    user {
      id
      email
      username
      role
    }
    accessToken
    refreshToken
  }
}

# Refresh token
mutation RefreshToken {
  refreshToken(token: "your-refresh-token") {
    user {
      id
      email
    }
    accessToken
    refreshToken
  }
}

# Request password reset
mutation RequestPasswordReset {
  requestPasswordReset(email: "test@example.com")
}

# Reset password
mutation ResetPassword {
  resetPassword(token: "reset-token", newPassword: "NewTest123!@#")
}

# Verify email
mutation VerifyEmail {
  verifyEmail(token: "verification-token")
}
`;

// Movie Operations
const movieExamples = `
# Search movies with filters
query SearchMovies {
  searchMovies(input: {
    query: "Inception"
    year: 2010
    genre: "Sci-Fi"
    minRating: 8.0
    maxRating: 10.0
    sortBy: RATING
    sortOrder: DESC
    page: 1
    limit: 10
  }) {
    movies {
      id
      title
      year
      rating
      genres
      overview
    }
    total
    page
    totalPages
    hasMore
  }
}

# Get movie recommendations
query GetRecommendations {
  recommendedMovies(limit: 5) {
    id
    title
    rating
    genres
  }
  similarMovies(movieId: "123", limit: 5) {
    id
    title
    rating
  }
  popularMoviesByGenre(genre: "Action", limit: 5) {
    id
    title
    rating
  }
}

# Get movie details with reviews
query GetMovieDetails {
  movie(id: "123") {
    id
    title
    year
    rating
    genres
    overview
    reviews {
      id
      rating
      content
      user {
        username
      }
      createdAt
    }
    reviewStats {
      averageRating
      totalReviews
      ratingDistribution {
        rating
        count
      }
    }
  }
}
`;

// Watchlist Operations
const watchlistExamples = `
# Add movie to watchlist
mutation AddToWatchlist {
  addToWatchlist(movieId: "123", status: PLAN_TO_WATCH) {
    id
    movie {
      title
    }
    status
    createdAt
  }
}

# Update watchlist status
mutation UpdateWatchlistStatus {
  updateMovieStatus(
    movieId: "123"
    status: WATCHED
    rating: 8
    review: "Great movie! The plot was engaging and the acting was superb."
  ) {
    id
    status
    rating
    review {
      content
      rating
    }
  }
}

# Get watchlist by filters
query GetWatchlist {
  watchlistByStatus(status: WATCHED, limit: 10) {
    id
    title
    year
    rating
  }
  watchlistByYear(year: 2023, limit: 10) {
    id
    title
    rating
  }
  watchlistByGenre(genre: "Drama", limit: 10) {
    id
    title
    rating
  }
}

# Reorder watchlist
mutation ReorderWatchlist {
  reorderWatchlist(movieIds: ["123", "456", "789"])
}

# Bulk update watchlist
mutation BulkUpdateWatchlist {
  bulkUpdateWatchlistStatus(
    movieIds: ["123", "456", "789"]
    status: WATCHED
  )
}
`;

// Review Operations
const reviewExamples = `
# Create review
mutation CreateReview {
  createReview(
    movieId: "123"
    rating: 9
    content: "One of the best movies I've seen this year. The cinematography was stunning."
  ) {
    id
    rating
    content
    movie {
      title
    }
    user {
      username
    }
    createdAt
  }
}

# Update review
mutation UpdateReview {
  updateReview(
    reviewId: "123"
    rating: 8
    content: "Updated review: Still a great movie, but not perfect."
  ) {
    id
    rating
    content
    updatedAt
  }
}

# Delete review
mutation DeleteReview {
  deleteReview(reviewId: "123")
}

# Report review
mutation ReportReview {
  reportReview(
    reviewId: "123"
    reason: "This review contains inappropriate content"
  )
}

# Get review statistics
query GetReviewStats {
  reviewStats(movieId: "123") {
    averageRating
    totalReviews
    ratingDistribution {
      rating
      count
    }
    topReviewers {
      username
      reviewCount
    }
  }
  topReviewedMovies(limit: 5) {
    id
    title
    rating
    reviewCount
  }
  recentReviews(limit: 5) {
    id
    content
    rating
    user {
      username
    }
    movie {
      title
    }
    createdAt
  }
}
`;

// User Operations
const userExamples = `
# Get user statistics
query GetUserStats {
  userStats(userId: "123") {
    totalReviews
    averageRating
    totalWatchlist
    totalFavorites
    mostWatchedGenres {
      genre
      count
    }
    recentActivity {
      type
      movie {
        title
      }
      timestamp
    }
    monthlyStats {
      month
      reviews
      watchlist
      favorites
    }
  }
}

# Get user activity
query GetUserActivity {
  userActivity(userId: "123", type: REVIEW, limit: 5) {
    type
    movie {
      title
    }
    timestamp
  }
  userMonthlyStats(userId: "123", year: 2024) {
    month
    reviews
    watchlist
    favorites
  }
}

# Update user preferences
mutation UpdatePreferences {
  updateUserPreferences(preferences: {
    theme: "dark"
    language: "en"
    timezone: "UTC"
    displayName: "Movie Buff"
    bio: "Love watching and reviewing movies"
    privacySettings: {
      showEmail: false
      showWatchlist: true
      showReviews: true
      showFavorites: true
    }
  }) {
    id
    username
    preferences
  }
}

# Update notification settings
mutation UpdateNotifications {
  updateNotificationSettings(settings: {
    emailNotifications: true
    reviewNotifications: true
    watchlistNotifications: true
    systemNotifications: false
  }) {
    id
    username
    notificationSettings
  }
}
`;

// Batch Operations
const batchExamples = `
# Batch movie operations
mutation BatchMovieOps {
  batchMovieOperation(input: {
    ids: ["123", "456", "789"]
    action: ADD_TO_WATCHLIST
  }) {
    success
    affectedIds
    errors {
      id
      message
    }
  }
}

# Batch review operations
mutation BatchReviewOps {
  batchReviewOperation(
    movieIds: ["123", "456", "789"]
    action: DELETE_REVIEWS
  ) {
    success
    affectedIds
    errors {
      id
      message
    }
  }
}
`;

// Example usage with variables
const examplesWithVariables = `
# Search movies with variables
query SearchMoviesWithVars($input: MovieSearchInput!) {
  searchMovies(input: $input) {
    movies {
      id
      title
      rating
    }
    total
  }
}

# Variables:
{
  "input": {
    "query": "Inception",
    "year": 2010,
    "genre": "Sci-Fi",
    "minRating": 8.0,
    "maxRating": 10.0,
    "sortBy": "RATING",
    "sortOrder": "DESC",
    "page": 1,
    "limit": 10
  }
}

# Create review with variables
mutation CreateReviewWithVars($input: CreateReviewInput!) {
  createReview(input: $input) {
    id
    rating
    content
  }
}

# Variables:
{
  "input": {
    "movieId": "123",
    "rating": 9,
    "content": "Great movie!"
  }
}
`;

// Export all examples
export const graphqlExamples = {
	auth: authExamples,
	movies: movieExamples,
	watchlist: watchlistExamples,
	reviews: reviewExamples,
	users: userExamples,
	batch: batchExamples,
	withVariables: examplesWithVariables,
};
