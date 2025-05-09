import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Star, MessageSquare, Heart, Share2, Plus, CheckCircle, Edit } from 'lucide-react';
import { Movie } from '../types';
import AddToWatchlistModal from '../components/media/AddToWatchlistModal';
import AddReviewModal from '../components/media/AddReviewModal';
import { mockGetMovieById } from '../utils/mockData';
import RatingStars from '../components/ui/RatingStars';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const data = mockGetMovieById(id || '');
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleWatchlist = () => {
    setInWatchlist(!inWatchlist);
  };

  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-pulse text-white">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Movie not found</h2>
          <p className="text-gray-400 mt-2">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero section with backdrop */}
      <div 
        className="relative h-[50vh] md:h-[60vh] bg-center bg-cover"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.9)), url(${movie.backdrop})` 
        }}
      >
        <div className="container-custom h-full flex items-end">
          <div className="pb-8 md:pb-12 flex flex-col md:flex-row items-start md:items-end gap-6">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-32 md:w-48 rounded-lg shadow-lg border-2 border-gray-800" 
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm md:text-base text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{movie.releaseDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{movie.rating}/10</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <section className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Rating & Review</h2>
                <button
                  className="btn btn-primary text-sm flex items-center"
                  onClick={() => setShowReviewModal(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Write a Review
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-300">Your Rating:</span>
                  <RatingStars 
                    rating={userRating || 0} 
                    onRatingChange={handleRatingChange} 
                  />
                </div>
              </div>

              {userRating ? (
                <div className="border border-gray-700 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="User Avatar" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Your Review</h4>
                        <span className="ml-2 text-sm text-gray-400">2 days ago</span>
                      </div>
                      <div className="flex items-center mt-1 mb-2">
                        <RatingStars rating={userRating} readonly />
                      </div>
                      <p className="text-gray-300">
                        Click "Write a Review" to add your thoughts about this movie.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't reviewed this movie yet</p>
                  <button 
                    className="mt-3 text-blue-400 hover:text-blue-300 font-medium"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Add Your Review
                  </button>
                </div>
              )}
            </section>

            <section className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
              <div className="mb-4">
                <h3 className="text-gray-400 text-sm mb-2">Director</h3>
                <p className="text-white">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.cast.slice(0, 6).map((actor) => (
                    <div key={actor} className="text-white">{actor}</div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  className={`btn flex items-center ${inWatchlist ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={toggleWatchlist}
                >
                  {inWatchlist ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </button>
                <button 
                  className={`btn flex items-center ${isFavorite ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </button>
                <button className="btn bg-gray-700 text-gray-300 flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </button>
              </div>

              <button 
                className="w-full btn btn-primary text-center flex justify-center items-center py-3"
                onClick={() => setShowWatchlistModal(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add to Your Diary
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Similar Movies</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <img 
                      src={`https://images.pexels.com/photos/33129${i+2}/pexels-photo-33129${i+2}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                      alt={`Similar Movie ${i}`}
                      className="w-16 h-24 object-cover rounded" 
                    />
                    <div>
                      <h3 className="font-medium">Similar Movie {i}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        <span>{(Math.random() * 2 + 3).toFixed(1)}/5</span>
                      </div>
                      <button className="mt-1 text-sm text-blue-400 hover:text-blue-300">
                        + Add to Watchlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWatchlistModal && (
        <AddToWatchlistModal 
          media={movie}
          onClose={() => setShowWatchlistModal(false)}
          onAdd={() => {
            setInWatchlist(true);
            setShowWatchlistModal(false);
          }}
        />
      )}

      {showReviewModal && (
        <AddReviewModal 
          media={movie}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(rating, review) => {
            setUserRating(rating);
            setShowReviewModal(false);
          }}
          initialRating={userRating}
        />
      )}
    </>
  );
};

export default MovieDetails;