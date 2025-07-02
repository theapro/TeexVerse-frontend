import React from 'react';
import { MessageSquare, Zap, Brain, Palette, BarChart3, Heart, AlertCircle } from 'lucide-react';

const WelcomeScreen = ({ onSendMessage, personas, selectedPersona, isOnline }) => {
  const samplePrompts = [
    {
      title: "Creative Writing",
      icon: <Palette className="w-5 h-5" />,
      prompt: "Write a short story about a robot who discovers emotions",
      category: "creative"
    },
    {
      title: "Code Help",
      icon: <Brain className="w-5 h-5" />,
      prompt: "Help me write a Python function to calculate Fibonacci numbers",
      category: "analytical"
    },
    {
      title: "Data Analysis",
      icon: <BarChart3 className="w-5 h-5" />,
      prompt: "Explain the difference between mean, median, and mode with examples",
      category: "analytical"
    },
    {
      title: "Casual Chat",
      icon: <Heart className="w-5 h-5" />,
      prompt: "What's a interesting fact about space that most people don't know?",
      category: "friendly"
    }
  ];

  const currentPersona = personas.find(p => p.id === selectedPersona) || personas[0];

  const handlePromptClick = (prompt) => {
    if (isOnline) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Main Welcome */}
        <div className="mb-8">
          <div className="mb-4">
            <MessageSquare className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Welcome to TeexVerse AI Chat</h1>
            <p className="text-gray-400 text-lg">
              Start a conversation with our AI assistant powered by FastAPI
            </p>
          </div>

          {/* Status Banner */}
          {!isOnline ? (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span>Backend server is offline. Please check if the FastAPI server is running.</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-green-300">
                <Zap className="w-5 h-5" />
                <span>Connected to backend • Ready to chat</span>
              </div>
            </div>
          )}
        </div>

        {/* Current Persona Info */}
        {currentPersona && (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Current AI Persona</h3>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">{currentPersona.avatar || '🤖'}</span>
              <div>
                <h4 className="font-medium text-blue-400">{currentPersona.name}</h4>
                <p className="text-gray-400 text-sm">{currentPersona.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Prompts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">Try these conversation starters:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt.prompt)}
                disabled={!isOnline}
                className={`
                  text-left p-4 rounded-lg border transition-all duration-200
                  ${isOnline 
                    ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-blue-500 cursor-pointer' 
                    : 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isOnline ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {prompt.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{prompt.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{prompt.prompt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <Brain className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="font-semibold mb-2">Multiple Personas</h4>
            <p className="text-gray-400 text-sm">
              Switch between different AI personalities for specialized conversations
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <Zap className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="font-semibold mb-2">Real-time Responses</h4>
            <p className="text-gray-400 text-sm">
              Get streaming responses as they're generated for a natural experience
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <BarChart3 className="w-8 h-8 text-yellow-400 mb-3" />
            <h4 className="font-semibold mb-2">System Monitoring</h4>
            <p className="text-gray-400 text-sm">
              View real-time backend performance and system statistics
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>
            Type your message in the input box below or click on one of the sample prompts above to get started.
          </p>
          {!isOnline && (
            <p className="mt-2 text-red-400">
              Make sure your FastAPI backend is running on the configured port to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;