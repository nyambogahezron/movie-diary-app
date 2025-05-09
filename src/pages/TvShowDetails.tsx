import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Star, MessageSquare, Heart, Share2, Plus, CheckCircle, Edit, PlayCircle as CirclePlay } from 'lucide-react';
import { TvShow, Season } from '../types';
import AddToWatchlistModal from '../components/media/AddToWatchlistModal';
import AddReviewModal from '../components/media/AddReviewModal';
import { mockGetTvShowById } from '../utils/mockData';
import RatingStars from '../components/ui/RatingStars';

const TvShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTvShow] = useState<TvShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes'>('overview');
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const fetchTvShow = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const data = mockGetTvShowById(id || '');
        setTvShow(data);
        
        // Create mock seasons
        const mockSeasons: Season[] = [];
        for (let i = 1; i <= data.seasons; i++) {
          mockSeasons.push({
            id: `season-${i}`,
            seasonNumber: i,
            episodeCount: Math.floor(Math.random() * 13) + 8, // Random episode count between 8-20
            overview: `Season ${i} continues the exciting story with new challenges and developments.`,
            airDate: `${parseInt(data.firstAirDate.split('-')[0]) + i - 1}-09-15`,
            poster: `https://images.pexels.com/photos/376533/pexels-photo-376533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`
          });
        }
        setSeasons(mockSeasons);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV show:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchTvShow();
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
        <div className="animate-pulse text-white">Loading TV show details...</div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">TV show not found</h2>
          <p className="text-gray-400 mt-2">The TV show you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const currentSeason = seasons[activeSeasonIndex];

  return (
    <>
      {/* Hero section with backdrop */}
      <div 
        className="relative h-[50vh] md:h-[60vh] bg-center bg-cover"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.9)), url(${tvShow.backdrop})` 
        }}
      >
        <div className="container-custom h-full flex items-end">
          <div className="pb-8 md:pb-12 flex flex-col md:flex-row items-start md:items-end gap-6">
            <img 
              src={tvShow.poster} 
              alt={tvShow.title} 
              className="w-32 md:w-48 rounded-lg shadow-lg border-2 border-gray-800" 
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{tvShow.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm md:text-base text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{tvShow.firstAirDate} - {tvShow.lastAirDate || 'Present'}</span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-blue-900 text-blue-200 rounded-full text-xs">
                    {tvShow.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{tvShow.rating}/10</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
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
            <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
              <div className="flex border-b border-gray-700">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'overview' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'episodes' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveTab('episodes')}
                >
                  Episodes
                </button>
              </div>
              
              {activeTab === 'overview' ? (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
                  <p className="text-gray-300 leading-relaxed mb-6">{tvShow.overview}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Show Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24">First Aired:</span>
                          <span>{tvShow.firstAirDate}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24">Status:</span>
                          <span>{tvShow.status}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24">Seasons:</span>
                          <span>{tvShow.seasons}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24">Episodes:</span>
                          <span>{tvShow.episodes}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-400 w-24">Creator:</span>
                          <span>{tvShow.creator}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Cast</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {tvShow.cast.map((actor) => (
                          <div key={actor} className="text-gray-300">{actor}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">Episodes</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {tvShow.seasons} Seasons, {tvShow.episodes} Episodes
                      </p>
                    </div>
                    
                    <div>
                      <select 
                        className="bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                        value={activeSeasonIndex}
                        onChange={(e) => setActiveSeasonIndex(parseInt(e.target.value))}
                      >
                        {seasons.map((season, index) => (
                          <option key={season.id} value={index}>
                            Season {season.seasonNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {currentSeason && (
                    <div>
                      <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <img 
                          src={currentSeason.poster} 
                          alt={`Season ${currentSeason.seasonNumber}`} 
                          className="w-full md:w-40 rounded-lg"
                        />
                        <div>
                          <h3 className="text-lg font-medium">Season {currentSeason.seasonNumber}</h3>
                          <p className="text-sm text-gray-400">
                            {currentSeason.episodeCount} Episodes • Aired {currentSeason.airDate}
                          </p>
                          <p className="text-gray-300 mt-3">
                            {currentSeason.overview}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {Array.from({ length: currentSeason.episodeCount }, (_, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg transition-colors hover:bg-gray-600">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg">
                              <span className="font-medium">{i + 1}</span>
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">Episode {i + 1}</h4>
                              <p className="text-sm text-gray-400">
                                {Math.floor(Math.random() * 15) + 25} min • Aired {currentSeason.airDate.split('-')[0]}-{
                                  parseInt(currentSeason.airDate.split('-')[1]) + Math.floor(i / 4)
                                }-{
                                  parseInt(currentSeason.airDate.split('-')[2]) + (i % 7)
                                }
                              </p>
                            </div>
                            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors">
                              <CirclePlay className="h-5 w-5 text-blue-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                        Click "Write a Review" to add your thoughts about this show.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't reviewed this show yet</p>
                  <button 
                    className="mt-3 text-blue-400 hover:text-blue-300 font-medium"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Add Your Review
                  </button>
                </div>
              )}
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

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Where to Watch</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span>Netflix</span>
                  <button className="text-sm px-3 py-1 bg-red-600 text-white rounded-md">Watch</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span>Hulu</span>
                  <button className="text-sm px-3 py-1 bg-green-600 text-white rounded-md">Watch</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span>Amazon Prime</span>
                  <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md">Watch</button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Similar Shows</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <img 
                      src={`https://images.pexels.com/photos/33129${i+6}/pexels-photo-33129${i+6}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                      alt={`Similar Show ${i}`}
                      className="w-16 h-24 object-cover rounded" 
                    />
                    <div>
                      <h3 className="font-medium">Similar Show {i}</h3>
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
          media={tvShow}
          onClose={() => setShowWatchlistModal(false)}
          onAdd={() => {
            setInWatchlist(true);
            setShowWatchlistModal(false);
          }}
        />
      )}

      {showReviewModal && (
        <AddReviewModal 
          media={tvShow}
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

export default TvShowDetails;