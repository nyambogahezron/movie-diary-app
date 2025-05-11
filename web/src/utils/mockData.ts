import { MediaEntry, Movie, TvShow, WatchStatus, Stats } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for testing

export const mockGetEntries = (): MediaEntry[] => {
  return [
    {
      id: '1',
      title: 'Inception',
      type: 'movie',
      poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 5,
      status: WatchStatus.COMPLETED,
      dateWatched: '2023-05-15',
      review: 'Mind-blowing concept and execution!',
      notes: 'Need to rewatch to understand it better',
      rewatches: 2,
      private: false,
      favorite: true,
      createdAt: '2023-05-15T10:30:00Z',
      updatedAt: '2023-05-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Stranger Things',
      type: 'tv',
      poster: 'https://images.pexels.com/photos/4666749/pexels-photo-4666749.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/2111127/pexels-photo-2111127.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4,
      status: WatchStatus.WATCHING,
      progress: 75,
      rewatches: 0,
      private: false,
      favorite: false,
      createdAt: '2023-06-20T14:15:00Z',
      updatedAt: '2023-06-20T14:15:00Z'
    },
    {
      id: '3',
      title: 'The Shawshank Redemption',
      type: 'movie',
      poster: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/1738627/pexels-photo-1738627.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 5,
      status: WatchStatus.COMPLETED,
      dateWatched: '2023-04-10',
      review: 'One of the greatest films ever made.',
      notes: 'Must-rewatch annually',
      rewatches: 3,
      private: false,
      favorite: true,
      createdAt: '2023-04-10T20:45:00Z',
      updatedAt: '2023-04-10T20:45:00Z'
    },
    {
      id: '4',
      title: 'Breaking Bad',
      type: 'tv',
      poster: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 5,
      status: WatchStatus.COMPLETED,
      dateWatched: '2023-03-22',
      rewatches: 1,
      private: false,
      favorite: true,
      createdAt: '2023-03-22T11:10:00Z',
      updatedAt: '2023-03-22T11:10:00Z'
    },
    {
      id: '5',
      title: 'Dune',
      type: 'movie',
      poster: 'https://images.pexels.com/photos/3617483/pexels-photo-3617483.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/2499580/pexels-photo-2499580.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4,
      status: WatchStatus.COMPLETED,
      dateWatched: '2023-07-05',
      rewatches: 0,
      private: false,
      favorite: false,
      createdAt: '2023-07-05T19:30:00Z',
      updatedAt: '2023-07-05T19:30:00Z'
    },
    {
      id: '6',
      title: 'The Mandalorian',
      type: 'tv',
      poster: 'https://images.pexels.com/photos/10353805/pexels-photo-10353805.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/6447217/pexels-photo-6447217.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4,
      status: WatchStatus.WATCHING,
      progress: 50,
      rewatches: 0,
      private: false,
      favorite: false,
      createdAt: '2023-06-15T08:20:00Z',
      updatedAt: '2023-06-15T08:20:00Z'
    },
    {
      id: '7',
      title: 'The Dark Knight',
      type: 'movie',
      poster: 'https://images.pexels.com/photos/3132388/pexels-photo-3132388.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/3131971/pexels-photo-3131971.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 5,
      status: WatchStatus.COMPLETED,
      dateWatched: '2023-02-18',
      review: 'Ledger\'s performance is legendary',
      rewatches: 5,
      private: false,
      favorite: true,
      createdAt: '2023-02-18T21:40:00Z',
      updatedAt: '2023-02-18T21:40:00Z'
    },
    {
      id: '8',
      title: 'Oppenheimer',
      type: 'movie',
      poster: 'https://images.pexels.com/photos/14011035/pexels-photo-14011035.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/12903712/pexels-photo-12903712.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 0,
      status: WatchStatus.PLANNING,
      rewatches: 0,
      private: false,
      favorite: false,
      createdAt: '2023-07-25T15:05:00Z',
      updatedAt: '2023-07-25T15:05:00Z'
    },
    {
      id: '9',
      title: 'Succession',
      type: 'tv',
      poster: 'https://images.pexels.com/photos/7549587/pexels-photo-7549587.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backdrop: 'https://images.pexels.com/photos/7549188/pexels-photo-7549188.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 5,
      status: WatchStatus.WATCHING,
      progress: 25,
      rewatches: 0,
      private: false,
      favorite: false,
      createdAt: '2023-08-01T22:30:00Z',
      updatedAt: '2023-08-01T22:30:00Z'
    }
  ];
};

export const mockGetMovieById = (id: string): Movie => {
  // In a real app, this would be an API call
  return {
    id,
    title: 'Inception',
    poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1600',
    backdrop: 'https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    releaseDate: '2010-07-16',
    runtime: 148,
    genres: ['Action', 'Science Fiction', 'Adventure', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy', 'Ken Watanabe'],
    rating: 8.4
  };
};

export const mockGetTvShowById = (id: string): TvShow => {
  // In a real app, this would be an API call
  return {
    id,
    title: 'Breaking Bad',
    poster: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=1600',
    backdrop: 'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    firstAirDate: '2008-01-20',
    lastAirDate: '2013-09-29',
    seasons: 5,
    episodes: 62,
    genres: ['Drama', 'Crime', 'Thriller'],
    creator: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris', 'Betsy Brandt'],
    rating: 9.5,
    status: 'Ended'
  };
};

export const mockGetUserStats = (): Stats => {
  return {
    totalWatchTime: 15240, // Minutes
    moviesWatched: 67,
    episodesWatched: 432,
    tvShowsCompleted: 14,
    averageRating: 3.8,
    favoriteGenres: [
      { genre: 'Drama', count: 28 },
      { genre: 'Sci-Fi', count: 19 },
      { genre: 'Thriller', count: 12 }
    ],
    weeklyActivity: [
      { week: '2023-01-01', minutes: 480 },
      { week: '2023-01-08', minutes: 360 },
      { week: '2023-01-15', minutes: 240 },
      { week: '2023-01-22', minutes: 600 },
    ],
    watchHistory: [
      { date: '2023-01-01', count: 2 },
      { date: '2023-01-05', count: 1 },
      { date: '2023-01-10', count: 3 },
      { date: '2023-01-15', count: 1 },
    ]
  };
};

export const mockSearch = (
  query: string, 
  type: 'all' | 'movie' | 'tv' = 'all',
  sortBy: 'relevance' | 'rating' | 'newest' = 'relevance'
): MediaEntry[] => {
  // Filter by query and type
  let results = mockGetEntries().filter(entry => {
    const matchesQuery = query === '' || entry.title.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === 'all' || entry.type === type;
    return matchesQuery && matchesType;
  });
  
  // Sort results
  switch (sortBy) {
    case 'rating':
      results = results.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      results = results.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      // For relevance, we would implement a more complex algorithm
      // This is a simple implementation for demo purposes
      if (query) {
        results = results.sort((a, b) => {
          const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
          const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
          return bStartsWith - aStartsWith;
        });
      }
      break;
  }
  
  return results;
};