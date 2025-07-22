export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  averageRating: number;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface BookWithReviews {
  book: Book;
  reviews: Review[];
}

export interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  totalReviews: number;
  topBooks: Book[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}