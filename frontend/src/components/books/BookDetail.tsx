import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Star, MessageCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Book, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { booksApi, reviewsApi, ApiError } from '../../services/api';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';
import { ReviewForm } from './ReviewForm';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onReviewAdded: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onBack, onReviewAdded }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(book?.averageRating ?? 0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [error, setError] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null); 
  const { user } = useAuth();

  const fetchBookDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await booksApi.getById(book?._id ?? '');
      setReviews(response?.reviews ?? []);
      // FIX: The average rating is nested inside the 'book' object in the API response.
      setAverageRating(response?.book?.averageRating ?? 0);
    } catch (err) {
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (book?._id) {
      fetchBookDetails();
    }
  }, [book?._id]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    onReviewAdded();
    fetchBookDetails();
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }
    
    try {
      await reviewsApi.delete(reviewId);
      toast.success('Review deleted successfully!');
      onReviewAdded();
      fetchBookDetails();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete review.';
      toast.error(message);
    }
  };

  const userHasReviewed = reviews.some(review => review.user?._id === user?._id);
  const canShowCreateForm = user && !userHasReviewed && !showReviewForm;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="relative"><div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div><div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent absolute top-0"></div></div></div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto"><Button variant="ghost" onClick={onBack} className="mb-8 rounded-full"><ArrowLeft className="h-4 w-4 mr-2" />Back to Books</Button><div className="text-center py-16"><div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto"><p className="text-red-600 font-semibold">{error}</p></div></div></div>;
  }

  // Simple error boundary: Wrap the main render in a try-catch
  try {
    return (
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-8 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl">
              <img src={book?.image ?? ''} alt={book?.title ?? 'Book'} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                {book?.title ?? 'Untitled Book'}
              </h1>
              <p className="text-2xl text-gray-600 mb-6 font-semibold">{book?.author ?? 'Unknown Author'}</p>
              <div className="flex items-center space-x-6 mb-6">
                <StarRating rating={averageRating} size="lg" />
                <span className="text-xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-full">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{book?.description ?? 'No description available.'}</p>
            </div>

            {canShowCreateForm && (
              <Button onClick={() => setShowReviewForm(true)} className="flex items-center rounded-full px-8">
                <Plus className="h-4 w-4 mr-2" /> Write a Review
              </Button>
            )}

            {user && userHasReviewed && !showReviewForm && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center"><div className="p-2 bg-green-100 rounded-full mr-3"><Star className="h-5 w-5 text-green-600 fill-current" /></div><p className="text-green-700 font-semibold">✓ You have already reviewed this book</p></div>
              </div>
            )}
            
            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center"><div className="p-2 bg-amber-100 rounded-full mr-3"><MessageCircle className="h-5 w-5 text-amber-600" /></div><p className="text-amber-700 font-semibold">Please sign in to write a review</p></div>
              </div>
            )}
            
            {showReviewForm && (
              <ReviewForm
                bookId={book?._id ?? ''}
                reviewToEdit={editingReview ?? undefined}
                onSubmitted={handleReviewSubmitted}
                onCancel={handleCancelForm}
              />
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900"><div className="flex items-center"><MessageCircle className="h-8 w-8 mr-3 text-amber-600" />Reviews ({reviews.length})</div></h2>
          
          {reviews.length === 0 ? (
            <Card><CardContent className="py-20 text-center"><div className="space-y-4"><div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><MessageCircle className="h-8 w-8 text-gray-400" /></div><div><p className="text-gray-600 text-xl font-semibold mb-2">No reviews yet</p><p className="text-gray-500 font-medium">Be the first to share your thoughts about this book!</p></div></div></CardContent></Card>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review?._id ?? ''}>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"><span className="text-white font-bold text-sm">{review?.user?.username?.charAt(0)?.toUpperCase() ?? 'A'}</span></div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{review?.user?.username ?? 'Anonymous'}</h4>
                          <p className="text-gray-500 font-medium text-sm">{review?.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review?.rating ?? 0} size="sm" />
                        <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-full">{review?.rating ?? 0}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg pl-14">{review?.reviewText ?? 'No review text'}</p>
                    
                    {user?._id === review?.user?._id && (
                      <div className="flex items-center space-x-2 mt-4 pl-14">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(review)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review?._id ?? '')}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.error('Render error in BookDetail:', e);
    setRenderError('An unexpected error occurred while rendering the book details. Please try refreshing the page.');
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-semibold">{renderError}</p>
        </div>
      </div>
    );
  }
};