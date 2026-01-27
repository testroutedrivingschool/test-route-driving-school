import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import { instructorSlotsCollection } from "@/app/libs/mongodb/db";


// -------------------------
// GET /api/instructor-slots?instructorId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
// -------------------------
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const instructorId = url.searchParams.get("instructorId");
    const from = url.searchParams.get("from"); 
    const to = url.searchParams.get("to"); 

    if (!instructorId) {
      return NextResponse.json(
        {error: "instructorId is required"},
        {status: 400},
      );
    }

    if (!ObjectId.isValid(instructorId)) {
      return NextResponse.json({error: "Invalid instructorId"}, {status: 400});
    }

    const query = {
      instructorId: new ObjectId(instructorId),
    };





    // If from/to provided, filter by date range (string compare works for YYYY-MM-DD)
    if (from && to) {
      query.date = {$gte: from, $lte: to};
    } else if (from) {
      query.date = {$gte: from};
    } else if (to) {
      query.date = {$lte: to};
    }

    const collection = await instructorSlotsCollection();
    const slots = await collection.find(query).toArray();

    return NextResponse.json(slots);
  } catch (err) {
    console.error("GET instructor-slots error:", err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

// -------------------------
// PUT /api/instructor-slots
// Body: { instructorId, date, time, duration, visibility, privateNote, publicNote, suburb }
// Upsert by instructorId+date+time
// -------------------------
export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      instructorId,
      date, // YYYY-MM-DD
      time, // "7:15AM"
      duration = "15 mins",
      visibility = "public",
      privateNote = "",
      publicNote = "",
   
    } = body || {};
const suburb = body?.suburb ?? "ALL";

const suburbOk =
  suburb === "ALL" || (Array.isArray(suburb) && suburb.every((x) => typeof x === "string"));

if (!suburbOk) {
  return NextResponse.json({ error: "suburb must be 'ALL' or string[]" }, { status: 400 });
}

    if (!instructorId || !date || !time) {
      return NextResponse.json(
        {error: "instructorId, date, and time are required"},
        {status: 400},
      );
    }

    if (!ObjectId.isValid(instructorId)) {
      return NextResponse.json({error: "Invalid instructorId"}, {status: 400});
    }

    const allowedVisibility = ["public", "privateBooked", "hidden", "publicNote"];
    if (!allowedVisibility.includes(visibility)) {
      return NextResponse.json(
        {error: "Invalid visibility value"},
        {status: 400},
      );
    }

    // basic date format check (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        {error: "date must be YYYY-MM-DD"},
        {status: 400},
      );
    }

    const collection = await instructorSlotsCollection();

    const filter = {
      instructorId: new ObjectId(instructorId),
      date,
      time,
    };

    const updateDoc = {
      $set: {
        duration,
        visibility,
        privateNote,
        publicNote,
        suburb,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    };

    const result = await collection.updateOne(filter, updateDoc, {
      upsert: true,
    });

    return NextResponse.json({
      ok: true,
      upsertedId: result.upsertedId || null,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("PUT instructor-slots error:", err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}



export async function DELETE(req) {
  try {
    const body = await req.json();
    const { instructorId, date, times = [] } = body || {};

    if (!instructorId || !date || !Array.isArray(times) || !times.length) {
      return NextResponse.json(
        { error: "instructorId, date, times required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(instructorId)) {
      return NextResponse.json({ error: "Invalid instructorId" }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
    }

    const collection = await instructorSlotsCollection();

    const result = await collection.deleteMany({
      instructorId: new ObjectId(instructorId),
      date,
      time: { $in: times },
    });

    return NextResponse.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("DELETE instructor-slots error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
