import { NextResponse } from "next/server";
import { bookingsCollection } from "@/app/libs/mongodb/db";

function num(value) {
  return Number(value || 0);
}

function getDateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const organisation = searchParams.get("organisation") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const dateType = searchParams.get("dateType") || "booking";

    const mongoFilter = {
      status: "cancelled",
    };

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

    const filterOptions = {
      locations: [...new Set(bookings.map((b) => b.location || b.suburb).filter(Boolean))].sort(),
      organisations: [...new Set(bookings.map((b) => b.organisation).filter(Boolean))].sort(),
    };

    bookings = bookings.filter((booking) => {
      if (location !== "all") {
        const bookingLocation = booking.location || booking.suburb || "";
        if (bookingLocation !== location) return false;
      }

      if (organisation !== "all" && (booking.organisation || "") !== organisation) {
        return false;
      }

      if (dateFrom && dateTo) {
        const compareDate =
          dateType === "cancelled"
            ? getDateOnly(booking.updatedAt || booking.cancelledAt)
            : getDateOnly(booking.bookingDate);

        if (!compareDate) return false;
        if (compareDate < dateFrom || compareDate > dateTo) return false;
      }

      return true;
    });

    const rows = bookings
      .map((booking) => {
        const price = num(
          booking.overridePrice ?? booking.price ?? booking.originalPrice
        );

        return {
          _id: String(booking._id),
          client: booking.clientName || booking.userName || "-",
          service: [booking.serviceName, booking.duration].filter(Boolean).join(" ") || "-",
          location: booking.location || booking.suburb || "-",
          organisation: booking.organisation || "-",
          bookingType: booking.bookingType || "-",
          bookingDate: booking.bookingDate || null,
          cancellationDate: booking.updatedAt || booking.cancelledAt || null,
          staff: booking.instructorName || "-",
          price,
          status: booking.status || "-",
        };
      })
      .sort((a, b) => {
        const aTime = new Date(
          dateType === "cancelled" ? a.cancellationDate : a.bookingDate
        ).getTime();
        const bTime = new Date(
          dateType === "cancelled" ? b.cancellationDate : b.bookingDate
        ).getTime();
        return bTime - aTime;
      });

    const summary = rows.reduce(
      (acc, row) => {
        acc.totalCancelledBookings += 1;
        acc.totalCancelledValue += num(row.price);
        return acc;
      },
      {
        totalCancelledBookings: 0,
        totalCancelledValue: 0,
      }
    );

    return NextResponse.json({
      rows,
      summary: rows.length > 0 ? summary : null,
      filterOptions,
    });
  } catch (error) {
    console.error("Cancellations API error:", error);

    return NextResponse.json(
      { error: "Failed to generate cancellations report" },
      { status: 500 }
    );
  }
}