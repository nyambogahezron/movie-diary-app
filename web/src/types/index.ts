export interface User {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  watchTime: number; // Total watch time in minutes
  entriesCount: number;
}

export interface MediaEntry {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  poster: string;
  backdrop: string;
  rating: number; // 0-5 stars
  status: WatchStatus;
  dateWatched?: string;
  review?: string;
  notes?: string;
  rewatches: number;
  progress?: number; // For TV shows, percentage watched
  private: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  releaseDate: string;
  runtime: number; // in minutes
  genres: string[];
  director: string;
  cast: string[];
  rating: number; // IMDB rating
}

export interface TvShow {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  firstAirDate: string;
  lastAirDate?: string;
  seasons: number;
  episodes: number;
  genres: string[];
  creator: string;
  cast: string[];
  rating: number; // IMDB rating
  status: 'Running' | 'Ended' | 'Cancelled';
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodeCount: number;
  overview: string;
  airDate: string;
  poster: string;
}

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  airDate: string;
  overview: string;
  stillImage: string;
  runtime: number;
}

export enum WatchStatus {
  PLANNING = 'Planning to Watch',
  WATCHING = 'Currently Watching',
  COMPLETED = 'Completed',
  PAUSED = 'Paused',
  DROPPED = 'Dropped'
}

export interface Stats {
  totalWatchTime: number; // in minutes
  moviesWatched: number;
  episodesWatched: number;
  tvShowsCompleted: number;
  averageRating: number;
  favoriteGenres: { genre: string; count: number }[];
  weeklyActivity: { week: string; minutes: number }[];
  watchHistory: { date: string; count: number }[];
}