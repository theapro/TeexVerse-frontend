/**
 * Format timestamp to readable format
 * @param {string|Date} timestamp 
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Format file size to human readable format
 * @param {number} bytes 
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms) => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};

/**
 * Format token count with proper units
 * @param {number} tokens 
 * @returns {string} Formatted token count
 */
export const formatTokenCount = (tokens) => {
  if (tokens < 1000) {
    return `${tokens} tokens`;
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K tokens`;
  } else {
    return `${(tokens / 1000000).toFixed(1)}M tokens`;
  }
};

/**
 * Format percentage with appropriate precision
 * @param {number} value - Value between 0 and 100
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  if (value >= 99.9) {
    return '100%';
  } else if (value >= 10) {
    return `${value.toFixed(1)}%`;
  } else {
    return `${value.toFixed(2)}%`;
  }
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} html 
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Check if text is likely to be code
 * @param {string} text 
 * @returns {boolean}
 */
export const isCodeLike = (text) => {
  const codeIndicators = [
    /```/,  // Code blocks
    /`[^`]+`/,  // Inline code
    /function\s+\w+\s*\(/,  // Function definitions
    /class\s+\w+/,  // Class definitions
    /import\s+.*from/,  // Import statements
    /console\.(log|error|warn)/,  // Console statements
    /\{\s*\n.*\n\s*\}/s,  // Object/block structures
  ];
  
  return codeIndicators.some(pattern => pattern.test(text));
};

/**
 * Extract code blocks from text
 * @param {string} text 
 * @returns {Array} Array of code blocks
 */
export const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      fullMatch: match[0],
    });
  }
  
  return blocks;
};

/**
 * Convert markdown-like formatting to HTML
 * @param {string} text 
 * @returns {string} HTML formatted text
 */
export const formatMarkdown = (text) => {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>');
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function calls
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function calls
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} Throttled function
 */
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return (...args) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(null, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text 
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Download text as file
 * @param {string} text 
 * @param {string} filename 
 * @param {string} mimeType 
 */
export const downloadAsFile = (text, filename, mimeType = 'text/plain') => {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  formatTime,
  formatFileSize,
  formatDuration,
  formatTokenCount,
  formatPercentage,
  truncateText,
  sanitizeHTML,
  isCodeLike,
  extractCodeBlocks,
  formatMarkdown,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  downloadAsFile,
};