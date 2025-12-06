import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start px-4 py-2">
      <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 border border-gray-200">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-500 ml-2"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator