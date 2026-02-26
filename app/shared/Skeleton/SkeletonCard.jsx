import React from "react";
import  SkeletonBlock from "@/app/shared/ui/Skelton";

const SkeletonCard = ({isPackage = false, isInstructor = false}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Image Skeleton */}
      <SkeletonBlock className="w-full h-80" />

      <div className="p-4">
        {/* Title Skeleton */}
        <SkeletonBlock className="h-6 w-3/4 mb-3" />

        {/* Description Skeleton */}
        {isPackage && <SkeletonBlock className="h-4 w-full mb-4" />}
        {isInstructor && <SkeletonBlock className="h-4 w-1/2 mb-4" />}

        {/* Buttons or Actions Skeleton */}
        <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
          <SkeletonBlock className="h-10 w-24" />
          <SkeletonBlock className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
