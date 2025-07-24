const BASE_URL = 'https://matrecomm-assigment-reactdev.onrender.com';

/**
 * Custom error class for API-related errors.
 * Includes the HTTP status code for more specific error handling.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Retrieves the auth token from localStorage and prepares the Authorization header.
 * @returns An object containing the Authorization header or an empty object if no token is found.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * A robust response handler for fetch requests.
 * It checks for successful responses (res.ok) and parses JSON.
 * If the response is not ok, it attempts to parse a JSON error message,
 * otherwise, it throws a generic error based on the status code.
 * It also handles successful responses that might not have a JSON body (e.g., DELETE).
 * @param response - The Response object from a fetch call.
 * @returns A promise that resolves with the JSON body or an empty object.
 */
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

  // Handle successful responses that may not have a body (e.g., 204 No Content from DELETE)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return {}; // Return an empty object for non-JSON success responses
};

// =================================================================
// System API
// =================================================================
export const systemApi = {
  /**
   * Checks the health of the backend server.
   */
  healthCheck: async () => {
    const response = await fetch(`${BASE_URL}/ping`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Server is not responding');
    }
    return response.text();
  },
};

// =================================================================
// Authentication API
// =================================================================
export const authApi = {
  /**
   * Logs a user in.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  /**
   * Registers a new user.
   * @param username - The new user's username.
   * @param email - The new user's email.
   * @param password - The new user's password.
   */
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },
};

// =================================================================
// Books API
// =================================================================
export const booksApi = {
  /**
   * Fetches a list of all books.
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/api/books`);
    return handleResponse(response);
  },

  /**
   * Fetches a single book by its ID, including its reviews.
   * @param id - The ID of the book.
   */
  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/books/${id}`);
    return handleResponse(response);
  },

  /**
   * Creates a new book (Admin only).
   * @param formData - The FormData object containing book details and the image file.
   */
  create: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },
};

// =================================================================
// Reviews API
// =================================================================
export const reviewsApi = {
  /**
   * Creates a new review for a book.
   * @param bookId - The ID of the book to review.
   * @param rating - The rating from 1 to 5.
   * @param reviewText - The text content of the review.
   */
  create: async (bookId: string, rating: number, reviewText: string) => {
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

  /**
   * Updates an existing review.
   * @param reviewId - The ID of the review to update.
   * @param data - An object containing the new `rating` and/or `reviewText`.
   */
  update: async (reviewId: string, data: { rating?: number; reviewText?: string }) => {
    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Deletes a review.
   * @param reviewId - The ID of the review to delete.
   */
  delete: async (reviewId: string) => {
    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// =================================================================
// Admin API
// =================================================================
export const adminApi = {
  /**
   * Fetches dashboard statistics (Admin only).
   */
  getStats: async () => {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};