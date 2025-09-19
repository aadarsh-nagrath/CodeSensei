"use client";

import React from 'react';

interface QuestionLoaderProps {
  isVisible: boolean;
}

const QuestionLoader: React.FC<QuestionLoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 border border-gray-700 shadow-2xl">
        {/* Animated Code Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <svg 
                className="w-8 h-8 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                />
              </svg>
            </div>
            {/* Rotating Ring */}
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Main Text */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2">
            Generating New Question
          </h3>
          <p className="text-gray-300 text-sm">
            Creating an interesting challenge for you...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        {/* Fun Messages */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 animate-pulse">
            🤖 AI is crafting the perfect problem...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionLoader;
