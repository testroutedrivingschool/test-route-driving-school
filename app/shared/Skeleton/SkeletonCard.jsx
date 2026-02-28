import React from "react";
import SkeletonBlock from "@/app/shared/ui/Skelton";

const SkeletonCard = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Thumbnail 16:9 */}
      <div className="w-full aspect-video rounded-xl overflow-hidden">
        <SkeletonBlock className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <div className="shrink-0">
          <SkeletonBlock className="w-10 h-10 rounded-full" />
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-2">
          {/* Title line 1 */}
          <SkeletonBlock className="h-4 w-[90%] rounded-md" />
          
          {/* Title line 2 */}
          <SkeletonBlock className="h-4 w-[70%] rounded-md" />

          {/* Channel name */}
          <SkeletonBlock className="h-3 w-[40%] rounded-md mt-2" />

          {/* Views + Time */}
          <SkeletonBlock className="h-3 w-[55%] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;