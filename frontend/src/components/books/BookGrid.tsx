import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Book } from '../../types';
import { booksApi } from '../../services/api';
import { BookCard } from './BookCard';
import { Input } from '../ui/Input';

interface BookGridProps {
  onBookSelect: (book: Book) => void;
  refreshTrigger: number;
}

export const BookGrid: React.FC<BookGridProps> = ({ onBookSelect, refreshTrigger }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const booksData = await booksApi.getAll();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [refreshTrigger]);

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        <Input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-14 py-5 text-lg rounded-2xl shadow-lg border-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
            <div className="p-4 bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              {searchTerm ? 'No books found matching your search.' : 'No books available yet.'}
            </p>
            {searchTerm && (
              <p className="text-gray-500 mt-2">
                Try searching for a different title or author.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => onBookSelect(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};