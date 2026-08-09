import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Generating your study material...</p>
      </div>
    </div>
  );
};

export default Loading;