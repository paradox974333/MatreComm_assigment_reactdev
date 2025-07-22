import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageCircle, Star } from 'lucide-react';
import { AdminStats } from '../../types';
import { adminApi, ApiError } from '../../services/api';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { StarRating } from '../ui/StarRating';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await adminApi.getStats();
        setStats(statsData);
      } catch (err) {
        if (err instanceof ApiError) {
          // Handle specific admin errors
          if (err.status === 401) {
            setError('Please log in to view admin dashboard');
          } else if (err.status === 403) {
            setError('Access denied - admin privileges required');
          } else {
            setError(err.message);
          }
        } else {
          setError('Failed to load admin statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Failed to load statistics'}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: MessageCircle,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-xl font-medium">
          Overview of your book review platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.topBooks.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mr-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              Top Rated Books
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.topBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{book.author}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StarRating rating={book.averageRating} size="sm" />
                    <span className="text-sm font-bold text-gray-800 bg-white px-3 py-1 rounded-full shadow-sm">
                      {book.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};