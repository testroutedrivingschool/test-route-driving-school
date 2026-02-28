// GlobalLoading.jsx
import React from "react";

const GlobalLoading = ({ className = "" }) => {
  return (
    <div className={`w-full flex items-center justify-center py-20 min-h-screen ${className}`}>
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default GlobalLoading;