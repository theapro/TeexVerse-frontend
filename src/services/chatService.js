import { api, retryRequest } from './api.js';

/**
 * Chat service for handling all chat-related API calls
 */
class ChatService {
  /**
   * Send a message to the FastAPI backend for generation
   * @param {string} prompt - User message/prompt
   * @param {Object} options - Additional options for generation
   * @returns {Promise<Object>} Response from the backend
   */
  async sendMessage(prompt, options = {}) {
    const requestData = {
      prompt: prompt.trim(),
      ...options
    };

    return retryRequest(async () => {
      const response = await api.post('/generate/', requestData);
      return response.data;
    });
  }

  /**
   * Get conversation history
   * @returns {Promise<Array>} Array of conversation messages
   */
  async getConversationHistory() {
    return retryRequest(async () => {
      const response = await api.get('/conversation-history/');
      return response.data;
    });
  }

  /**
   * Clear conversation history
   * @returns {Promise<Object>} Success response
   */
  async clearHistory() {
    return retryRequest(async () => {
      const response = await api.delete('/clear-history/');
      return response.data;
    });
  }

  /**
   * Get available personas
   * @returns {Promise<Array>} Array of available personas
   */
  async getPersonas() {
    return retryRequest(async () => {
      const response = await api.get('/personas/');
      return response.data;
    });
  }

  /**
   * Set AI persona
   * @param {string} personaId - ID of the persona to set
   * @returns {Promise<Object>} Success response
   */
  async setPersona(personaId) {
    return retryRequest(async () => {
      const response = await api.post('/set-persona/', { persona_id: personaId });
      return response.data;
    });
  }

  /**
   * Set response length preset
   * @param {string} length - Response length preset (short, medium, long)
   * @returns {Promise<Object>} Success response
   */
  async setResponseLength(length) {
    return retryRequest(async () => {
      const response = await api.post('/set-response-length/', { length });
      return response.data;
    });
  }

  /**
   * Cancel ongoing generation (if supported)
   * @returns {Promise<Object>} Success response
   */
  async cancelGeneration() {
    return retryRequest(async () => {
      const response = await api.post('/cancel-generation/');
      return response.data;
    });
  }

  /**
   * Stream message generation (for real-time responses)
   * @param {string} prompt - User message/prompt
   * @param {Function} onChunk - Callback for each chunk of data
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async streamMessage(prompt, onChunk, options = {}) {
    const requestData = {
      prompt: prompt.trim(),
      stream: true,
      ...options
    };

    try {
      const response = await fetch(`${api.defaults.baseURL}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onChunk(data);
            } catch (e) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;