import { useState, useEffect } from 'react';

// Mock data for UI development
const USER_PROFILE = {
  id: 'user123',
  name: 'Alex Johnson',
  username: 'alexj',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  watched: 142,
  followers: 386,
  following: 245,
};

const USER_STATS = {
  totalWatchTime: '286h',
  averageRating: 4.2,
  moviesWatched: 98,
  showsWatched: 44,
  watchTimeByMonth: [
    { month: 'Jan', hours: 12 },
    { month: 'Feb', hours: 18 },
    { month: 'Mar', hours: 8 },
    { month: 'Apr', hours: 15 },
    { month: 'May', hours: 22 },
    { month: 'Jun', hours: 30 },
  ],
  topGenres: [
    { name: 'Sci-Fi', count: 42, color: '#6366f1' },
    { name: 'Drama', count: 37, color: '#a855f7' },
    { name: 'Action', count: 26, color: '#eab308' },
    { name: 'Comedy', count: 18, color: '#22c55e' },
    { name: 'Thriller', count: 14, color: '#ef4444' },
  ],
};

export function useProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your backend API
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setUser(USER_PROFILE);
        setStats(USER_STATS);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, stats, isLoading, error };
}