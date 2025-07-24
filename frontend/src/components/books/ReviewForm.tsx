import React, { useState, useEffect } from 'react';
import { Edit, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewsApi, ApiError } from '../../services/api'; // Use the new reviewsApi
import { Review } from '../../types'; // Import the Review type
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

interface ReviewFormProps {
  bookId: string;
  reviewToEdit?: Review; // Optional prop for editing an existing review
  onSubmitted: () => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  reviewToEdit,
  onSubmitted,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!reviewToEdit;

  // Pre-fill the form if we are editing
  useEffect(() => {
    if (isEditing) {
      setRating(reviewToEdit.rating);
      setReviewText(reviewToEdit.reviewText);
    }
  }, [reviewToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        // Call the update API if editing
        await reviewsApi.update(reviewToEdit._id, { rating, reviewText });
        toast.success('Review updated successfully!');
      } else {
        // Call the create API if creating a new review
        await reviewsApi.create(bookId, rating, reviewText);
        toast.success('Review submitted successfully!');
      }
      onSubmitted();
      window.location.reload(); // Force a full page reload after successful submission
    } catch (err) {
      if (err instanceof ApiError) {
        const message = err.status === 400 && !isEditing
          ? 'You have already reviewed this book.'
          : err.message;
        setError(message);
        toast.error(message);
      } else {
        const message = 'An unknown error occurred.';
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mr-3">
            {isEditing ? (
              <Edit className="h-6 w-6 text-white" />
            ) : (
              <Plus className="h-6 w-6 text-white" />
            )}
          </div>
          {isEditing ? 'Edit Your Review' : 'Share Your Thoughts'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Rating
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                interactive
                size="lg"
              />
              {rating > 0 && (
                <span className="text-lg font-bold text-gray-800 bg-amber-100 px-3 py-1 rounded-full">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:border-amber-400 bg-gray-50/50 focus:bg-white resize-none text-lg"
              placeholder="Share your thoughts about this book..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="px-8">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
