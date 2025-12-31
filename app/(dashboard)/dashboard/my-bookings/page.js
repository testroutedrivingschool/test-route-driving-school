"use client";

import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {FiCalendar} from "react-icons/fi";

export default function MyBookings() {
  const {data: user, isLoading: isUserLoading} = useUserData();
  console.log(user);
  const {data: bookings = [], isLoading} = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  console.log(bookings);
  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className=" rounded-xl shadow border border-border-color p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiCalendar /> My Bookings
      </h2>
<div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="border border-border-color rounded-xl p-4 shadow-sm bg-base-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
            <p>
              <strong>Instructor:</strong> {booking.instructorName} (
              {booking.instructorEmail})
            </p>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(booking.bookingDate).toLocaleDateString()} -{" "}
              {booking.bookingTime}
            </p>
            <p>
              <strong>Duration:</strong> {booking.duration}
            </p>
            <p>
              <strong>Location:</strong> {booking.address}, {booking.suburb}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-lg font-semibold mb-2">
              Price: ${booking.price}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-white font-medium ${
                booking.status === "paid"
                  ? "bg-green-500"
                  : booking.status === "pending"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>
      ))}</div>
    </div>
  );
}
