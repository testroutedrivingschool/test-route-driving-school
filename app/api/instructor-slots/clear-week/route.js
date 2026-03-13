import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { instructorSlotsCollection, bookingsCollection } from "@/app/libs/mongodb/db";

function formatDate(d) {
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      instructorId,
      weekStart,
      deleteBookingsWhenClearing = false,
    } = body || {};

    if (!instructorId || !weekStart) {
      return NextResponse.json(
        { error: "instructorId and weekStart are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(instructorId)) {
      return NextResponse.json({ error: "Invalid instructorId" }, { status: 400 });
    }

    const instructorObjectId = new ObjectId(instructorId);
    const slotsCol = await instructorSlotsCollection();
    const bookingsCol = await bookingsCollection();

    const weekDates = getWeekDates(weekStart);
    const weekEnd = weekDates[6];

    if (!deleteBookingsWhenClearing) {
      const bookingExists = await bookingsCol.countDocuments({
        $or: [
          { instructorId: instructorId },
          { instructorId: instructorObjectId },
        ],
        bookingDate: {
          $gte: `${weekStart}T00:00:00.000Z`,
          $lte: `${weekEnd}T23:59:59.999Z`,
        },
      });

      if (bookingExists > 0) {
        return NextResponse.json(
          {
            error:
              "This week has bookings. Enable deleteBookingsWhenClearing if you want to remove them too.",
          },
          { status: 400 }
        );
      }
    }

    const deletedSlots = await slotsCol.deleteMany({
      instructorId: instructorObjectId,
      date: { $gte: weekStart, $lte: weekEnd },
    });

    let deletedBookings = { deletedCount: 0 };

    if (deleteBookingsWhenClearing) {
      deletedBookings = await bookingsCol.deleteMany({
        $or: [
          { instructorId: instructorId },
          { instructorId: instructorObjectId },
        ],
        bookingDate: {
          $gte: `${weekStart}T00:00:00.000Z`,
          $lte: `${weekEnd}T23:59:59.999Z`,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      deletedSlots: deletedSlots.deletedCount,
      deletedBookings: deletedBookings.deletedCount || 0,
      weekStart,
      weekEnd,
    });
  } catch (err) {
    console.error("clear-week error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}