import React from 'react';
import { Book, User, LogOut, Settings, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  onAuthClick: () => void;
  onAddBookClick?: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAuthClick,
  onAddBookClick,
  currentView,
  onViewChange,
}) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onViewChange('books')}
            >
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Book className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">BookReview</span>
            </div>
            
            {user && (
              <div className="hidden md:flex items-center space-x-2 ml-12">
                <Button
                  variant={currentView === 'books' ? 'primary' : 'ghost'}
                  onClick={() => onViewChange('books')}
                  size="sm"
                  className="rounded-full"
                >
                  Browse Books
                </Button>
                {user.isAdmin && (
                  <>
                    <Button
                      variant={currentView === 'admin' ? 'primary' : 'ghost'}
                      onClick={() => onViewChange('admin')}
                      size="sm"
                      className="rounded-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={onAddBookClick}
                      size="sm"
                      className="rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                  <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">{user.username}</span>
                  {user.isAdmin && (
                    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-sm">
                      Admin
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={logout}
                  size="sm"
                  className="rounded-full p-3"
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                </Button>
              </>
            ) : (
              <Button onClick={onAuthClick} className="rounded-full px-8">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};