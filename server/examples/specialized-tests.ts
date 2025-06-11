// Specialized test cases and performance benchmarks for the GraphQL API

// Movie recommendation and discovery queries
const recommendationQueries = `
# Get personalized movie recommendations
query GetPersonalizedRecommendations($userId: ID!, $limit: Int = 10) {
  user(id: $userId) {
    recommendations(limit: $limit) {
      movie {
        id
        title
        year
        rating
        genres
        similarityScore
        recommendationReason
      }
      # Include user's watch history for context
      basedOn {
        movie {
          id
          title
          rating
        }
        similarity
      }
    }
    # Include user preferences for context
    preferences {
      favoriteGenres
      preferredYears
      minRating
    }
  }
}

# Get genre-based recommendations with filters
query GetGenreRecommendations($genre: String!, $filters: MovieFilterInput) {
  genreRecommendations(genre: $genre, filters: $filters) {
    movies {
      id
      title
      year
      rating
      genres
      popularity
      recommendationScore
    }
    genreStats {
      totalMovies
      averageRating
      topYears
      relatedGenres {
        genre
        correlation
      }
    }
  }
}

# Get similar movies with detailed comparison
query GetSimilarMovies($movieId: ID!, $limit: Int = 5) {
  similarMovies(movieId: $movieId, limit: $limit) {
    movie {
      id
      title
      year
      rating
      genres
    }
    similarityMetrics {
      genreOverlap
      ratingDifference
      yearDifference
      commonActors
      commonDirectors
      userOverlap
    }
    commonReviews {
      user {
        username
      }
      rating
      sentiment
    }
  }
}
`;

// User activity and statistics queries
const userActivityQueries = `
# Get detailed user activity timeline
query GetUserActivityTimeline($userId: ID!, $timeframe: Timeframe!) {
  userActivity(userId: $userId, timeframe: $timeframe) {
    timeline {
      date
      activities {
        type
        movie {
          id
          title
          rating
        }
        details {
          ... on ReviewActivity {
            rating
            content
            likes
          }
          ... on WatchlistActivity {
            status
            priority
          }
          ... on FavoriteActivity {
            addedAt
          }
        }
      }
    }
    statistics {
      totalActivities
      activityByType {
        type
        count
        percentage
      }
      mostActiveDays {
        date
        count
      }
      genreDistribution {
        genre
        count
        percentage
      }
      ratingDistribution {
        rating
        count
        percentage
      }
    }
  }
}

# Get user movie preferences analysis
query GetUserPreferencesAnalysis($userId: ID!) {
  userPreferences(userId: $userId) {
    genrePreferences {
      genre
      count
      averageRating
      percentage
      recentMovies {
        id
        title
        rating
      }
    }
    yearPreferences {
      year
      count
      averageRating
    }
    ratingPatterns {
      averageRating
      ratingDistribution {
        rating
        count
      }
      ratingTrend {
        period
        averageRating
      }
    }
    watchlistInsights {
      totalMovies
      averageRating
      completionRate
      statusDistribution {
        status
        count
        percentage
      }
    }
  }
}
`;

// Performance benchmark queries
const performanceBenchmarks = `
# Benchmark large dataset queries
query BenchmarkLargeDataset {
  # Test pagination with large datasets
  searchMovies(input: {
    limit: 100
    page: 1
    sortBy: RATING
    sortOrder: DESC
  }) {
    movies {
      id
      title
      year
      rating
      genres
      reviews {
        id
        rating
        content
      }
      watchlist {
        user {
          id
          username
        }
        status
      }
    }
    total
    page
    totalPages
  }
  
  # Test complex aggregations
  movieStats {
    totalMovies
    averageRating
    genreDistribution {
      genre
      count
      averageRating
    }
    yearDistribution {
      year
      count
      averageRating
    }
    ratingDistribution {
      rating
      count
      percentage
    }
    topMovies {
      id
      title
      rating
      reviewCount
    }
  }
  
  # Test nested relationship queries
  popularMovies(limit: 50) {
    id
    title
    rating
    reviews {
      id
      rating
      user {
        id
        username
        reviews {
          id
          rating
          movie {
            id
            title
          }
        }
      }
    }
    similarMovies(limit: 5) {
      id
      title
      rating
      reviews {
        id
        rating
      }
    }
  }
}

# Benchmark concurrent operations
mutation BenchmarkConcurrentOps {
  # Test multiple concurrent mutations
  operations: [
    addToWatchlist(movieId: "1") { id }
    addToWatchlist(movieId: "2") { id }
    addToWatchlist(movieId: "3") { id }
    createReview(
      movieId: "1"
      rating: 8
      content: "Great movie!"
    ) { id }
    createReview(
      movieId: "2"
      rating: 7
      content: "Good movie"
    ) { id }
    addToFavorites(movieId: "1") { id }
  ]
}

# Benchmark search performance
query BenchmarkSearch {
  # Test different search scenarios
  searchScenarios: [
    # Simple search
    searchMovies(input: { query: "action" }) {
      total
      movies { id title }
    }
    # Complex search with filters
    searchMovies(input: {
      query: "action"
      year: 2020
      genres: ["Action", "Adventure"]
      minRating: 7
      sortBy: RATING
      sortOrder: DESC
    }) {
      total
      movies { id title }
    }
    # Search with aggregations
    searchMovies(input: { query: "drama" }) {
      total
      movies { id title }
      stats {
        genreDistribution
        yearDistribution
        ratingDistribution
      }
    }
  ]
}
`;

// Error handling and edge cases
const errorScenarios = `
# Test complex error scenarios
mutation TestComplexErrors {
  # Test validation with multiple fields
  register(
    email: "invalid-email"
    username: "a" # Too short
    password: "123" # Too weak
  ) {
    user { id }
    errors {
      field
      message
      code
    }
  }
  
  # Test concurrent resource conflicts
  operations: [
    updateReview(
      id: "1"
      rating: 8
      content: "First update"
    ) { id }
    updateReview(
      id: "1"
      rating: 9
      content: "Second update"
    ) { id }
  ]
  
  # Test rate limiting with multiple operations
  rapidOperations: [
    login(email: "test@example.com", password: "password") { token }
    login(email: "test@example.com", password: "password") { token }
    login(email: "test@example.com", password: "password") { token }
    login(email: "test@example.com", password: "password") { token }
    login(email: "test@example.com", password: "password") { token }
  ]
}

# Test edge cases with invalid data
query TestEdgeCases {
  # Test with non-existent IDs
  nonExistent: [
    movie(id: "999999") { id }
    user(id: "999999") { id }
    review(id: "999999") { id }
  ]
  
  # Test with empty results
  emptyResults: [
    searchMovies(input: { query: "nonexistentmovie" }) {
      movies { id }
      total
    }
    userActivity(userId: "1", timeframe: LAST_YEAR) {
      timeline { activities { type } }
    }
  ]
  
  # Test with invalid parameters
  invalidParams: [
    searchMovies(input: { page: -1, limit: 0 }) {
      movies { id }
    }
    userActivity(userId: "1", timeframe: INVALID) {
      timeline { activities { type } }
    }
  ]
}
`;

// Export all specialized test cases
export const specializedTests = {
	recommendationQueries,
	userActivityQueries,
	performanceBenchmarks,
	errorScenarios,
};
