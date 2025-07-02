import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../services/chatService.js';
import { CHAT_CONSTANTS, MESSAGE_TYPES, STORAGE_KEYS } from '../utils/constants.js';
import { generateId } from '../utils/formatters.js';

/**
 * Custom hook for managing chat functionality
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState('assistant');
  const [responseLength, setResponseLength] = useState('medium');
  const [personas, setPersonas] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Refs for managing state
  const abortControllerRef = useRef(null);
  const streamingMessageRef = useRef(null);

  /**
   * Load initial data on hook initialization
   */
  useEffect(() => {
    loadStoredSettings();
    loadConversationHistory();
    loadPersonas();
  }, []);

  /**
   * Load stored settings from localStorage
   */
  const loadStoredSettings = useCallback(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEYS.CHAT_SETTINGS);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setSelectedPersona(settings.persona || 'assistant');
        setResponseLength(settings.responseLength || 'medium');
      }
    } catch (error) {
      console.warn('Failed to load stored settings:', error);
    }
  }, []);

  /**
   * Save settings to localStorage
   */
  const saveSettings = useCallback(() => {
    try {
      const settings = {
        persona: selectedPersona,
        responseLength: responseLength,
      };
      localStorage.setItem(STORAGE_KEYS.CHAT_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [selectedPersona, responseLength]);

  /**
   * Load conversation history from backend
   */
  const loadConversationHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const history = await chatService.getConversationHistory();
      
      if (Array.isArray(history)) {
        setMessages(history.map(msg => ({
          id: msg.id || generateId(),
          type: msg.type || MESSAGE_TYPES.ASSISTANT,
          content: msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
          metadata: msg.metadata || {},
        })));
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      // Load from localStorage as fallback
      loadStoredHistory();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load conversation history from localStorage as fallback
   */
  const loadStoredHistory = useCallback(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setMessages(history);
      }
    } catch (error) {
      console.warn('Failed to load stored history:', error);
    }
  }, []);

  /**
   * Save conversation to localStorage
   */
  const saveToLocalStorage = useCallback((newMessages) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(newMessages));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, []);

  /**
   * Load available personas from backend
   */
  const loadPersonas = useCallback(async () => {
    try {
      const personas = await chatService.getPersonas();
      setPersonas(personas);
    } catch (error) {
      console.error('Failed to load personas:', error);
      // Use default personas if backend fails
      setPersonas([
        { id: 'assistant', name: 'Assistant', description: 'A helpful AI assistant' },
        { id: 'creative', name: 'Creative', description: 'Creative and imaginative' },
        { id: 'analytical', name: 'Analytical', description: 'Logical and analytical' },
      ]);
    }
  }, []);

  /**
   * Send a message to the chat
   */
  const sendMessage = useCallback(async (content, options = {}) => {
    if (!content.trim()) return;

    const userMessage = {
      id: generateId(),
      type: MESSAGE_TYPES.USER,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveToLocalStorage(newMessages);
      return newMessages;
    });

    // Clear previous error
    setError(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const response = await chatService.sendMessage(content, {
        persona: selectedPersona,
        responseLength: responseLength,
        ...options,
      });

      const assistantMessage = {
        id: generateId(),
        type: MESSAGE_TYPES.ASSISTANT,
        content: response.response || response.text || 'No response received',
        timestamp: new Date().toISOString(),
        metadata: {
          tokens: response.tokens,
          duration: response.duration,
          model: response.model,
        },
      };

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        saveToLocalStorage(newMessages);
        return newMessages;
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      
      if (error.name !== 'AbortError') {
        setError(error.message || 'Failed to send message');
        
        const errorMessage = {
          id: generateId(),
          type: MESSAGE_TYPES.ERROR,
          content: `Error: ${error.message || 'Failed to send message'}`,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [selectedPersona, responseLength, saveToLocalStorage]);

  /**
   * Send message with streaming response
   */
  const sendMessageWithStreaming = useCallback(async (content, options = {}) => {
    if (!content.trim()) return;

    const userMessage = {
      id: generateId(),
      type: MESSAGE_TYPES.USER,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveToLocalStorage(newMessages);
      return newMessages;
    });

    setError(null);
    setIsStreaming(true);
    setIsTyping(false);

    // Create placeholder for streaming message
    const streamingMessage = {
      id: generateId(),
      type: MESSAGE_TYPES.ASSISTANT,
      content: '',
      timestamp: new Date().toISOString(),
      streaming: true,
    };

    setMessages(prev => [...prev, streamingMessage]);
    streamingMessageRef.current = streamingMessage.id;

    try {
      await chatService.streamMessage(
        content,
        (chunk) => {
          if (chunk.content || chunk.delta) {
            setMessages(prev => prev.map(msg => {
              if (msg.id === streamingMessageRef.current) {
                return {
                  ...msg,
                  content: msg.content + (chunk.content || chunk.delta || ''),
                };
              }
              return msg;
            }));
          }
          
          if (chunk.done) {
            setMessages(prev => {
              const newMessages = prev.map(msg => {
                if (msg.id === streamingMessageRef.current) {
                  return {
                    ...msg,
                    streaming: false,
                    metadata: {
                      tokens: chunk.tokens,
                      duration: chunk.duration,
                      model: chunk.model,
                    },
                  };
                }
                return msg;
              });
              saveToLocalStorage(newMessages);
              return newMessages;
            });
            setIsStreaming(false);
          }
        },
        {
          persona: selectedPersona,
          responseLength: responseLength,
          ...options,
        }
      );
    } catch (error) {
      console.error('Streaming failed:', error);
      setError(error.message || 'Streaming failed');
      setIsStreaming(false);
      
      // Remove the failed streaming message
      setMessages(prev => prev.filter(msg => msg.id !== streamingMessageRef.current));
    }
  }, [selectedPersona, responseLength, saveToLocalStorage]);

  /**
   * Clear conversation history
   */
  const clearHistory = useCallback(async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Failed to clear history:', error);
      // Clear locally even if backend fails
      setMessages([]);
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    }
  }, []);

  /**
   * Change persona
   */
  const changePersona = useCallback(async (personaId) => {
    try {
      await chatService.setPersona(personaId);
      setSelectedPersona(personaId);
    } catch (error) {
      console.error('Failed to change persona:', error);
      // Set locally even if backend fails
      setSelectedPersona(personaId);
    }
  }, []);

  /**
   * Change response length
   */
  const changeResponseLength = useCallback(async (length) => {
    try {
      await chatService.setResponseLength(length);
      setResponseLength(length);
    } catch (error) {
      console.error('Failed to change response length:', error);
      // Set locally even if backend fails
      setResponseLength(length);
    }
  }, []);

  /**
   * Cancel ongoing request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsTyping(false);
      setIsStreaming(false);
    }
  }, []);

  /**
   * Retry last message
   */
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === MESSAGE_TYPES.USER);
    if (lastUserMessage) {
      // Remove any error messages after the last user message
      const lastUserIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      setMessages(prev => prev.slice(0, lastUserIndex + 1));
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [selectedPersona, responseLength, saveSettings]);

  return {
    // State
    messages,
    isLoading,
    isTyping,
    isStreaming,
    error,
    conversationId,
    selectedPersona,
    responseLength,
    personas,

    // Actions
    sendMessage,
    sendMessageWithStreaming,
    clearHistory,
    changePersona,
    changeResponseLength,
    cancelRequest,
    retryLastMessage,
    loadConversationHistory,
    loadPersonas,

    // Helpers
    setError,
  };
};

export default useChat;