import React from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  MessageSquare, 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { formatTime, formatFileSize, formatPercentage } from '../utils/formatters.js';
import { MESSAGE_TYPES } from '../utils/constants.js';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  messages, 
  onClearHistory, 
  onExportChat,
  systemStats,
  modelStatus,
  isOnline
}) => {
  const messageCount = messages.length;
  const userMessages = messages.filter(msg => msg.type === MESSAGE_TYPES.USER).length;
  const assistantMessages = messages.filter(msg => msg.type === MESSAGE_TYPES.ASSISTANT).length;

  const recentMessages = messages.slice(-5).reverse();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Chat Overview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Conversation Stats */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Messages:</span>
                <span>{messageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Messages:</span>
                <span>{userMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AI Responses:</span>
                <span>{assistantMessages}</span>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          {recentMessages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Messages</h3>
              <div className="space-y-2">
                {recentMessages.map((message) => (
                  <div key={message.id} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === MESSAGE_TYPES.USER ? (
                        <User className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          {isOnline && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status
              </h3>
              <div className="space-y-3">
                {/* Model Info */}
                {modelStatus && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-blue-400">AI Model</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model:</span>
                        <span>{modelStatus.model || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`${modelStatus.loaded ? 'text-green-400' : 'text-red-400'}`}>
                          {modelStatus.loaded ? 'Loaded' : 'Not Loaded'}
                        </span>
                      </div>
                      {modelStatus.memory_usage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Memory:</span>
                          <span>{formatFileSize(modelStatus.memory_usage)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* System Stats */}
                {systemStats && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-green-400">System</h4>
                    <div className="space-y-1 text-xs">
                      {systemStats.cpu_usage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">CPU:</span>
                          <span>{formatPercentage(systemStats.cpu_usage)}</span>
                        </div>
                      )}
                      {systemStats.memory_usage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Memory:</span>
                          <span>{formatPercentage(systemStats.memory_usage)}</span>
                        </div>
                      )}
                      {systemStats.load_average && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Load:</span>
                          <span>{systemStats.load_average}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <h3 className="text-lg font-medium mb-3">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={onExportChat}
                disabled={messageCount === 0}
                className="w-full flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Chat
              </button>
              
              <button
                onClick={onClearHistory}
                disabled={messageCount === 0}
                className="w-full flex items-center gap-2 p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="border-t border-gray-700 pt-4 text-xs text-gray-400">
            <p>TeexVerse AI Chat</p>
            <p>Powered by FastAPI Backend</p>
            <p className="mt-2">
              Status: {isOnline ? (
                <span className="text-green-400">Connected</span>
              ) : (
                <span className="text-red-400">Offline</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;