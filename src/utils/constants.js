// Chat related constants
export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_HISTORY_LENGTH: 100,
  DEFAULT_RESPONSE_LENGTH: 'medium',
  DEFAULT_PERSONA: 'assistant',
  TYPING_DELAY: 50,
  AUTO_SAVE_DELAY: 1000,
};

// Response length presets
export const RESPONSE_LENGTHS = {
  short: {
    label: 'Short',
    description: 'Brief and concise responses',
    maxTokens: 150,
  },
  medium: {
    label: 'Medium', 
    description: 'Balanced responses',
    maxTokens: 500,
  },
  long: {
    label: 'Long',
    description: 'Detailed and comprehensive responses',
    maxTokens: 1000,
  },
};

// System status levels
export const STATUS_LEVELS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
  UNKNOWN: 'unknown',
};

// Message types
export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error',
};

// Theme colors for the chat interface
export const CHAT_THEME = {
  background: '#0a0a0a',
  cardBackground: '#1a1a1a',
  userMessage: '#2563eb',
  assistantMessage: '#374151',
  accent: '#10b981',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  border: '#374151',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
};

// API endpoints for different FastAPI routes
export const API_ENDPOINTS = {
  GENERATE: '/generate/',
  HEALTH: '/health',
  CONVERSATION_HISTORY: '/conversation-history/',
  CLEAR_HISTORY: '/clear-history/',
  PERSONAS: '/personas/',
  SET_PERSONA: '/set-persona/',
  SET_RESPONSE_LENGTH: '/set-response-length/',
  SYSTEM_STATUS: '/system-status/',
  MODEL_STATUS: '/model-status/',
  GPU_STATS: '/gpu-stats/',
  MEMORY_STATS: '/memory-stats/',
  PERFORMANCE_METRICS: '/performance-metrics/',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the backend server. Please check if the server is running.',
  TIMEOUT_ERROR: 'Request timed out. The server may be busy.',
  VALIDATION_ERROR: 'Invalid input. Please check your message and try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment before trying again.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Local storage keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chat_history',
  CHAT_SETTINGS: 'chat_settings',
  SELECTED_PERSONA: 'selected_persona',
  RESPONSE_LENGTH: 'response_length',
  THEME_PREFERENCE: 'theme_preference',
};

// Default personas (fallback if backend doesn't provide them)
export const DEFAULT_PERSONAS = [
  {
    id: 'assistant',
    name: 'Assistant',
    description: 'A helpful AI assistant',
    avatar: '🤖',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Creative and imaginative responses',
    avatar: '🎨',
  },
  {
    id: 'analytical',
    name: 'Analytical',
    description: 'Logical and analytical thinking',
    avatar: '📊',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and conversational',
    avatar: '😊',
  },
];

// Health check intervals (in milliseconds)
export const HEALTH_CHECK_INTERVALS = {
  NORMAL: 30000, // 30 seconds
  FAST: 5000,    // 5 seconds when errors detected
  SLOW: 60000,   // 1 minute when stable
};

// Animation durations
export const ANIMATIONS = {
  MESSAGE_APPEAR: 300,
  TYPING_INDICATOR: 1000,
  FADE_IN: 200,
  SLIDE_IN: 250,
};

export default {
  CHAT_CONSTANTS,
  RESPONSE_LENGTHS,
  STATUS_LEVELS,
  MESSAGE_TYPES,
  CHAT_THEME,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  DEFAULT_PERSONAS,
  HEALTH_CHECK_INTERVALS,
  ANIMATIONS,
};