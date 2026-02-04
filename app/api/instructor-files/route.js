import { instructorsFilesCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();

    if (!email) return NextResponse.json([], { status: 200 });

    const collection = await instructorsFilesCollection();

    const files = await collection
      .find({ instructorEmail: email })
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json(files);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const instructorEmail = (body?.instructorEmail || "").trim().toLowerCase();
    const key = (body?.key || "").trim();
    const originalName = (body?.originalName || "").trim();
    const createdBy = (body?.createdBy || "").trim();
    const size = Number(body?.size || 0);

    if (!instructorEmail) {
      return NextResponse.json({ message: "instructorEmail is required" }, { status: 400 });
    }
    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }
    if (!originalName) {
      return NextResponse.json({ message: "originalName is required" }, { status: 400 });
    }

    const collection = await instructorsFilesCollection();

    // ✅ prevent duplicate key save
    const exists = await collection.findOne({ key });
    if (exists) {
      return NextResponse.json({ message: "File already saved" }, { status: 409 });
    }

    const now = new Date();

    const result = await collection.insertOne({
      instructorEmail,
      createdBy,
      key,
      originalName,
      size,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Saved", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
