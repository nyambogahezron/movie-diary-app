export interface User {
  id: string;
  email: string;
  profiles: Profile[];
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genre: string[];
  maturityRating: string;
  duration: string;
  thumbnailUrl: string;
  backdropUrl: string;
  videoUrl: string;
  type: 'movie' | 'series';
  trending?: boolean;
  new?: boolean;
}

export interface Genre {
  id: string;
  name: string;
}

export interface WatchHistoryItem {
  contentId: string;
  profileId: string;
  progress: number;
  timestamp: number;
}

export interface WatchlistItem {
  contentId: string;
  profileId: string;
  addedAt: number;
}