import { useState, useEffect } from 'react';
import { Media } from '@/types/Media';

// Mock data for UI development
const WATCHED_CONTENT: Media[] = [
  {
    id: 101,
    title: 'Oppenheimer',
    posterUrl: 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2023,
    rating: 4.8,
  },
  {
    id: 102,
    title: 'The Penguin',
    posterUrl: 'https://images.pexels.com/photos/4011115/pexels-photo-4011115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.6,
  },
  {
    id: 103,
    title: 'Animal',
    posterUrl: 'https://images.pexels.com/photos/2341290/pexels-photo-2341290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2023,
    rating: 3.9,
  },
];

const WATCHLIST_CONTENT: Media[] = [
  {
    id: 201,
    title: 'Joker: Folie à Deux',
    posterUrl: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
  },
  {
    id: 202,
    title: 'The Acolyte',
    posterUrl: 'https://images.pexels.com/photos/3601451/pexels-photo-3601451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
  },
];

const IN_PROGRESS_CONTENT: Media[] = [
  {
    id: 301,
    title: 'Stranger Things',
    posterUrl: 'https://images.pexels.com/photos/4035587/pexels-photo-4035587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    progress: {
      current: 3,
      total: 9,
    },
  },
  {
    id: 302,
    title: 'Interstellar',
    posterUrl: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2014,
    progress: {
      current: 90,
      total: 169,
    },
  },
];

export function useLibrary() {
  const [watchedContent, setWatchedContent] = useState<Media[]>([]);
  const [watchlistContent, setWatchlistContent] = useState<Media[]>([]);
  const [inProgressContent, setInProgressContent] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your backend/database
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setWatchedContent(WATCHED_CONTENT);
        setWatchlistContent(WATCHLIST_CONTENT);
        setInProgressContent(IN_PROGRESS_CONTENT);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch your library. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { watchedContent, watchlistContent, inProgressContent, isLoading, error };
}