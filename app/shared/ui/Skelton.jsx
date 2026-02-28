import React from "react";

const SkeletonBlock = ({ className = "" }) => {
  return (
    <div
      className={`
        relative overflow-hidden bg-gray-200 rounded-md
        before:absolute before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_1.4s_infinite]
        before:bg-linear-to-r
        before:from-transparent
        before:via-white/60
        before:to-transparent
        ${className}
      `}
    />
  );
};

export default SkeletonBlock;