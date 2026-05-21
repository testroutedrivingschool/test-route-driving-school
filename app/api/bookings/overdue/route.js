export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { bookingsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

const TIME_ZONE = "Australia/Sydney";

function getZonedParts(date, timeZone = TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

function parseBookingTime(timeText = "") {
  const clean = String(timeText).replace(/\s+/g, "").toUpperCase();

  const match = clean.match(/^(\d{1,2})(?::(\d{2}))?(AM|PM)$/);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const ampm = match[3];

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return {
    hour,
    minute,
  };
}

function getBookingEndLocalTimestamp(booking) {
  if (!booking?.bookingDate || !booking?.bookingTime) return null;

  const date = new Date(booking.bookingDate);

  if (Number.isNaN(date.getTime())) return null;

  const dateParts = getZonedParts(date);
  const timeParts = parseBookingTime(booking.bookingTime);

  if (!timeParts) return null;

  const startLocalTimestamp = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    timeParts.hour,
    timeParts.minute,
    0,
    0
  );

  const minutes = Number(booking.minutes || 0);

  return startLocalTimestamp + minutes * 60 * 1000;
}

function getNowLocalTimestamp() {
  const nowParts = getZonedParts(new Date());

  return Date.UTC(
    nowParts.year,
    nowParts.month - 1,
    nowParts.day,
    nowParts.hour,
    nowParts.minute,
    0,
    0
  );
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const instructorEmail = searchParams.get("instructorEmail");
    const instructorId = searchParams.get("instructorId");

    if (!instructorEmail && !instructorId) {
      return NextResponse.json(
        { error: "Instructor email or instructorId is required" },
        { status: 400 }
      );
    }

    const instructorFilters = [];

    if (instructorEmail) {
      instructorFilters.push({ instructorEmail });
    }

    if (instructorId) {
      instructorFilters.push({ instructorId });
    }

    const filter = {
      status: {
        $nin: ["completed", "cancelled", "unattended"],
      },
      ...(instructorFilters.length > 1
        ? { $or: instructorFilters }
        : instructorFilters[0]),
    };

    const bookings = await (await bookingsCollection())
      .find(filter)
      .sort({ bookingDate: 1, createdAt: -1 })
      .toArray();

    const nowLocalTimestamp = getNowLocalTimestamp();

    const overdueBookings = bookings.filter((booking) => {
      const bookingEndLocalTimestamp = getBookingEndLocalTimestamp(booking);

      if (!bookingEndLocalTimestamp) return false;

      return bookingEndLocalTimestamp <= nowLocalTimestamp;
    });

    return NextResponse.json({
      ok: true,
      bookings: overdueBookings,
    });
  } catch (error) {
    console.error("OVERDUE BOOKINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch overdue bookings" },
      { status: 500 }
    );
  }
}