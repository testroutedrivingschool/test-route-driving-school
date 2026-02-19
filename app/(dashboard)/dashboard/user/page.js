"use client";

import React, { useEffect } from "react";
import { FiBarChart2, FiCalendar, FiArrowRight } from "react-icons/fi";
import { FaCar, FaUserGraduate } from "react-icons/fa";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useUserData } from "@/app/hooks/useUserData";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UserDashboard() {
  const router = useRouter();
  const { data: userData, isLoading } = useUserData();

  useEffect(() => {
    if (userData?.role === "instructor") {
      router.replace("/dashboard/instructor-dashboard");
    }
  }, [userData?.role, router]);

  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ["user-dashboard", userData?.email],
    enabled: !!userData?.email && userData?.role === "user",
    queryFn: async () => {
      const res = await axios.get(`/api/stats?role=user&email=${userData.email}`);
      return res.data;
    },
  });

  if (isLoading || dashLoading) return <LoadingSpinner />;
  if (userData?.role === "instructor") return null;

  const stats = dash?.stats || {};
const nextLessons = dash?.nextLessons || [];

  const cards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings ?? 0,
      icon: <FiCalendar />,
    },
    {
      title: "Completed Lessons",
      value: stats.completedLessons ?? 0,
      icon: <FaCar />,
    },
    {
      title: "Upcoming Lessons",
      value: stats.upcomingLessons ?? 0,
      icon: <FiBarChart2 />,
    },
    {
      title: "Hours Driven",
      value: `${stats.hoursDriven ?? 0}h`,
      icon: <FaUserGraduate />,
    },
  ];

  return (
    <>
      {/* Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {userData?.name || ""}! 👋
          </h1>
          <p className="text-neutral mt-1">
            Track your progress, manage bookings, and keep moving toward your licence.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/bookings")}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition inline-flex items-center gap-2"
          >
            Book a Lesson <FiArrowRight />
          </button>
          <button
            onClick={() => router.push("/dashboard/user/my-bookings")}
            className="px-4 py-2 rounded-xl border border-border-color bg-white font-semibold hover:bg-gray-50 transition"
          >
            My Bookings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-border-color shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                {c.icon}
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-bold text-gray-900">{c.value}</h3>
            <p className="text-neutral">{c.title}</p>
          </div>
        ))}
      </div>

      {/* Next lesson */}
     <div className="bg-white rounded-2xl p-6 border border-border-color">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold">Upcoming Lessons</h2>
    <button
      onClick={() => router.push("/dashboard/user/my-bookings")}
      className="text-sm font-semibold text-primary hover:underline"
    >
      View all
    </button>
  </div>

  {nextLessons.length > 0 ? (
    <div className="space-y-4">
      {nextLessons.map((lesson) => (
        <div
          key={lesson.bookingId}
          className="rounded-xl bg-gray-50 border border-border-color p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-sm transition"
        >
          <div>
            <p className="font-semibold text-gray-900">{lesson.type}</p>
            <p className="text-sm text-neutral">{lesson.dateText}</p>
            <p className="text-sm text-gray-600">
              Instructor:{" "}
              <span className="font-medium">{lesson.instructor}</span>
            </p>
            {(lesson.suburb || lesson.address) && (
              <p className="text-sm text-gray-600">
                Location:{" "}
                {[lesson.address, lesson.suburb]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
             Status:  <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {String(lesson.status).toUpperCase()}
            </span>

          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No upcoming lessons</p>
  )}
</div>

    </>
  );
}
