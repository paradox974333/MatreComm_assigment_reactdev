import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { systemApi } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { BookGrid } from './components/books/BookGrid';
import { BookDetail } from './components/books/BookDetail';
import { AddBookModal } from './components/books/AddBookModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Book } from './types';

const AppContent: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'books' | 'admin'>('books');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { user, loading } = useAuth();

  // Check server health on component mount
  React.useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await systemApi.healthCheck();
        setServerStatus('online');
      } catch {
        setServerStatus('offline');
      }
    };
    
    checkServerHealth();
  }, []);

  const handleBookAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleReviewAdded = () => {
    // 1. Go back to the main book list view
    setSelectedBook(null); 
    
    // 2. Tell the BookGrid to refetch its data to get the new average rating
    setRefreshTrigger(prev => prev + 1);
    window.location.reload(); // Force full page reload after review action to ensure updates
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  // Show server status if offline
  if (serverStatus === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 border border-red-300 rounded-3xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Server Offline</h2>
            <p className="text-red-700 mb-6">
              Unable to connect to the backend server at http://localhost:5000
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Server Status Indicator */}
      {serverStatus === 'online' && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
            Server Online
          </div>
        </div>
      )}
      
      <Navbar
        onAuthClick={() => setAuthModalOpen(true)}
        onAddBookClick={() => setAddBookModalOpen(true)}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view as 'books' | 'admin');
          setSelectedBook(null);
        }}
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {selectedBook ? (
          <BookDetail
            book={selectedBook}
            onBack={() => setSelectedBook(null)}
            onReviewAdded={handleReviewAdded} // Fixed: Pass the actual handleReviewAdded function
          />
        ) : currentView === 'admin' && user?.isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
                Discover Your Next Great Read
              </h1>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
                Explore book reviews from fellow readers and share your own thoughts
                on the books you love.
              </p>
            </div>
            
            <BookGrid
              onBookSelect={setSelectedBook}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {user?.isAdmin && (
        <AddBookModal
          isOpen={addBookModalOpen}
          onClose={() => setAddBookModalOpen(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
