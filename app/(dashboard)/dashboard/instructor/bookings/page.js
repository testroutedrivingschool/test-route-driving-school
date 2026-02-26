"use client";

import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FiCalendar, FiEdit3, FiMapPin, FiClock, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";

export default function InstructorMyBookings() {
  const { data: user, isLoading: isUserLoading } = useUserData();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Filter bookings based on status
  const filteredBookings = filterStatus === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);

  // Simple stats
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;

  const getStatusStyle = (status) => {
    switch(status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!bookings.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <FiCalendar className="text-5xl text-gray-300 mb-4" />
        <p className="text-lg text-neutral">No bookings found</p>
        <p className="text-sm text-gray-400 mt-2">Your scheduled bookings will appear here</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FiCalendar className="text-primary" />
          My Instructor Bookings
        </h1>
        <p className="text-neutral text-sm mt-1">Manage and reschedule your upcoming sessions</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-semibold text-gray-800">{bookings.length}</p>
          <p className="text-xs text-neutral uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-semibold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-neutral uppercase tracking-wider mt-1">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-semibold text-primary">{confirmedCount}</p>
          <p className="text-xs text-neutral uppercase tracking-wider mt-1">Confirmed</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-semibold text-emerald-600">{completedCount}</p>
          <p className="text-xs text-neutral uppercase tracking-wider mt-1">Completed</p>
        </div>
      </div>

      {/* Simple Filter */}
      <div className="mb-6">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-border-color rounded-lg text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl border border-border-color p-4 hover:border-border-color  transition-all duration-200"
          >
            {/* Mobile: Stacked, Desktop: Row */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              
              {/* Left Section - Main Content */}
              <div className="flex-1 space-y-3">
                {/* Title and Status Row */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg md:text-lg font-bold text-gray-900">
                    {booking.serviceName}
                  </h3>
                  <div>

                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                  
                  </div>
                  
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {/* Student Name */}
                  <div className="flex items-center gap-2 text-neutral">
                    <FiUser className="text-gray-400 shrink-0" size={14} />
                    <span className="truncate">
                      {booking.userName || booking.clientName || "Student"}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-neutral">
                    <FiClock className="text-gray-400 shrink-0" size={14} />
                    <span>
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} • {booking.bookingTime}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-neutral">
                    <FiClock className="text-gray-400 shrink-0" size={14} />
                    <span>{booking.duration}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-neutral">
                    <FiMapPin className="text-gray-400 shrink-0" size={14} />
                    <span className="truncate">{booking.suburb}</span>
                  </div>
                </div>

                {/* Full Address (if needed) */}
                <p className="text-xs text-gray-400 truncate">
                  {booking.address}
                </p>
              </div>

              {/* Right Section - Price and Action */}
              <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-4 md:gap-2 md:min-w-[140px] pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-xl font-semibold text-gray-800">
                    ${booking.price}
                  </p>
                </div>
                
                <PrimaryBtn
                  onClick={() =>
                    router.push(`/instructor-bookings?moveBookingId=${booking._id}`)
                  }
                  className="px-4! py-2! text-sm   transition-all flex items-center gap-2 rounded-lg!"
                >
                  <FiEdit3 size={14} />
                  Reschedule
                </PrimaryBtn>
              </div>
            </div>
          </div>
        ))}

        {/* Show message if no bookings match filter */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-border-color">
            <p className="text-neutral">No {filterStatus} bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}