import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Movie, TvShow } from '../../types';
import RatingStars from '../ui/RatingStars';

interface AddReviewModalProps {
  media: Movie | TvShow;
  onClose: () => void;
  onSubmit: (rating: number, review: string, containsSpoilers: boolean) => void;
  initialRating?: number | null;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ 
  media, 
  onClose, 
  onSubmit,
  initialRating = null 
}) => {
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [review, setReview] = useState<string>('');
  const [containsSpoilers, setContainsSpoilers] = useState<boolean>(false);
  const [titleFocused, setTitleFocused] = useState<boolean>(false);
  const [reviewCharCount, setReviewCharCount] = useState<number>(0);

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setReview(text);
    setReviewCharCount(text.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }
    onSubmit(rating, review, containsSpoilers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Write Your Review</h2>
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Rating
                </label>
                <RatingStars rating={rating} onRatingChange={setRating} size="large" />
                {rating === 0 && (
                  <p className="text-sm text-red-400 mt-1">Please select a rating</p>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Your Review
                  </label>
                  <span className={`text-xs ${reviewCharCount > 1000 ? 'text-red-400' : 'text-gray-400'}`}>
                    {reviewCharCount}/1000
                  </span>
                </div>
                <div 
                  className={`border rounded-md transition-all duration-200 ${
                    titleFocused 
                      ? 'border-blue-500 ring-1 ring-blue-500' 
                      : 'border-gray-600'
                  }`}
                >
                  <textarea
                    value={review}
                    onChange={handleReviewChange}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    className="w-full bg-gray-700 rounded-md px-3 py-2 text-white min-h-[150px] focus:outline-none"
                    placeholder="Share your thoughts about this title..."
                    maxLength={1000}
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="spoilers"
                  checked={containsSpoilers}
                  onChange={(e) => setContainsSpoilers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <label htmlFor="spoilers" className="ml-2 text-sm text-gray-300">
                  This review contains spoilers
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
                disabled={rating === 0}
              >
                <Check className="mr-2 h-5 w-5" />
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;