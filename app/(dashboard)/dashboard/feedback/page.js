"use client";

import {useUserData} from "@/app/hooks/useUserData";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import React, {useState} from "react";
import {FaStar} from "react-icons/fa";
import {toast} from "react-toastify";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {data: userData, isLoading} = useUserData();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) {
      toast.error("Please provide rating and feedback");
      return;
    }
    try {
      setLoading(true);
      await axios
        .post("/api/reviews", {
          authorName: userData?.name,
          authorImage: userData?.photo || "",
          email: userData.email,
          rating,
          message,
        })
        .then((data) => {
          if (data.data?.insertedId) {
            toast.success("Feedback Submitted");
            setLoading(false);
            setRating("");
            setMessage("");
          }
        });
    } catch (err) {
      setLoading(false);
      toast.error("Failed to Sending Feedback. Please Try Again");
    }
  };
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen ">
      <div className="w-full rounded-xl shadow-lg border border-border-color">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-color">
          <h1 className="text-2xl font-bold ">Share Your Feedback</h1>
          <p className="text-neutral mt-1">
            Your feedback helps us improve our service
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">
              Rate your experience
            </label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      size={28}
                      className={`transition-colors ${
                        value <= (hover || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">
              Your feedback
            </label>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your experience here..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {message.length}/500
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <PrimaryBtn
              className={`disabled:opacity-60`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
