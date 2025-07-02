import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Settings, 
  Activity, 
  User, 
  Bot, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  Zap,
  X
} from 'lucide-react';

import { useChat } from '../hooks/useChat.js';
import { useBackendStatus } from '../hooks/useBackendStatus.js';
import { useApiError } from '../hooks/useApiError.js';
import { 
  CHAT_THEME, 
  MESSAGE_TYPES, 
  RESPONSE_LENGTHS, 
  STATUS_LEVELS,
  CHAT_CONSTANTS 
} from '../utils/constants.js';
import { 
  formatTime, 
  formatDuration, 
  formatTokenCount,
  copyToClipboard,
  downloadAsFile 
} from '../utils/formatters.js';

// Sub-components
import ChatMessages from './ChatMessages.jsx';
import InputCard from './InputCard.jsx';
import WelcomeScreen from './WelcomeScreen.jsx';
import Sidebar from './Sidebar.jsx';

const Chat = () => {
  // Chat functionality
  const {
    messages,
    isLoading,
    isTyping,
    isStreaming,
    error: chatError,
    selectedPersona,
    responseLength,
    personas,
    sendMessage,
    sendMessageWithStreaming,
    clearHistory,
    changePersona,
    changeResponseLength,
    cancelRequest,
    retryLastMessage,
  } = useChat();

  // Backend status monitoring
  const {
    isOnline,
    healthStatus,
    systemStats,
    modelStatus,
    gpuStats,
    memoryStats,
    overallHealth,
    statusMessage,
    refresh: refreshStatus,
  } = useBackendStatus();

  // Error handling
  const { error: apiError, clearError, handleError } = useApiError();

  // Local state
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Handle sending messages
  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    
    if (streamingEnabled) {
      await sendMessageWithStreaming(content);
    } else {
      await sendMessage(content);
    }
  };

  // Handle clearing chat
  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear the conversation history? This action cannot be undone.')) {
      try {
        await clearHistory();
      } catch (error) {
        handleError(error, 'Failed to clear conversation history');
      }
    }
  };

  // Handle export conversation
  const handleExportChat = () => {
    const chatText = messages
      .filter(msg => msg.type !== MESSAGE_TYPES.SYSTEM)
      .map(msg => {
        const role = msg.type === MESSAGE_TYPES.USER ? 'You' : 'Assistant';
        const timestamp = formatTime(msg.timestamp);
        return `[${timestamp}] ${role}: ${msg.content}`;
      })
      .join('\n\n');
    
    const filename = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    downloadAsFile(chatText, filename);
  };

  // Get status indicator color
  const getStatusColor = () => {
    switch (overallHealth) {
      case STATUS_LEVELS.HEALTHY:
        return 'text-green-400';
      case STATUS_LEVELS.WARNING:
        return 'text-yellow-400';
      case STATUS_LEVELS.ERROR:
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (overallHealth) {
      case STATUS_LEVELS.HEALTHY:
        return <CheckCircle className="w-4 h-4" />;
      case STATUS_LEVELS.WARNING:
        return <AlertCircle className="w-4 h-4" />;
      case STATUS_LEVELS.ERROR:
        return <X className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        messages={messages}
        onClearHistory={handleClearChat}
        onExportChat={handleExportChat}
        systemStats={systemStats}
        modelStatus={modelStatus}
        isOnline={isOnline}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold">TeexVerse AI Chat</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                    {getStatusIcon()}
                    <span>{statusMessage}</span>
                  </div>
                  {modelStatus?.model && (
                    <span>• Model: {modelStatus.model}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Persona Selector */}
              <select
                value={selectedPersona}
                onChange={(e) => changePersona(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {personas.map(persona => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name}
                  </option>
                ))}
              </select>

              {/* Response Length Selector */}
              <select
                value={responseLength}
                onChange={(e) => changeResponseLength(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(RESPONSE_LENGTHS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* System Status Button */}
              <button
                onClick={() => setShowSystemStatus(!showSystemStatus)}
                className={`p-2 hover:bg-gray-700 rounded-lg transition-colors ${getStatusColor()}`}
              >
                <Activity className="w-5 h-5" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={refreshStatus}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold mb-3">Chat Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={streamingEnabled}
                      onChange={(e) => setStreamingEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <span>Enable Streaming Responses</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="rounded"
                    />
                    <span>Auto-scroll to Bottom</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* System Status Panel */}
          {showSystemStatus && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold mb-3">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {gpuStats && (
                  <div>
                    <h4 className="font-medium text-blue-400">GPU</h4>
                    <p>Utilization: {gpuStats.utilization}%</p>
                    <p>Memory: {gpuStats.memory_used}/{gpuStats.memory_total} MB</p>
                    <p>Temperature: {gpuStats.temperature}°C</p>
                  </div>
                )}
                {memoryStats && (
                  <div>
                    <h4 className="font-medium text-green-400">Memory</h4>
                    <p>Usage: {memoryStats.usage}%</p>
                    <p>Used: {memoryStats.used} GB</p>
                    <p>Available: {memoryStats.available} GB</p>
                  </div>
                )}
                {systemStats && (
                  <div>
                    <h4 className="font-medium text-yellow-400">System</h4>
                    <p>CPU: {systemStats.cpu_usage}%</p>
                    <p>Load: {systemStats.load_average}</p>
                    <p>Uptime: {formatDuration(systemStats.uptime * 1000)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {(chatError || apiError) && (
          <div className="bg-red-900 border-b border-red-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-100">{chatError || apiError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-hidden flex flex-col"
        >
          {messages.length === 0 ? (
            <WelcomeScreen 
              onSendMessage={handleSendMessage}
              personas={personas}
              selectedPersona={selectedPersona}
              isOnline={isOnline}
            />
          ) : (
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              isStreaming={isStreaming}
              onRetry={retryLastMessage}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        {/* Input Area */}
        <InputCard
          onSendMessage={handleSendMessage}
          disabled={!isOnline || isLoading}
          isLoading={isLoading}
          isTyping={isTyping}
          onCancel={cancelRequest}
          maxLength={CHAT_CONSTANTS.MAX_MESSAGE_LENGTH}
        />
      </div>
    </div>
  );
};

export default Chat;