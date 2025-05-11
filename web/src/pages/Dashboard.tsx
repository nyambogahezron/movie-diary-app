import React, { useState } from 'react';
import { Film, Tv, PlusCircle, List, Grid3X3 } from 'lucide-react';
import MediaCard from '../components/media/MediaCard';
import WatchlistSection from '../components/dashboard/WatchlistSection';
import RecentlyWatchedSection from '../components/dashboard/RecentlyWatchedSection';
import StatsOverview from '../components/dashboard/StatsOverview';
import { useEntryContext } from '../context/EntryContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tvshows'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { entries } = useEntryContext();

  const filteredEntries = entries.filter(entry => {
    if (activeTab === 'all') return true;
    if (activeTab === 'movies') return entry.type === 'movie';
    if (activeTab === 'tvshows') return entry.type === 'tv';
    return true;
  });

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">My Entertainment Diary</h1>
            <button className="btn btn-primary mt-4 sm:mt-0 flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Entry
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="flex space-x-2 mb-4 sm:mb-0">
                <button
                  className={`btn ${activeTab === 'all' ? 'btn-primary' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={`btn ${activeTab === 'movies' ? 'btn-primary' : 'bg-gray-700 text-gray-300'} flex items-center`}
                  onClick={() => setActiveTab('movies')}
                >
                  <Film className="mr-2 h-4 w-4" />
                  Movies
                </button>
                <button
                  className={`btn ${activeTab === 'tvshows' ? 'btn-primary' : 'bg-gray-700 text-gray-300'} flex items-center`}
                  onClick={() => setActiveTab('tvshows')}
                >
                  <Tv className="mr-2 h-4 w-4" />
                  TV Shows
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.map((entry) => (
                  <MediaCard key={entry.id} media={entry} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center bg-gray-700 p-3 rounded-lg">
                    <img 
                      src={entry.poster} 
                      alt={entry.title} 
                      className="h-16 w-12 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{entry.title}</h3>
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">{entry.type === 'movie' ? 'Movie' : 'TV Show'}</span>
                        <span>Rating: {entry.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <RecentlyWatchedSection />
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <WatchlistSection />
          <StatsOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;