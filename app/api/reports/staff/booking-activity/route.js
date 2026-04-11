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

    const instructor = searchParams.get("instructor") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const mongoFilter = {};

    if (instructorEmail && instructor) {
      mongoFilter.$or = [
        { instructorEmail },
        { instructorName: instructor },
      ];
    } else if (instructorEmail) {
      mongoFilter.instructorEmail = instructorEmail;
    } else if (instructor) {
      mongoFilter.instructorName = instructor;
    }

    let bookings = await (await bookingsCollection()).find(mongoFilter).toArray();

    if (dateFrom && dateTo) {
      bookings = bookings.filter((booking) => {
        const bookingDateOnly = getDateOnly(booking.bookingDate);
        if (!bookingDateOnly) return false;
        return bookingDateOnly >= dateFrom && bookingDateOnly <= dateTo;
      });
    }

    const validBookings = bookings.filter((booking) => booking.status !== "deleted");

    const bookingsCount = validBookings.length;

    const serviceHours = validBookings.reduce((sum, booking) => {
      return sum + num(booking.minutes) / 60;
    }, 0);

    const serviceValue = validBookings.reduce((sum, booking) => {
      const price = num(
        booking.overridePrice ?? booking.price ?? booking.originalPrice
      );
      return sum + price;
    }, 0);

    const clientBookingsMap = new Map();

    for (const booking of validBookings) {
      const clientKey =
        booking.clientId ||
        booking.clientEmail ||
        booking.userEmail ||
        booking.clientPhone ||
        booking.userPhone;

      if (!clientKey) continue;

      if (!clientBookingsMap.has(clientKey)) {
        clientBookingsMap.set(clientKey, []);
      }

      clientBookingsMap.get(clientKey).push(booking);
    }

    for (const [, items] of clientBookingsMap.entries()) {
      items.sort((a, b) => {
        const aDate = new Date(a.bookingDate || a.createdAt || 0).getTime();
        const bDate = new Date(b.bookingDate || b.createdAt || 0).getTime();
        return aDate - bDate;
      });
    }

    let newClientsFirstBooking = 0;
    let newClientsRebookedSameInstructor = 0;
    let newClientsRebookedDifferentInstructor = 0;
    let totalClientsRebookedAnyInstructor = 0;

    for (const [, clientBookings] of clientBookingsMap.entries()) {
      const firstBooking = clientBookings[0];
      if (firstBooking) {
        newClientsFirstBooking += 1;
      }

      if (clientBookings.length > 1) {
        totalClientsRebookedAnyInstructor += 1;

        const firstInstructor = firstBooking?.instructorEmail || firstBooking?.instructorName;
        const hasSameInstructorRebook = clientBookings
          .slice(1)
          .some(
            (b) =>
              (b.instructorEmail || b.instructorName) === firstInstructor
          );

        const hasDifferentInstructorRebook = clientBookings
          .slice(1)
          .some(
            (b) =>
              (b.instructorEmail || b.instructorName) !== firstInstructor
          );

        if (hasSameInstructorRebook) {
          newClientsRebookedSameInstructor += 1;
        }

        if (hasDifferentInstructorRebook) {
          newClientsRebookedDifferentInstructor += 1;
        }
      }
    }

    const totalClients = clientBookingsMap.size;

    const cancelledBookings = validBookings.filter(
      (booking) => String(booking.status || "").toLowerCase() === "cancelled"
    ).length;

    const unattendedBookings = validBookings.filter(
      (booking) => String(booking.status || "").toLowerCase() === "unattended"
    ).length;

    const row = {
      instructor: instructor || validBookings[0]?.instructorName || "-",
      bookings: bookingsCount,
      serviceHours,
      serviceValue,
      newClientsFirstBooking,
      newClientsRebookedSameInstructor,
      newClientsRebookedDifferentInstructor,
      totalClients,
      totalClientsRebookedAnyInstructor,
      cancelledBookings,
      unattendedBookings,
    };

    return NextResponse.json({
      rows: bookingsCount > 0 ? [row] : [],
      summary: bookingsCount > 0 ? row : null,
    });
  } catch (error) {
    console.error("Staff booking activity API error:", error);

    return NextResponse.json(
      { error: "Failed to generate booking activity report" },
      { status: 500 }
    );
  }
}