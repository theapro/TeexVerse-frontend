import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Custom hook for handling API errors consistently
 */
export const useApiError = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  /**
   * Handle API errors with consistent formatting
   * @param {Error} error - The error object
   * @param {string} fallbackMessage - Fallback message if error is not recognizable
   */
  const handleError = useCallback((error, fallbackMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
    console.error('API Error:', error);

    let errorMessage = fallbackMessage;

    if (error) {
      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      }
      // Handle timeout errors
      else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
      }
      // Handle rate limiting
      else if (error.response?.status === 429) {
        errorMessage = ERROR_MESSAGES.RATE_LIMIT_ERROR;
      }
      // Handle validation errors
      else if (error.response?.status === 400 || error.response?.status === 422) {
        errorMessage = error.response.data?.detail || ERROR_MESSAGES.VALIDATION_ERROR;
      }
      // Handle server errors
      else if (error.response?.status >= 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }
      // Use error message if available
      else if (error.message) {
        errorMessage = error.message;
      }
    }

    setError(errorMessage);
    setIsError(true);
  }, []);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * Wrapper function for API calls with error handling
   * @param {Function} apiCall - The API function to call
   * @param {string} fallbackMessage - Custom error message
   * @returns {Promise} The result of the API call or null if error
   */
  const withErrorHandling = useCallback(async (apiCall, fallbackMessage) => {
    try {
      clearError();
      return await apiCall();
    } catch (error) {
      handleError(error, fallbackMessage);
      return null;
    }
  }, [handleError, clearError]);

  /**
   * Wrapper for API calls that should show loading states
   * @param {Function} apiCall - The API function to call
   * @param {Function} setLoading - Loading state setter
   * @param {string} fallbackMessage - Custom error message
   * @returns {Promise} The result of the API call or null if error
   */
  const withLoadingAndErrorHandling = useCallback(async (apiCall, setLoading, fallbackMessage) => {
    try {
      clearError();
      setLoading(true);
      return await apiCall();
    } catch (error) {
      handleError(error, fallbackMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  /**
   * Check if the error is a network connectivity issue
   * @returns {boolean}
   */
  const isNetworkError = useCallback(() => {
    return error === ERROR_MESSAGES.NETWORK_ERROR || 
           error === ERROR_MESSAGES.TIMEOUT_ERROR;
  }, [error]);

  /**
   * Check if the error is a server issue
   * @returns {boolean}
   */
  const isServerError = useCallback(() => {
    return error === ERROR_MESSAGES.SERVER_ERROR;
  }, [error]);

  /**
   * Check if the error is a validation issue
   * @returns {boolean}
   */
  const isValidationError = useCallback(() => {
    return error === ERROR_MESSAGES.VALIDATION_ERROR || 
           (error && error.includes('validation'));
  }, [error]);

  /**
   * Get suggested action based on error type
   * @returns {string}
   */
  const getSuggestedAction = useCallback(() => {
    if (isNetworkError()) {
      return 'Please check your internet connection and ensure the backend server is running.';
    }
    
    if (isServerError()) {
      return 'Please try again in a few moments. If the problem persists, contact support.';
    }
    
    if (isValidationError()) {
      return 'Please check your input and try again.';
    }
    
    if (error === ERROR_MESSAGES.RATE_LIMIT_ERROR) {
      return 'Please wait a moment before making another request.';
    }
    
    return 'Please try again. If the problem persists, contact support.';
  }, [error, isNetworkError, isServerError, isValidationError]);

  /**
   * Get error severity level
   * @returns {string} 'low' | 'medium' | 'high'
   */
  const getErrorSeverity = useCallback(() => {
    if (isNetworkError()) return 'high';
    if (isServerError()) return 'medium';
    if (isValidationError()) return 'low';
    if (error === ERROR_MESSAGES.RATE_LIMIT_ERROR) return 'low';
    return 'medium';
  }, [error, isNetworkError, isServerError, isValidationError]);

  return {
    // State
    error,
    isError,

    // Actions
    handleError,
    clearError,
    withErrorHandling,
    withLoadingAndErrorHandling,

    // Helpers
    isNetworkError: isNetworkError(),
    isServerError: isServerError(),
    isValidationError: isValidationError(),
    suggestedAction: getSuggestedAction(),
    errorSeverity: getErrorSeverity(),
  };
};

export default useApiError;