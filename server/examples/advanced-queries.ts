// Advanced GraphQL query examples with complex scenarios
// These examples demonstrate more complex use cases and edge cases

// Complex nested queries with multiple levels of depth
const nestedQueries = `
# Get user profile with all related data
query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    id
    username
    email
    role
    preferences {
      theme
      language
      privacySettings {
        showEmail
        showWatchlist
      }
    }
    # Nested movie data
    watchlist {
      movie {
        id
        title
        year
        rating
        genres
        reviews {
          id
          rating
          content
          user {
            username
          }
        }
        similarMovies(limit: 3) {
          id
          title
          rating
        }
      }
      status
      rating
      review {
        content
        createdAt
      }
    }
    # Nested review data with movie details
    reviews {
      id
      rating
      content
      createdAt
      movie {
        id
        title
        year
        genres
        rating
        reviews {
          id
          rating
          user {
            username
          }
        }
      }
    }
    # Nested favorite movies with details
    favorites {
      movie {
        id
        title
        year
        rating
        genres
        watchlist {
          user {
            username
          }
          status
        }
      }
      createdAt
    }
    # User statistics with detailed breakdown
    stats {
      totalReviews
      averageRating
      totalWatchlist
      totalFavorites
      mostWatchedGenres {
        genre
        count
        movies {
          id
          title
          rating
        }
      }
      recentActivity {
        type
        movie {
          id
          title
          rating
        }
        timestamp
        details {
          ... on ReviewActivity {
            rating
            content
          }
          ... on WatchlistActivity {
            status
          }
        }
      }
      monthlyStats {
        month
        reviews
        watchlist
        favorites
        averageRating
        topGenres {
          genre
          count
        }
      }
    }
  }
}

# Get movie details with comprehensive data
query GetMovieDetails($movieId: ID!) {
  movie(id: $movieId) {
    id
    title
    year
    rating
    genres
    overview
    # Nested review data with user details
    reviews {
      id
      rating
      content
      createdAt
      user {
        id
        username
        role
        preferences {
          theme
        }
      }
      # Nested review reactions
      reactions {
        type
        user {
          username
        }
      }
    }
    # Review statistics with detailed breakdown
    reviewStats {
      averageRating
      totalReviews
      ratingDistribution {
        rating
        count
        percentage
      }
      topReviewers {
        username
        reviewCount
        averageRating
        recentReviews {
          id
          rating
          content
        }
      }
      genreBreakdown {
        genre
        averageRating
        reviewCount
      }
      monthlyStats {
        month
        reviewCount
        averageRating
      }
    }
    # Watchlist data with user details
    watchlist {
      user {
        id
        username
        role
      }
      status
      rating
      review {
        content
        createdAt
      }
      priority
      addedAt
    }
    # Similar movies with their details
    similarMovies(limit: 5) {
      id
      title
      year
      rating
      genres
      commonGenres
      similarityScore
      reviews {
        id
        rating
      }
    }
    # User recommendations
    recommendedFor {
      user {
        username
        preferences {
          favoriteGenres
        }
      }
      score
      reason
    }
  }
}

# Complex search with multiple filters and sorting
query AdvancedSearch($input: MovieSearchInput!) {
  searchMovies(input: $input) {
    movies {
      id
      title
      year
      rating
      genres
      overview
      # Nested review data
      reviews {
        id
        rating
        content
        user {
          username
        }
      }
      # Nested watchlist data
      watchlist {
        user {
          username
        }
        status
        rating
      }
      # Nested similar movies
      similarMovies(limit: 3) {
        id
        title
        rating
      }
    }
    # Search metadata
    total
    page
    totalPages
    hasMore
    # Search statistics
    stats {
      genreDistribution {
        genre
        count
        percentage
      }
      yearDistribution {
        year
        count
      }
      ratingDistribution {
        range
        count
      }
    }
    # Search suggestions
    suggestions {
      genres
      years
      similarQueries
    }
  }
}
`;

