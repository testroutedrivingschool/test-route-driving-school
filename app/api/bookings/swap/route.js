import { bookingsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sourceBookingId, targetBookingId } = body || {};

    if (!ObjectId.isValid(sourceBookingId) || !ObjectId.isValid(targetBookingId)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    if (sourceBookingId === targetBookingId) {
      return NextResponse.json({ error: "Cannot swap same booking" }, { status: 400 });
    }

    const bookingsCol = await bookingsCollection();

    const source = await bookingsCol.findOne({ _id: new ObjectId(sourceBookingId) });
    const target = await bookingsCol.findOne({ _id: new ObjectId(targetBookingId) });

    if (!source || !target) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // same instructor only
    if (String(source.instructorId || "") !== String(target.instructorId || "")) {
      return NextResponse.json(
        { error: "Swap allowed only between same instructor bookings" },
        { status: 400 }
      );
    }

    // same duration only
    const sourceMinutes = Number(source.minutes || 0);
    const targetMinutes = Number(target.minutes || 0);

    if (!sourceMinutes || !targetMinutes || sourceMinutes !== targetMinutes) {
      return NextResponse.json(
        { error: "Swap requires same lesson duration" },
        { status: 400 }
      );
    }

    // optional: block completed/cancelled
    const blocked = new Set(["completed", "cancelled"]);
    if (blocked.has(String(source.status || "").toLowerCase()) || blocked.has(String(target.status || "").toLowerCase())) {
      return NextResponse.json(
        { error: "Completed or cancelled bookings cannot be swapped" },
        { status: 400 }
      );
    }

    const sourceDate = source.bookingDate;
    const sourceTime = source.bookingTime;
    const targetDate = target.bookingDate;
    const targetTime = target.bookingTime;

    const now = new Date();

    await bookingsCol.updateOne(
      { _id: source._id },
      {
        $set: {
          bookingDate: targetDate,
          bookingTime: targetTime,
          updatedAt: now,
        },
      }
    );

    await bookingsCol.updateOne(
      { _id: target._id },
      {
        $set: {
          bookingDate: sourceDate,
          bookingTime: sourceTime,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      ok: true,
      message: "Bookings swapped successfully",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to swap bookings" }, { status: 500 });
  }
}