const BASE_URL = 'http://localhost:5000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If response is not JSON, use status-based messages
      switch (response.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - please log in';
          break;
        case 403:
          errorMessage = 'Forbidden - insufficient permissions';
          break;
        case 404:
          errorMessage = 'Not found';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
        default:
          errorMessage = 'Network error';
      }
    }
    
    throw new ApiError(response.status, errorMessage);
  }
  return response.json();
};

// System API
export const systemApi = {
  healthCheck: async () => {
    const response = await fetch(`${BASE_URL}/ping`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Server is not responding');
    }
    return response.text();
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },
};

// Books API
export const booksApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/api/books`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/books/${id}`);
    return handleResponse(response);
  },

  create: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  addReview: async (bookId: string, rating: number, reviewText: string) => {
    const response = await fetch(`${BASE_URL}/api/books/${bookId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ rating, reviewText }),
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
