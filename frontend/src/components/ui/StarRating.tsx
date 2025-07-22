import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              'transition-colors',
              interactive && 'hover:scale-110 transform transition-transform cursor-pointer',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? 'text-amber-400 fill-current' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};