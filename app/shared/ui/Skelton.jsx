import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
};

export default Skeleton;