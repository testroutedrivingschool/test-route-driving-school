"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiMapPin, FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { toast } from "react-toastify";

function formatDateAU(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function toBookingDateTime(bookingDate, bookingTime) {
  const d = new Date(bookingDate);
  if (Number.isNaN(d.getTime())) return null;

  const t = String(bookingTime || "").trim().toUpperCase();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!m) return d;

  let hh = Number(m[1]);
  const mm = Number(m[2] || 0);
  const ap = m[3];

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  const combined = new Date(d);
  combined.setHours(hh, mm, 0, 0);
  return combined;
}

function canUserReschedule(bookingDate, bookingTime) {
  const dt = toBookingDateTime(bookingDate, bookingTime);
  if (!dt) return false;
  return dt.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

export default function UserBookings() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useUserData();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?email=${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-color bg-white shadow-sm">
      <div className="p-6 border-b border-border-color flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <FiCalendar /> My Bookings
          </h2>
          <p className="text-sm opacity-70 mt-2">
            <b>Reschedule rule:</b> You must reschedule at least <b>24 hours</b> before the booking time.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {bookings.map((b) => {
          const allow = canUserReschedule(b.bookingDate, b.bookingTime);
          const when = `${formatDateAU(b.bookingDate)} • ${b.bookingTime || "—"}`;
          const where = [b.address, b.suburb].filter(Boolean).join(", ");

          return (
            <div key={b._id} className="rounded-xl border border-border-color bg-base-100 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{b.serviceName}</h3>

                  <div className="text-sm opacity-85">
                    <b>Instructor:</b> {b.instructorName || "—"}{" "}
                    {b.instructorEmail ? <span className="opacity-70">({b.instructorEmail})</span> : null}
                  </div>

                  <div className="flex flex-col gap-3  text-sm">
                    <div className="flex items-center gap-2 opacity-85">
                      <FiClock className="text-lg hidden sm:block" />
                      <span><b>Date & Time:</b> {when}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <FiMapPin className="text-xl md:text-lg hidden sm:block" />
                      <span><b>Location:</b> {where || "—"}</span>
                    </div>
                    <div className="opacity-85">
                      <b>Duration:</b> {b.duration || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between gap-3 md:min-w-60">
                  <div className="text-left">
                    <div className="text-sm opacity-70">Price:</div>
                    <div className="text-xl font-bold">${Number(b.price || 0).toFixed(2)}</div>
                  </div>

                  <button
                    type="button"
                    disabled={!allow}
                    onClick={() => {
                      if (!allow) return toast.error("Reschedule is only allowed 24 hours before.");
                      router.push(`/bookings?reschedule=1&bookingId=${b._id}`);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                      allow
                        ? "bg-primary text-white border-border-color hover:bg-base-200"
                        : "bg-base-200 border-border-color opacity-60 cursor-not-allowed"
                    }`}
                    title={allow ? "Reschedule" : "Locked within 24 hours"}
                  >
                    <FiEdit3 />
                    Reschedule
                  </button>
 {!allow && (
                    <p className="hidden md:block text-xs opacity-60 text-right">
                      Locked: within 24 hours of the booking time.
                    </p>
                  )}
                </div>
              </div>
                  {!allow && (
                    <p className="md:hidden text-xs opacity-60 text-right mt-2">
                      Locked: within 24 hours of the booking time.
                    </p>
                  )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
