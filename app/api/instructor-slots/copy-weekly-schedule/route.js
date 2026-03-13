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
      fromWeekStart,
      targetWeeks = [],
      copyBookingsIfFree = false,
    } = body || {};

    if (!instructorId || !fromWeekStart || !Array.isArray(targetWeeks) || !targetWeeks.length) {
      return NextResponse.json(
        { error: "instructorId, fromWeekStart, targetWeeks are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(instructorId)) {
      return NextResponse.json({ error: "Invalid instructorId" }, { status: 400 });
    }

    const instructorObjectId = new ObjectId(instructorId);
    const slotsCol = await instructorSlotsCollection();
    const bookingsCol = await bookingsCollection();

    const sourceWeekDates = getWeekDates(fromWeekStart);
    const sourceWeekEnd = sourceWeekDates[6];

    // source week slots
    const sourceSlots = await slotsCol
      .find({
        instructorId: instructorObjectId,
        date: { $gte: fromWeekStart, $lte: sourceWeekEnd },
      })
      .toArray();

    if (!sourceSlots.length) {
      return NextResponse.json({
        ok: true,
        copied: 0,
        replacedDates: [],
        skippedDates: [],
        message: "No source slots found",
      });
    }

    // group source slots by day
    const sourceSlotsByDate = new Map();
    for (const slot of sourceSlots) {
      const arr = sourceSlotsByDate.get(slot.date) || [];
      arr.push(slot);
      sourceSlotsByDate.set(slot.date, arr);
    }

    const bulkOps = [];
    const skippedDates = [];
    const replacedDates = [];
    let copiedCount = 0;

    for (const weekOffset of targetWeeks) {
      const dayShift = weekOffset * 7;

      for (const sourceDate of sourceWeekDates) {
        const targetDate = addDays(sourceDate, dayShift);
        const daySourceSlots = sourceSlotsByDate.get(sourceDate) || [];

        // if source date has no slots, still clear target date
        // because you want exact copy
        if (copyBookingsIfFree) {
          const bookingExists = await bookingsCol.countDocuments({
            $or: [
              { instructorId: instructorId },
              { instructorId: instructorObjectId },
            ],
            bookingDate: {
              $gte: `${targetDate}T00:00:00.000Z`,
              $lte: `${targetDate}T23:59:59.999Z`,
            },
          });

          if (bookingExists > 0) {
            skippedDates.push(targetDate);
            continue;
          }
        }

        // 1) delete all target date slots first
        bulkOps.push({
          deleteMany: {
            filter: {
              instructorId: instructorObjectId,
              date: targetDate,
            },
          },
        });

        replacedDates.push(targetDate);

        // 2) insert source day's slots into target day
        for (const sourceSlot of daySourceSlots) {
          bulkOps.push({
            insertOne: {
              document: {
                instructorId: instructorObjectId,
                date: targetDate,
                time: sourceSlot.time,
                duration: sourceSlot.duration || "15 mins",
                visibility: sourceSlot.visibility || "public",
                privateNote: sourceSlot.privateNote || "",
                publicNote: sourceSlot.publicNote || "",
                suburb: sourceSlot.suburb ?? "ALL",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          });

          copiedCount++;
        }
      }
    }

    if (bulkOps.length) {
      await slotsCol.bulkWrite(bulkOps, { ordered: true });
    }

    return NextResponse.json({
      ok: true,
      copied: copiedCount,
      replacedDates: [...new Set(replacedDates)].sort(),
      skippedDates: [...new Set(skippedDates)].sort(),
      operations: bulkOps.length,
    });
  } catch (err) {
    console.error("copy-weekly-schedule error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}