import { bookingsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";




const TZ = "Australia/Sydney";

const VALID_PERIOD_TYPES = ["daily", "weekly", "fortnight", "monthly"];

function normalizePeriodType(v) {
  return VALID_PERIOD_TYPES.includes(v) ? v : "monthly";
}

function isEligibleBooking(booking) {
  if (!booking) return false;

  const status = String(booking.status || "").toLowerCase();
  const paymentStatus = String(booking.paymentStatus || "").toLowerCase();

  // ✅ you said no need completed mandatory
  if (status === "cancelled") return false;

  // ✅ only money received bookings
  if (paymentStatus === "unpaid") return false;

  return true;
}



function getSydneyDateParts(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  if (!year || !month || !day) return null;

  return {year, month, day};
}

function localDateAsUTC(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function dateKeyUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysUTC(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function startOfWeekMondayUTC(date) {
  const d = new Date(date);
  const day = d.getUTCDay(); // Sun=0, Mon=1
  const diffToMonday = (day + 6) % 7;
  return addDaysUTC(d, -diffToMonday);
}

function startOfFortnightUTC(date) {
  const weekStart = startOfWeekMondayUTC(date);

  // Monday anchor
  const anchor = new Date(Date.UTC(1970, 0, 5));
  const days = Math.floor((weekStart.getTime() - anchor.getTime()) / 86400000);
  const fortnightStartOffset = Math.floor(days / 14) * 14;

  return addDaysUTC(anchor, fortnightStartOffset);
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMonthLabel(baseKey) {
  const [year, month] = baseKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.toLocaleString("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getPeriodFromBookingDate(dateValue, periodType) {
  const parts = getSydneyDateParts(dateValue);
  if (!parts) return null;

  const localDate = localDateAsUTC(parts);

  if (periodType === "daily") {
    const baseKey = dateKeyUTC(localDate);

    return {
      value: `daily:${baseKey}`,
      label: formatDateLabel(localDate),
      sortDate: localDate,
    };
  }

  if (periodType === "weekly") {
    const start = startOfWeekMondayUTC(localDate);
    const end = addDaysUTC(start, 6);
    const baseKey = dateKeyUTC(start);

    return {
      value: `weekly:${baseKey}`,
      label: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
      sortDate: start,
    };
  }

  if (periodType === "fortnight") {
    const start = startOfFortnightUTC(localDate);
    const end = addDaysUTC(start, 13);
    const baseKey = dateKeyUTC(start);

    return {
      value: `fortnight:${baseKey}`,
      label: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
      sortDate: start,
    };
  }

  const baseKey = `${parts.year}-${String(parts.month).padStart(2, "0")}`;

  return {
    value: `monthly:${baseKey}`,
    label: formatMonthLabel(baseKey),
    sortDate: new Date(Date.UTC(parts.year, parts.month - 1, 1)),
  };
}

export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);
    const periodType = normalizePeriodType(searchParams.get("periodType"));

    const bookings = await (await bookingsCollection())
      .find({})
      .project({
        bookingDate: 1,
        status: 1,
        paymentStatus: 1,
      })
      .toArray();

    const periodMap = new Map();

    for (const booking of bookings) {
      if (!isEligibleBooking(booking)) continue;

      const period = getPeriodFromBookingDate(booking.bookingDate, periodType);
      if (!period) continue;

      if (!periodMap.has(period.value)) {
        periodMap.set(period.value, period);
      }
    }

    const periods = Array.from(periodMap.values())
      .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
      .map(({value, label}) => ({
        value,
        label,
      }));

    return NextResponse.json(periods);
  } catch (error) {
    console.error("GET /api/admin/instructor-payout-months error:", error);

    return NextResponse.json(
      {error: "Failed to fetch payout periods"},
      {status: 500},
    );
  }
}