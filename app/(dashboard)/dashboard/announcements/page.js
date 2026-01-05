"use client";
import React from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";

export default function Announcements() {
  const {
    data: announcements = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axios.get("/api/announcements");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;



  return (
    <div className=" rounded-xl shadow border border-border-color p-6">
      <h2 className="text-2xl font-bold mb-6">📢 Announcements</h2>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements available.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-lg border border-border-color bg-base-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
