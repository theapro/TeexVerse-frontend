# TeexVerse AI Chat Integration

This directory contains the complete implementation of a React frontend chat application that connects to a FastAPI backend.

## Features Implemented

### ✅ API Service Layer
- **Base API Configuration** (`src/services/api.js`)
  - Axios instance with proper error handling
  - Request/response interceptors
  - Retry logic for failed requests
  - Environment-based configuration
  
- **Chat Service** (`src/services/chatService.js`)
  - Message generation with `/generate/` endpoint
  - Streaming response support
  - Conversation history management
  - Persona and response length controls
  
- **System Service** (`src/services/systemService.js`)
  - Health checks and system monitoring
  - GPU and memory statistics
  - Performance metrics
  - Backend configuration management

### ✅ React Components
- **Main Chat Component** (`src/components/Chat.jsx`)
  - Dark theme interface
  - Real-time backend status monitoring
  - Settings panel with persona/length controls
  - System status display with metrics
  
- **ChatMessages** (`src/components/ChatMessages.jsx`)
  - Message history display
  - Typing indicators
  - Message actions (copy, retry)
  - Markdown formatting support
  
- **InputCard** (`src/components/InputCard.jsx`)
  - Message input with auto-resize
  - Character count and limits
  - Enter/Shift+Enter handling
  - Cancel ongoing requests
  
- **WelcomeScreen** (`src/components/WelcomeScreen.jsx`)
  - Welcome interface for new users
  - Sample conversation starters
  - Connection status display
  - Feature highlights
  
- **Sidebar** (`src/components/Sidebar.jsx`)
  - Conversation statistics
  - Recent message history
  - System status overview
  - Export/clear actions

### ✅ Custom Hooks
- **useChat** (`src/hooks/useChat.js`)
  - Complete chat state management
  - Message sending with streaming
  - History loading and clearing
  - Persona and settings management
  
- **useBackendStatus** (`src/hooks/useBackendStatus.js`)
  - Real-time health monitoring
  - System statistics polling
  - Connection status tracking
  - Automatic retry logic
  
- **useApiError** (`src/hooks/useApiError.js`)
  - Consistent error handling
  - Error classification and suggestions
  - Loading state management
  - User-friendly error messages

### ✅ Utilities and Constants
- **Constants** (`src/utils/constants.js`)
  - Chat configuration constants
  - API endpoints definitions
  - Error messages
  - Theme colors and styling
  
- **Formatters** (`src/utils/formatters.js`)
  - Time, duration, and size formatting
  - Token count and percentage display
  - Markdown processing
  - Clipboard and file operations

## FastAPI Backend Integration

The frontend is configured to connect to a FastAPI backend with these endpoints:

- `POST /generate/` - Main text generation
- `GET /health` - Health check
- `GET /conversation-history/` - Get conversation history
- `DELETE /clear-history/` - Clear conversation history
- `GET /personas/` - Get available personas
- `POST /set-persona/` - Change AI persona
- `POST /set-response-length/` - Set response length
- `GET /system-status/` - System statistics
- `GET /model-status/` - Model information
- `GET /gpu-stats/` - GPU statistics
- `GET /memory-stats/` - Memory statistics

## Configuration

### Environment Variables
```bash
# .env file
VITE_FASTAPI_URL=http://localhost:8000
```

### Backend URL Configuration
The application automatically detects the FastAPI backend URL from environment variables with fallback to `http://localhost:8000`.

## Usage

### Starting the Application
1. Ensure your FastAPI backend is running
2. Start the React development server:
   ```bash
   npm run dev
   ```
3. Navigate to `/chat` route in your browser

### Chat Features
- **Real-time Messaging**: Send messages and receive streaming responses
- **Persona Selection**: Choose different AI personalities
- **Response Length**: Control response length (short, medium, long)
- **System Monitoring**: View backend performance metrics
- **Export/Import**: Save conversation history
- **Error Handling**: Graceful error recovery and retry

### System Status
The chat interface displays:
- Backend connection status
- GPU utilization and memory
- System resource usage
- Model loading status
- Performance metrics

## Error Handling

The application includes comprehensive error handling:
- **Network Errors**: Connection issues with retry logic
- **Backend Errors**: Server error classification and user-friendly messages
- **Validation Errors**: Input validation and formatting suggestions
- **Rate Limiting**: Automatic backoff for rate-limited requests

## Streaming Support

The chat supports real-time streaming responses:
- Enable/disable streaming in settings
- Real-time text generation display
- Cancellation of ongoing streams
- Fallback to standard requests

## Browser Compatibility

- Modern browsers with ES6+ support
- WebSocket support for real-time features
- Clipboard API for copy functionality
- File API for export features

## Development

### Adding New Features
1. **New API Endpoints**: Add to services layer
2. **UI Components**: Follow existing component patterns
3. **State Management**: Use custom hooks for complex state
4. **Error Handling**: Use `useApiError` hook for consistency

### Testing
- Test with FastAPI backend running on localhost:8000
- Verify all API endpoints are accessible
- Test error scenarios (backend offline, timeouts)
- Validate streaming functionality

This implementation provides a complete, production-ready chat interface that seamlessly integrates with your FastAPI backend while maintaining excellent user experience and proper error handling.