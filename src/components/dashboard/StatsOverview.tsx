import React from 'react';
import { BarChart3, Clock, Film, Tv, Star } from 'lucide-react';
import { mockGetUserStats } from '../../utils/mockData';

const StatsOverview: React.FC = () => {
  const stats = mockGetUserStats();
  
  // Calculate hours and minutes from total minutes
  const hours = Math.floor(stats.totalWatchTime / 60);
  const minutes = stats.totalWatchTime % 60;
  
  // Format time string
  const timeString = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
          Your Stats
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Total Watch Time</span>
          </div>
          <p className="text-xl font-semibold">{timeString}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            <span className="text-sm">Average Rating</span>
          </div>
          <p className="text-xl font-semibold">{stats.averageRating.toFixed(1)}/5</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Film className="h-4 w-4 mr-1" />
            <span className="text-sm">Movies Watched</span>
          </div>
          <p className="text-xl font-semibold">{stats.moviesWatched}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Tv className="h-4 w-4 mr-1" />
            <span className="text-sm">TV Episodes</span>
          </div>
          <p className="text-xl font-semibold">{stats.episodesWatched}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Favorite Genres</h3>
        <div className="space-y-2">
          {stats.favoriteGenres.map((genre) => (
            <div key={genre.genre} className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(genre.count / stats.favoriteGenres[0].count) * 100}%` }}
                ></div>
              </div>
              <span className="min-w-[60px] text-right text-sm ml-2">{genre.genre}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Weekly Activity</h3>
        <div className="flex items-end h-16 space-x-1">
          {stats.weeklyActivity.map((week, index) => {
            const maxMinutes = Math.max(...stats.weeklyActivity.map(w => w.minutes));
            const height = (week.minutes / maxMinutes) * 100;
            
            return (
              <div 
                key={week.week} 
                className="flex-1 bg-teal-800 rounded-t group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-1 whitespace-nowrap">
                  {week.minutes} min
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex text-xs text-gray-500 mt-1 justify-between">
          <span>Week 1</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;