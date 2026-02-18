"use client";

import Image from "next/image";
import Link from "next/link";

function safe(v, fallback = "") {
  return v ?? fallback;
}

function formatBookingDate(dateLike, timeText) {
  try {
    const d = new Date(dateLike);
    const dateStr = d.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return `${dateStr}${timeText ? ` at ${timeText}` : ""}`;
  } catch {
    return "";
  }
}

export default function BookingHeader({booking}) {
  
  const paymentStatus = String(safe(booking.paymentStatus)).toLowerCase();
  const isPaid = paymentStatus === "paid" || paymentStatus.includes("voucher");

const status = String(safe(booking.status, "pending")).toLowerCase();

const isConfirmed = status === "confirmed";
const isCancelled = status === "cancelled";
const isUnattended = status === "unattended";

const statusClass = isConfirmed
  ? "border-green-600 text-green-600"
  : isCancelled || isUnattended
  ? "border-red-600 text-red-600"
  : "border-gray-400 text-neutral";

  const clientName = safe(booking.userName || booking.clientName, "Client");

  return (
    <div className="rounded-xl p-5 ">
      <div className="flex items-start justify-between gap-4">
        {/* Left: BIG PAID + name */}
        <div className="min-w-0">
          <div
            className={`text-xl md:text-3xl font-bold  ${
              isPaid ? "text-gray-500" : "text-red-500"
            }`}
          >
            {isPaid ? "PAID" : "Payment Required"}
            
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href={`/clients?clientId=${booking.clientId}`}>
              <h2 className="text-xl md:text-3xl font-extrabold text-primary">
                {clientName}
              </h2>
            </Link>
          </div>
        </div>

        {/* Right: status badge */}
        <div className="flex flex-col items-end gap-3">
         <div
  className={`px-4 py-1.5 rounded-md border-2 font-bold tracking-wide ${statusClass}`}
>
  {status.toUpperCase()}
</div>
        </div>
      </div>
    </div>
  );
}
