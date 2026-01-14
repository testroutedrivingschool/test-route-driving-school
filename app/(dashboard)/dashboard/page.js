"use client";

import React from "react";
import {FiBarChart2, FiCalendar} from "react-icons/fi";
import {FaCar, FaUserGraduate} from "react-icons/fa";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useUserData } from "@/app/hooks/useUserData";


const mockUserStats = {
  stats: {
    totalBookings: 12,
    completedLessons: 8,
    upcomingLessons: 3,
    hoursDriven: 26,
  },
  nextLesson: {
    type: "Beginner Driving",
    date: "Tomorrow, 10:00 AM",
    instructor: "John Smith",
    status: "Confirmed",
  },
};



export default function DashboardHome() {
  const {data: mergedUserData, isLoading} = useUserData();
  const mergedmergedUserData = {
  ...mergedUserData,
  ...(mergedUserData?.role === "user" && mockUserStats),
};

  return (
    <>
      {isLoading ? (
        <LoadingSpinner/>
      ) : (
        <>
          {/* Welcome Banner */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {mergedmergedUserData?.name || ""}! 👋
            </h1>
            <p className="text-gray-600">
              Track your progress, manage bookings, and continue your driving
              journey.
            </p>
          </div>

          {/* Stats Cards */}
          {mergedmergedUserData?.role === "user" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[
      {
        title: "Total Bookings",
        value: mergedmergedUserData?.stats?.totalBookings || 2,
        icon: <FiCalendar className="text-blue-600" />,
        bg: "bg-blue-50",
      },
      {
        title: "Completed Lessons",
        value: mergedmergedUserData?.stats?.completedLessons || 1,
        icon: <FaCar className="text-green-600" />,
        bg: "bg-green-50",
      },
      {
        title: "Upcoming Lessons",
        value: mergedmergedUserData?.stats?.upcomingLessons || 1,
        icon: <FiBarChart2 className="text-purple-600" />,
        bg: "bg-purple-50",
      },
      {
        title: "Hours Driven",
        value: `${mergedmergedUserData?.stats?.hoursDriven || 20}h`,
        icon: <FaUserGraduate className="text-orange-600" />,
        bg: "bg-orange-50",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${item.bg}`}>
            <div className="text-xl">{item.icon}</div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
        <p className="text-gray-600">{item.title}</p>
      </div>
    ))}
  </div>
)}


          {mergedmergedUserData?.role === "user" && (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
    <h2 className="text-xl font-bold mb-4">Next Lesson</h2>

    {mergedmergedUserData?.nextLesson ? (
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
        <div>
          <p className="font-semibold">{mergedmergedUserData.nextLesson.type}</p>
          <p className="text-sm text-gray-600">
            {mergedmergedUserData.nextLesson.date}
          </p>
          <p className="text-sm text-gray-500">
            Instructor: {mergedmergedUserData.nextLesson.instructor}
          </p>
        </div>
        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          {mergedmergedUserData.nextLesson.status}
        </span>
      </div>
    ) : (
      <p className="text-gray-500">No upcoming lessons</p>
    )}
  </div>
)}



        </>
      )}
    </>
  );
}
