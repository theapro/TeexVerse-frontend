import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Loader2 } from 'lucide-react';

const InputCard = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false, 
  isTyping = false,
  onCancel,
  maxLength = 4000,
  placeholder = "Type your message here..."
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus textarea on component mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const isButtonDisabled = disabled || !message.trim() || isLoading;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="border-t border-gray-700 bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={disabled ? "Backend is offline..." : placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className={`
                w-full resize-none rounded-lg border px-4 py-3 text-white bg-gray-800
                focus:outline-none focus:ring-2 focus:border-transparent
                disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed
                ${isOverLimit ? 'border-red-500 focus:ring-red-500' : 
                  isFocused ? 'border-blue-500 focus:ring-blue-500' : 'border-gray-600'}
              `}
              style={{ minHeight: '44px', maxHeight: '200px' }}
              rows={1}
            />
            
            {/* Character Count */}
            {(isNearLimit || isOverLimit) && (
              <div className={`absolute bottom-2 right-2 text-xs ${
                isOverLimit ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {characterCount}/{maxLength}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Send/Cancel Button */}
            {isLoading || isTyping ? (
              <button
                type="button"
                onClick={handleCancel}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center"
                title="Cancel"
              >
                <Square className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`
                  p-3 rounded-lg transition-colors flex items-center justify-center
                  ${isButtonDisabled 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
                title="Send message (Enter)"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Loading Indicator */}
            {(isLoading || isTyping) && (
              <div className="p-3 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </div>
            )}
          </div>
        </form>

        {/* Hints */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {disabled && (
              <span className="text-red-400">• Backend server is offline</span>
            )}
          </div>
          
          {!isNearLimit && !isOverLimit && (
            <span>{characterCount} characters</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputCard;