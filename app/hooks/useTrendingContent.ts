import { useState, useEffect } from 'react';
import { Media } from '@/types/Media';

// Mock data for UI development
const TRENDING_MOVIES: Media[] = [
  {
    id: 1,
    title: 'Dune: Part Two',
    posterUrl: 'https://images.pexels.com/photos/4170628/pexels-photo-4170628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Deadpool & Wolverine',
    posterUrl: 'https://images.pexels.com/photos/7234213/pexels-photo-7234213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
    rating: 4.2,
  },
  {
    id: 3,
    title: 'The Fall Guy',
    posterUrl: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
    rating: 3.8,
  },
  {
    id: 4,
    title: 'Furiosa',
    posterUrl: 'https://images.pexels.com/photos/1716153/pexels-photo-1716153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
    rating: 4.0,
  },
  {
    id: 5,
    title: 'Godzilla x Kong',
    posterUrl: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'movie',
    year: 2024,
    rating: 3.9,
  },
];

const TRENDING_SHOWS: Media[] = [
  {
    id: 6,
    title: 'House of the Dragon',
    posterUrl: 'https://images.pexels.com/photos/2078266/pexels-photo-2078266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.5,
  },
  {
    id: 7,
    title: 'The Boys',
    posterUrl: 'https://images.pexels.com/photos/4170653/pexels-photo-4170653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.7,
  },
  {
    id: 8,
    title: 'Bridgerton',
    posterUrl: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.1,
  },
  {
    id: 9,
    title: 'The Bear',
    posterUrl: 'https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.8,
  },
  {
    id: 10,
    title: 'Fallout',
    posterUrl: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'tv',
    year: 2024,
    rating: 4.3,
  },
];

export function useTrendingContent() {
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [trendingShows, setTrendingShows] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from TMDB API here
        // const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=YOUR_API_KEY');
        // const data = await response.json();
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTrendingMovies(TRENDING_MOVIES);
        setTrendingShows(TRENDING_SHOWS);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch trending content. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { trendingMovies, trendingShows, isLoading, error };
}