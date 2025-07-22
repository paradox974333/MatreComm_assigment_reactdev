import React, { useState } from 'react';
import { booksApi, ApiError } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onBookAdded,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('image', image);

    try {
      await booksApi.create(formDataToSend);
      onBookAdded();
      onClose();
      setFormData({ title: '', author: '', description: '' });
      setImage(null);
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific error cases for book creation
        if (err.status === 401) {
          setError('Please log in to add books');
        } else if (err.status === 403) {
          setError('Only administrators can add books');
        } else if (err.status === 400) {
          setError('Please check that all fields are filled and image is valid');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to add book');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Book">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <Input
          label="Author"
          type="text"
          value={formData.author}
          onChange={(e) =>
            setFormData({ ...formData, author: e.target.value })
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding Book...' : 'Add Book'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};