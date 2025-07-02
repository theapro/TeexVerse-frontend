import { api, retryRequest } from './api.js';

/**
 * System service for handling backend status and monitoring
 */
class SystemService {
  /**
   * Check backend health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    return retryRequest(async () => {
      const response = await api.get('/health');
      return response.data;
    });
  }

  /**
   * Get system status including GPU stats, memory usage, etc.
   * @returns {Promise<Object>} System status information
   */
  async getSystemStatus() {
    return retryRequest(async () => {
      const response = await api.get('/system-status/');
      return response.data;
    });
  }

  /**
   * Get model information and status
   * @returns {Promise<Object>} Model status
   */
  async getModelStatus() {
    return retryRequest(async () => {
      const response = await api.get('/model-status/');
      return response.data;
    });
  }

  /**
   * Get GPU statistics
   * @returns {Promise<Object>} GPU statistics
   */
  async getGPUStats() {
    return retryRequest(async () => {
      const response = await api.get('/gpu-stats/');
      return response.data;
    });
  }

  /**
   * Get memory usage statistics
   * @returns {Promise<Object>} Memory usage stats
   */
  async getMemoryStats() {
    return retryRequest(async () => {
      const response = await api.get('/memory-stats/');
      return response.data;
    });
  }

  /**
   * Get performance metrics
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics() {
    return retryRequest(async () => {
      const response = await api.get('/performance-metrics/');
      return response.data;
    });
  }

  /**
   * Restart the backend service (if supported)
   * @returns {Promise<Object>} Success response
   */
  async restartService() {
    return retryRequest(async () => {
      const response = await api.post('/restart/');
      return response.data;
    });
  }

  /**
   * Get system logs (if supported)
   * @param {number} lines - Number of log lines to retrieve
   * @returns {Promise<Array>} Array of log entries
   */
  async getLogs(lines = 100) {
    return retryRequest(async () => {
      const response = await api.get(`/logs/?lines=${lines}`);
      return response.data;
    });
  }

  /**
   * Clear system logs (if supported)
   * @returns {Promise<Object>} Success response
   */
  async clearLogs() {
    return retryRequest(async () => {
      const response = await api.delete('/logs/');
      return response.data;
    });
  }

  /**
   * Get backend configuration
   * @returns {Promise<Object>} Backend configuration
   */
  async getConfig() {
    return retryRequest(async () => {
      const response = await api.get('/config/');
      return response.data;
    });
  }

  /**
   * Update backend configuration
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} Success response
   */
  async updateConfig(config) {
    return retryRequest(async () => {
      const response = await api.put('/config/', config);
      return response.data;
    });
  }

  /**
   * Ping the backend with a simple connectivity test
   * @returns {Promise<boolean>} True if backend is reachable
   */
  async ping() {
    try {
      await api.get('/health', { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const systemService = new SystemService();
export default systemService;