// Error handling and edge cases
const errorHandlingExamples = `
# Test validation errors
mutation TestValidationErrors {
  # Test invalid email
  register(
    email: "invalid-email"
    username: "testuser"
    password: "weak"
  ) {
    user {
      id
    }
  }
  
  # Test invalid password
  login(
    email: "test@example.com"
    password: "123"
  ) {
    user {
      id
    }
  }
  
  # Test invalid rating
  createReview(
    movieId: "123"
    rating: 11
    content: "Too short"
  ) {
    id
  }
}

# Test authentication errors
query TestAuthErrors {
  # Try to access protected data without token
  userStats(userId: "123") {
    totalReviews
  }
  
  # Try to access admin data as regular user
  adminStats {
    totalUsers
  }
  
  # Try to access another user's private data
  user(id: "456") {
    email
    preferences {
      privacySettings
    }
  }
}

# Test rate limiting
mutation TestRateLimiting {
  # Make multiple rapid requests
  login(email: "test@example.com", password: "password") {
    user {
      id
    }
  }
  login(email: "test@example.com", password: "password") {
    user {
      id
    }
  }
  login(email: "test@example.com", password: "password") {
    user {
      id
    }
  }
}

# Test concurrent operations
mutation TestConcurrentOps {
  # Try to create duplicate entries
  addToWatchlist(movieId: "123") {
    id
  }
  addToWatchlist(movieId: "123") {
    id
  }
  
  # Try to create duplicate reviews
  createReview(
    movieId: "123"
    rating: 8
    content: "First review"
  ) {
    id
  }
  createReview(
    movieId: "123"
    rating: 9
    content: "Second review"
  ) {
    id
  }
}

# Test edge cases
query TestEdgeCases {
  # Test empty results
  searchMovies(input: {
    query: "nonexistentmovie"
    year: 9999
  }) {
    movies {
      id
    }
    total
  }
  
  # Test pagination limits
  searchMovies(input: {
    page: 999999
    limit: 1000
  }) {
    movies {
      id
    }
    totalPages
  }
  
  # Test invalid IDs
  movie(id: "invalid-id") {
    id
  }
  user(id: "nonexistent") {
    id
  }
  
  # Test empty arrays
  user(id: "123") {
    watchlist {
      movie {
        id
      }
    }
    reviews {
      id
    }
    favorites {
      movie {
        id
      }
    }
  }
}
`;

// Performance testing queries
const performanceExamples = `
# Test large result sets
query TestLargeResults {
  # Get all movies with minimal fields
  searchMovies(input: {
    limit: 1000
  }) {
    movies {
      id
      title
    }
    total
  }
  
  # Get all reviews for a popular movie
  movie(id: "123") {
    reviews {
      id
      rating
    }
  }
  
  # Get all user activity
  user(id: "123") {
    recentActivity(limit: 1000) {
      type
      timestamp
    }
  }
}

# Test complex aggregations
query TestAggregations {
  # Get detailed statistics
  userStats(userId: "123") {
    monthlyStats {
      month
      reviews
      watchlist
      favorites
      averageRating
      topGenres {
        genre
        count
        movies {
          id
          title
        }
      }
    }
  }
  
  # Get review statistics with detailed breakdown
  reviewStats(movieId: "123") {
    ratingDistribution {
      rating
      count
      percentage
    }
    genreBreakdown {
      genre
      averageRating
      reviewCount
    }
    monthlyStats {
      month
      reviewCount
      averageRating
    }
  }
}

# Test nested relationships
query TestNestedRelations {
  # Get user with all related data
  user(id: "123") {
    watchlist {
      movie {
        reviews {
          user {
            watchlist {
              movie {
                reviews {
                  user {
                    username
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  # Get movie with all related data
  movie(id: "123") {
    reviews {
      user {
        reviews {
          movie {
            reviews {
              user {
                reviews {
                  movie {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

// Subscription examples (if implemented)
const subscriptionExamples = `
# Real-time updates
subscription OnMovieUpdate {
  movieUpdated {
    id
    title
    rating
    reviews {
      id
      rating
      content
    }
  }
}

# User activity feed
subscription OnUserActivity {
  userActivity {
    type
    timestamp
    movie {
      id
      title
    }
    user {
      username
    }
  }
}

# Review notifications
subscription OnNewReview {
  reviewCreated {
    id
    rating
    content
    movie {
      id
      title
    }
    user {
      username
    }
  }
}
`;

// Export all advanced examples
export const advancedExamples = {
	nestedQueries,
	errorHandlingExamples,
	performanceExamples,
	subscriptionExamples,
};
