import React from 'react';
import { Link } from 'react-router-dom';
import { Rewind as ClockRewind } from 'lucide-react';
import { useEntryContext } from '../../context/EntryContext';
import MediaCard from '../media/MediaCard';

const RecentlyWatchedSection: React.FC = () => {
  const { recentlyWatched } = useEntryContext();

  if (recentlyWatched.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ClockRewind className="mr-2 h-5 w-5 text-green-400" />
          Recently Watched
        </h2>
        <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentlyWatched.map((entry) => (
          <MediaCard key={entry.id} media={entry} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyWatchedSection;