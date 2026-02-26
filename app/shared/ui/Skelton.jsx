import React from "react";

// Skeleton Spinner Component
const Skeleton = ({ className = "", size = "h-8 w-8" }) => {
  return (
    <div
      className={`animate-spin rounded-full bg-gray-200 ${size} ${className}`}
    />
  );
};

export default Skeleton;