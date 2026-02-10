export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { bookingsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

function safe(v) {
  return v === null || v === undefined ? "" : String(v);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// bookingDate is STRING in DB (ISO string)
function buildDateRangeString(dateFrom, dateTo) {
  const from = dateFrom ? `${dateFrom}T00:00:00.000Z` : null;
  const to = dateTo ? `${dateTo}T00:00:00.000Z` : null;

  const range = {};
  if (from) range.$gte = from;

  if (to) {
    const end = new Date(to);
    end.setUTCDate(end.getUTCDate() + 1);
    range.$lt = end.toISOString(); // end-exclusive
  }

  return Object.keys(range).length ? range : null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const dateFrom = safe(searchParams.get("dateFrom")).trim();
    const dateTo = safe(searchParams.get("dateTo")).trim();
    const description = safe(searchParams.get("description")).trim(); // ✅

    const filter = { bookingType: "manual" };

    // ✅ Date filter
    const range = buildDateRangeString(dateFrom, dateTo);
    if (range) filter.bookingDate = range;

    // ✅ Description filter (serviceName only)
    if (description) {
      const words = description
        .split(/\s+/)
        .map((w) => w.trim())
        .filter(Boolean)
        .map(escapeRegex);


      const pattern = words.join(".*");
      filter.serviceName = new RegExp(pattern, "i");
    }

    const bookings = await (await bookingsCollection())
      .find(filter)
      .sort({ bookingDate: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("GET /api/sales/manual error:", err);
    return NextResponse.json(
      { error: "Failed to fetch manual sales" },
      { status: 500 }
    );
  }
}
