import React, { useState } from 'react';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import MediaCard from '../components/media/MediaCard';
import { mockSearch } from '../utils/mockData';
import { MediaEntry } from '../types';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeType, setActiveType] = useState<'all' | 'movie' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest'>('relevance');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const results = mockSearch(searchQuery, activeType, sortBy);
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Discover Movies & TV Shows</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a movie or TV show..."
                  className="w-full bg-gray-700 border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary whitespace-nowrap"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                <button 
                  type="button" 
                  className="btn bg-gray-700 text-gray-300 hover:bg-gray-600"
                  onClick={toggleFilters}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
          
          {showFilters && (
            <div className="p-4 bg-gray-700 rounded-lg mb-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-300 mb-2 flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter By Type
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded ${activeType === 'all' ? 'bg-blue-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                      onClick={() => setActiveType('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${activeType === 'movie' ? 'bg-blue-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                      onClick={() => setActiveType('movie')}
                    >
                      Movies
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${activeType === 'tv' ? 'bg-blue-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                      onClick={() => setActiveType('tv')}
                    >
                      TV Shows
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-300 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-600 border-gray-500 text-white rounded px-3 py-1"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.map((result) => (
                  <MediaCard key={result.id} media={result} />
                ))}
              </div>
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try different keywords or check the spelling</p>
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mockSearch('', 'movie', 'rating').slice(0, 4).map((movie) => (
                <MediaCard key={movie.id} media={movie} />
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Trending TV Shows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mockSearch('', 'tv', 'rating').slice(0, 4).map((show) => (
                <MediaCard key={show.id} media={show} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Search;