"use client";

import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { GoPackage } from "react-icons/go";

export default function Purchase() {
  const { data: user, isLoading: isUserLoading } = useUserData();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No Purchase found.</p>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = bookings.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="rounded-xl shadow border border-border-color p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <GoPackage /> Purchase
      </h2>

      {/* Bookings list */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border border-border-color rounded-xl p-4 shadow-sm bg-base-300 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {booking.bookingTime}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-lg font-semibold mb-1">Price: ${booking.price}</p>
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
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end mt-4 p-4 border-t border-border-color">
        <p className="text-xl font-bold">
          Total: ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
