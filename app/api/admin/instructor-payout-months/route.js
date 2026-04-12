import { bookingsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

function isEligibleBooking(booking) {
  if (!booking) return false;
  if (booking.status === "cancelled") return false;
  if (booking.paymentStatus === "unpaid") return false;
  return true;
}

function getMonthKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleString("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function GET() {
  try {
    const bookings = await (await bookingsCollection())
      .find({})
      .project({
        bookingDate: 1,
        status: 1,
        paymentStatus: 1,
      })
      .toArray();

    const monthSet = new Set();

    for (const booking of bookings) {
      if (!isEligibleBooking(booking)) continue;
      const monthKey = getMonthKey(booking.bookingDate);
      if (monthKey) monthSet.add(monthKey);
    }

    const months = Array.from(monthSet)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((value) => ({
        value,
        label: formatMonthLabel(value),
      }));

    return NextResponse.json(months);
  } catch (error) {
    console.error("GET /api/admin/instructor-payout-months error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payout months" },
      { status: 500 }
    );
  }
}