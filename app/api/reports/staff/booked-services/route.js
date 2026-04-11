import { NextResponse } from "next/server";
import { bookingsCollection, locationsCollection } from "@/app/libs/mongodb/db";

function num(value) {
  return Number(value || 0);
}

function getYear(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear();
}

function getMonthIndex(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.getMonth();
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const year = Number(searchParams.get("year")) || new Date().getFullYear();
    const location = searchParams.get("location") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const region = searchParams.get("region") || "all";
    const suburb = searchParams.get("suburb") || "all";

    const mongoFilter = {};

    if (instructorEmail && staff) {
      mongoFilter.$or = [
        { instructorEmail },
        { instructorName: staff },
      ];
    } else if (instructorEmail) {
      mongoFilter.instructorEmail = instructorEmail;
    } else if (staff) {
      mongoFilter.instructorName = staff;
    }

    let bookings = await (await bookingsCollection()).find(mongoFilter).toArray();

    let locationDocs = [];
    try {
      locationDocs = await (await locationsCollection()).find({}).toArray();
    } catch (error) {
      console.error("Failed to load locations:", error);
    }

    const suburbsFromLocations = [
      ...new Set(
        locationDocs
          .map((item) => item?.name)
          .filter(Boolean)
          .map((item) => String(item).trim())
      ),
    ].sort((a, b) => a.localeCompare(b));

    const filterOptions = {
      locations: ["Sydney"],
      regions: ["Sydney"],
      suburbs: suburbsFromLocations,
    };

    bookings = bookings.filter((booking) => {
      const bookingYear = getYear(booking.bookingDate);
      if (bookingYear !== year) return false;

      if (location !== "all" && location !== "Sydney") return false;
      if (region !== "all" && region !== "Sydney") return false;
      if (suburb !== "all" && (booking.suburb || "") !== suburb) return false;

      return true;
    });

    const grouped = new Map();

    for (const booking of bookings) {
      const serviceName =
        [booking.serviceName, booking.duration].filter(Boolean).join(" ").trim() ||
        "Unknown Service";

      const monthIndex = getMonthIndex(booking.bookingDate);
      if (monthIndex === null) continue;

      const price = num(
        booking.overridePrice ?? booking.price ?? booking.originalPrice
      );

      if (!grouped.has(serviceName)) {
        grouped.set(serviceName, {
          name: booking.instructorName || staff || "-",
          serviceName,
          monthlyCounts: Array(12).fill(0),
          monthlyAmounts: Array(12).fill(0),
          totalCount: 0,
          totalAmount: 0,
        });
      }

      const row = grouped.get(serviceName);
      row.monthlyCounts[monthIndex] += 1;
      row.monthlyAmounts[monthIndex] += price;
      row.totalCount += 1;
      row.totalAmount += price;
    }

    const rows = Array.from(grouped.values()).sort((a, b) =>
      a.serviceName.localeCompare(b.serviceName)
    );

    const summary = {
      monthlyCounts: Array(12).fill(0),
      monthlyAmounts: Array(12).fill(0),
      totalCount: 0,
      totalAmount: 0,
    };

    for (const row of rows) {
      for (let i = 0; i < 12; i += 1) {
        summary.monthlyCounts[i] += row.monthlyCounts[i];
        summary.monthlyAmounts[i] += row.monthlyAmounts[i];
      }
      summary.totalCount += row.totalCount;
      summary.totalAmount += row.totalAmount;
    }

    return NextResponse.json({
      rows,
      summary: rows.length > 0 ? summary : null,
      filterOptions,
    });
  } catch (error) {
    console.error("Booked services API error:", error);

    return NextResponse.json(
      { error: "Failed to generate booked services report" },
      { status: 500 }
    );
  }
}