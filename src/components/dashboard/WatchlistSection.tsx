import React from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Film, Tv, Clock } from 'lucide-react';
import { useEntryContext } from '../../context/EntryContext';

const WatchlistSection: React.FC = () => {
  const { watchlist } = useEntryContext();

  if (watchlist.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-blue-400" />
          Your Watchlist
        </h2>
        <div className="text-center py-6 text-gray-400">
          <p>Your watchlist is empty</p>
          <p className="text-sm mt-2">Add movies and TV shows you plan to watch</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-blue-400" />
          Your Watchlist
        </h2>
        <Link to="/watchlist" className="text-sm text-blue-400 hover:text-blue-300">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {watchlist.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <img 
              src={item.poster} 
              alt={item.title} 
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <Link 
                to={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                className="font-medium hover:text-blue-400 transition-colors duration-200 line-clamp-1"
              >
                {item.title}
              </Link>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                {item.type === 'movie' ? (
                  <Film className="h-3 w-3 mr-1" />
                ) : (
                  <Tv className="h-3 w-3 mr-1" />
                )}
                <span>{item.type === 'movie' ? 'Movie' : 'TV Show'}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistSection;