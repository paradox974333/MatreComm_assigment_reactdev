import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Star, MessageCircle } from 'lucide-react';
import { Book, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { booksApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';
import { ReviewForm } from './ReviewForm';

// 1. ADD onReviewAdded to props
interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onReviewAdded: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onBack, onReviewAdded }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchBookDetails = async () => {
    // Reset state for when a new book is selected
    setLoading(true);
    setError('');
    try {
      const response = await booksApi.getById(book._id);
      setReviews(response.reviews);
    } catch (err) {
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [book._id]);

  // 2. UPDATE handleReviewSubmitted to use the callback
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Notify the parent component to refresh its data
    onReviewAdded();
  };

  // 3. Make this check more robust with optional chaining
  const userHasReviewed = reviews.some(review => review.user?._id === user?._id);

  if (loading) {
    // ... loading spinner code (unchanged)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    // ... error display code (unchanged)
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-8 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-8 rounded-full">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-1">
          <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl">
            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
              {book.title}
            </h1>
            <p className="text-2xl text-gray-600 mb-6 font-semibold">{book.author}</p>
            <div className="flex items-center space-x-6 mb-6">
              <StarRating rating={book.averageRating} size="lg" />
              <span className="text-xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-full">
                {book.averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{book.description}</p>
          </div>

          {user ? (
            !userHasReviewed ? (
              <div className="space-y-4">
                <Button onClick={() => setShowReviewForm(!showReviewForm)} className="flex items-center rounded-full px-8">
                  <Plus className="h-4 w-4 mr-2" />
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Star className="h-5 w-5 text-green-600 fill-current" />
                  </div>
                  <p className="text-green-700 font-semibold">✓ You have already reviewed this book</p>
                </div>
              </div>
            )
          ) : (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-full mr-3">
                    <MessageCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-amber-700 font-semibold">Please sign in to write a review</p>
                </div>
              </div>
            </div>
          )}

          {showReviewForm && (
            <ReviewForm
              bookId={book._id}
              onSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          )}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 mr-3 text-amber-600" />
            Reviews ({reviews.length})
          </div>
        </h2>

        {reviews.length === 0 ? (
          // ... no reviews placeholder (unchanged)
          <Card>
            <CardContent className="py-20 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 text-xl font-semibold mb-2">No reviews yet</p>
                  <p className="text-gray-500 font-medium">Be the first to share your thoughts about this book!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              // ... review card mapping (unchanged, but robust)
              <Card key={review._id}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
                          <span className="text-white font-bold text-sm">
                            {review.user?.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {review.user?.username || 'Anonymous'}
                          </h4>
                          <p className="text-gray-500 font-medium text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-full">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg pl-14">{review.reviewText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};