import axios from 'axios';

// Get FastAPI backend URL from environment
const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';

// Create axios instance for FastAPI backend
const api = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 30000, // 30 seconds timeout for generation requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here if needed
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      throw new Error('Backend server is not responding. Please check if the FastAPI server is running.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.detail || 'Invalid request');
        case 404:
          throw new Error('Endpoint not found');
        case 422:
          throw new Error(data.detail || 'Validation error');
        case 500:
          throw new Error('Internal server error');
        case 503:
          throw new Error('Service temporarily unavailable');
        default:
          throw new Error(data.detail || `Server error: ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Retry mechanism for failed requests
const retryRequest = async (fn, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNREFUSED' || error.response?.status >= 500)) {
      console.log(`Retrying request in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export { api, retryRequest, FASTAPI_BASE_URL };
export default api;