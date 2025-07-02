import React, { useState } from 'react';
import { User, Bot, AlertCircle, Copy, Check, RotateCcw, Loader2 } from 'lucide-react';
import { MESSAGE_TYPES } from '../utils/constants.js';
import { formatTime, formatTokenCount, formatDuration, copyToClipboard, formatMarkdown } from '../utils/formatters.js';

const ChatMessages = ({ messages, isTyping, isStreaming, onRetry, messagesEndRef }) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const handleCopyMessage = async (content, messageId) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const renderMessage = (message) => {
    const isUser = message.type === MESSAGE_TYPES.USER;
    const isError = message.type === MESSAGE_TYPES.ERROR;
    const isStreaming = message.streaming;

    return (
      <div
        key={message.id}
        className={`flex gap-4 p-4 ${isUser ? 'bg-gray-900' : 'bg-gray-800'} ${isError ? 'border-l-4 border-red-500' : ''}`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : isError ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {isUser ? 'You' : isError ? 'Error' : 'Assistant'}
              </span>
              <span className="text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </span>
              {isStreaming && (
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Generating...</span>
                </div>
              )}
            </div>

            {/* Message Actions */}
            {!isError && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy message"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isError && onRetry && (
                  <button
                    onClick={onRetry}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Retry"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Message Text */}
          <div className={`prose prose-invert max-w-none ${isError ? 'text-red-300' : 'text-gray-100'}`}>
            {message.content.includes('```') || message.content.includes('`') ? (
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>

          {/* Metadata */}
          {message.metadata && Object.keys(message.metadata).length > 0 && (
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              {message.metadata.tokens && (
                <span>{formatTokenCount(message.metadata.tokens)}</span>
              )}
              {message.metadata.duration && (
                <span>{formatDuration(message.metadata.duration)}</span>
              )}
              {message.metadata.model && (
                <span>Model: {message.metadata.model}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Messages */}
        {messages.map(renderMessage)}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4 p-4 bg-gray-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">Assistant</span>
                <span className="text-xs text-gray-400">typing...</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;