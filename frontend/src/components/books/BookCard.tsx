import React from 'react';
import { Book } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    // THE FIX IS HERE: Wrap the Card in a div and put the onClick on the div.
    // The div is a native element and will correctly handle the click event.
    <div onClick={onClick} className="cursor-pointer group">
      <Card>
        <div className="aspect-[3/4] overflow-hidden rounded-t-2xl relative">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-amber-600 transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-4 font-medium">{book.author}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <StarRating rating={book.averageRating} size="sm" />
            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
              {book.averageRating.toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};