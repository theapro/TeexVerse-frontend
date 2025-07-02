/**
 * Type definitions for the Chat API and components
 * These can be used with JSDoc comments for better IDE support
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {'user'|'assistant'|'system'|'error'} type - Message type
 * @property {string} content - Message content
 * @property {string} timestamp - ISO timestamp
 * @property {Object} [metadata] - Optional metadata (tokens, duration, model)
 * @property {boolean} [streaming] - Whether message is currently streaming
 */

/**
 * @typedef {Object} Persona
 * @property {string} id - Unique persona identifier
 * @property {string} name - Display name
 * @property {string} description - Description of the persona
 * @property {string} [avatar] - Avatar emoji or URL
 */

/**
 * @typedef {Object} GenerateRequest
 * @property {string} prompt - User prompt
 * @property {string} [persona] - Selected persona ID
 * @property {string} [responseLength] - Response length preset
 * @property {boolean} [stream] - Enable streaming response
 */

/**
 * @typedef {Object} GenerateResponse
 * @property {string} response - Generated response text
 * @property {number} [tokens] - Token count
 * @property {number} [duration] - Generation duration in ms
 * @property {string} [model] - Model used for generation
 */

/**
 * @typedef {Object} HealthStatus
 * @property {'healthy'|'warning'|'error'|'unknown'} status - Health status
 * @property {string} [message] - Status message
 * @property {number} [timestamp] - Status check timestamp
 */

/**
 * @typedef {Object} SystemStats
 * @property {number} [cpu_usage] - CPU usage percentage
 * @property {number} [memory_usage] - Memory usage percentage
 * @property {number} [load_average] - System load average
 * @property {number} [uptime] - System uptime in seconds
 * @property {number} [disk_usage] - Disk usage percentage
 */

/**
 * @typedef {Object} ModelStatus
 * @property {string} [model] - Model name
 * @property {boolean} [loaded] - Whether model is loaded
 * @property {number} [memory_usage] - Model memory usage in bytes
 * @property {string} [version] - Model version
 */

/**
 * @typedef {Object} GPUStats
 * @property {number} [utilization] - GPU utilization percentage
 * @property {number} [memory_used] - Used GPU memory in MB
 * @property {number} [memory_total] - Total GPU memory in MB
 * @property {number} [temperature] - GPU temperature in Celsius
 * @property {string} [name] - GPU name
 */

/**
 * @typedef {Object} MemoryStats
 * @property {number} [usage] - Memory usage percentage
 * @property {number} [used] - Used memory in GB
 * @property {number} [available] - Available memory in GB
 * @property {number} [total] - Total memory in GB
 */

/**
 * @typedef {Object} PerformanceMetrics
 * @property {number} [requests_per_second] - Current RPS
 * @property {number} [average_response_time] - Average response time in ms
 * @property {number} [total_requests] - Total requests processed
 * @property {number} [error_rate] - Error rate percentage
 */

/**
 * @typedef {Object} ChatSettings
 * @property {string} persona - Selected persona ID
 * @property {string} responseLength - Response length preset
 * @property {boolean} streamingEnabled - Whether streaming is enabled
 * @property {boolean} autoScroll - Whether to auto-scroll to bottom
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status code
 * @property {string} [code] - Error code
 * @property {Object} [details] - Additional error details
 */

export {
  // Type definitions are exported for JSDoc usage
  // In a TypeScript project, these would be actual TypeScript interfaces
};