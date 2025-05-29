import { MovieReview } from '../helpers/MovieReview';
import { Movie } from '../helpers/Movie';
import { 
  MovieReview as MovieReviewType, 
  MovieReviewInput, 
  User, 
  MovieReviewWithDetails 
} from '../types';

// Define error classes
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class DuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateError';
  }
}

export class MovieReviewService {
  static async addReview(movieId: number, input: MovieReviewInput, user: User): Promise<MovieReviewType> {
    // Validate that the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Check if the user already has a review for this movie
    const existingReview = await MovieReview.findByUserAndMovie(user.id, movieId);
    if (existingReview) {
      throw new DuplicateError('You have already reviewed this movie');
    }

    // Create the review
    return MovieReview.create({
      ...input,
      userId: user.id,
      movieId,
    });
  }

  static async updateReview(
    id: number,
    input: Partial<MovieReviewInput>,
    user: User
  ): Promise<MovieReviewType> {
    // Get the review and check if it belongs to the user
    const review = await MovieReview.findById(id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== user.id) {
      throw new AuthorizationError(
        'You do not have permission to update this review'
      );
    }

    // Update the review
    await MovieReview.update(id, input);

    // Return the updated review
    const updated = await MovieReview.findById(id);
    if (!updated) {
      throw new NotFoundError('Updated review not found');
    }

    return updated;
  }

  static async deleteReview(id: number, user: User): Promise<void> {
    // Get the review and check if it belongs to the user
    const review = await MovieReview.findById(id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== user.id) {
      throw new AuthorizationError(
        'You do not have permission to delete this review'
      );
    }

    // Delete the review
    await MovieReview.delete(id);
  }

  static async getReview(id: number, user: User): Promise<MovieReviewType> {
    // Get the review
    const review = await MovieReview.findById(id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if the review is public or belongs to the user
    if (!review.isPublic && review.userId !== user.id) {
      throw new AuthorizationError(
        'You do not have permission to view this review'
      );
    }

    return review;
  }

  static async getMovieReviews(movieId: number, user: User): Promise<MovieReviewWithDetails[]> {
    // Validate that the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Get reviews with user details
    // If the current user owns the movie, include private reviews
    const includePrivate = movie.userId === user.id;
    const reviewsWithDetails = await MovieReview.getReviewsWithUserDetails(movieId, includePrivate);

    // Format the response
    return reviewsWithDetails.map((review: any) => ({
      id: review.id,
      userId: review.user_id,
      movieId: review.movie_id,
      content: review.content,
      rating: review.rating,
      isPublic: Boolean(review.is_public),
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      user: {
        id: review.user_id,
        username: review.username,
        avatar: review.avatar,
      }
    }));
  }

  static async getUserReviews(user: User): Promise<MovieReviewType[]> {
    return MovieReview.findByUserId(user.id);
  }
}
