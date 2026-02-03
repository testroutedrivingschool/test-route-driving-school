import {locationsCollection} from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET() {
  const collection = await locationsCollection();
  const locations = await collection.find().toArray();
  return NextResponse.json(locations);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const name = (body?.name || "").trim();
    const zone = (body?.zone || "").trim();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }
    if (!zone) {
      return NextResponse.json({ message: "Zone is required" }, { status: 400 });
    }

    const collection = await locationsCollection();

    // ✅ prevent duplicate name (case-insensitive)
    const exists = await collection.findOne({
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    });

    if (exists) {
      return NextResponse.json(
        { message: "This suburb already exists" },
        { status: 409 }
      );
    }

    // ✅ insert into DB
    const result = await collection.insertOne({
      name,
      zone,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Created",
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const collection = await locationsCollection();

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ helper: safely use user input inside regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}