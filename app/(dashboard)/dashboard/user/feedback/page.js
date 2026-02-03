"use client";

import {useUserData} from "@/app/hooks/useUserData";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import React, {useMemo, useState} from "react";
import {FaStar} from "react-icons/fa";
import {toast} from "react-toastify";
import {useQuery} from "@tanstack/react-query";

export default function Feedback() {
  const {data: userData, isLoading} = useUserData();

  // dropdown state
  const [feedbackFor, setFeedbackFor] = useState("website"); // "website" or instructor email

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // instructors list
  const {data: instructors = [], isLoading: isInstructorsLoading} = useQuery({
    queryKey: ["instructors-feedback-list"],
    queryFn: async () => {
      const res = await axios.get("/api/instructors");
      return res.data || [];
    },
    enabled: !!userData,
  });

  const approvedInstructors = useMemo(() => {
    return (instructors || [])
      .filter((i) => i?.status === "approved")
      .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
  }, [instructors]);

const authorImageData = useMemo(() => {
  // Prefer MinIO key if available
  if (userData?.photoKey) {
    return {
      authorImageKey: userData.photoKey,
      authorImage: "", // keep empty
    };
  }

  // Otherwise use direct URL (Google, legacy)
  if (userData?.photo) {
    return {
      authorImageKey: "",
      authorImage: userData.photo,
    };
  }

  return {
    authorImageKey: "",
    authorImage: "",
  };
}, [userData]);


  const selectedInstructor = useMemo(() => {
    if (feedbackFor === "website") return null;
    return approvedInstructors.find((i) => i.email === feedbackFor) || null;
  }, [feedbackFor, approvedInstructors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) {
      toast.error("Please provide rating and feedback");
      return;
    }

    try {
      setLoading(true);

      const targetType = feedbackFor === "website" ? "website" : "instructor";
      const payload = {
  authorName: userData?.name || "User",
  email: userData?.email,
  rating,
  message: message.trim().slice(0, 500),

  // ✅ image fields (ONLY one will be filled)
  authorImage: authorImageData.authorImage,
  authorImageKey: authorImageData.authorImageKey,

  targetType,
  targetName:
    targetType === "website"
      ? "Test Route Driving School"
      : selectedInstructor?.name || "Instructor",
  targetEmail: targetType === "instructor" ? selectedInstructor?.email : "",
};


      const res = await axios.post("/api/reviews", payload);

      if (res.data?.insertedId) {
        toast.success("Feedback Submitted");
        setRating(0);
        setHover(0);
        setMessage("");
        setFeedbackFor("website");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send feedback. Please try again");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <div className="w-full rounded-xl shadow-lg border border-border-color bg-white">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-color">
          <h1 className="text-2xl font-bold">Share Your Feedback</h1>
          <p className="text-neutral mt-1">
            Your feedback helps us improve our service
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Feedback for */}
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">
              Feedback for
            </label>

            <select
              value={feedbackFor}
              onChange={(e) => setFeedbackFor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="website">Test Route Driving School</option>

              {isInstructorsLoading ? (
                <option disabled>Loading instructors...</option>
              ) : (
                approvedInstructors.map((ins) => (
                  <option key={ins.email} value={ins.email}>
                    {ins.name}
                  </option>
                ))
              )}
            </select>

            {feedbackFor !== "website" && selectedInstructor && (
              <p className="text-xs text-gray-500 mt-2">
                You are sending feedback to:{" "}
                <span className="font-semibold">{selectedInstructor.name}</span>
              </p>
            )}
          </div>

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
              Comment
            </label>
            <textarea
              rows="6"
              value={message}
              maxLength={500}
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
            <PrimaryBtn type="submit" disabled={loading} className="disabled:opacity-60">
              {loading ? "Submitting..." : "Submit Feedback"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
