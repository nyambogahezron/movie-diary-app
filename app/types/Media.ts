export type Media = {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  type: 'movie' | 'tv';
  year: number;
  genres?: string[];
  rating?: number;
  description?: string;
  releaseDate?: string;
  duration?: number;
  progress?: {
    current: number;
    total: number;
  };
};