import React, { useState } from 'react';
import { X, Check, Calendar } from 'lucide-react';
import { Movie, TvShow, WatchStatus } from '../../types';
import RatingStars from '../ui/RatingStars';

interface AddToWatchlistModalProps {
  media: Movie | TvShow;
  onClose: () => void;
  onAdd: () => void;
}

const AddToWatchlistModal: React.FC<AddToWatchlistModalProps> = ({ media, onClose, onAdd }) => {
  const [status, setStatus] = useState<WatchStatus>(WatchStatus.WATCHING);
  const [rating, setRating] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add to Your Diary</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <img 
              src={media.poster} 
              alt={media.title} 
              className="w-16 rounded" 
            />
            <div>
              <h3 className="font-medium">{media.title}</h3>
              <p className="text-sm text-gray-400">{('releaseDate' in media) ? media.releaseDate : media.firstAirDate}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as WatchStatus)}
                  className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  {Object.values(WatchStatus).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Rating
                </label>
                <RatingStars rating={rating} onRatingChange={setRating} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date Watched
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white min-h-[80px]"
                  placeholder="Add your personal notes about this title..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <label htmlFor="private" className="ml-2 text-sm text-gray-300">
                  Make this entry private
                </label>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-white bg-transparent hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 rounded-md text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Check className="mr-2 h-5 w-5" />
                Add to Diary
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToWatchlistModal;