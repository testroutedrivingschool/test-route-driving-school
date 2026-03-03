import { instructorsFilesCollection, storageFilesCollection } from "@/app/libs/mongodb/db";
import { s3 } from "@/app/libs/s3/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    console.error("GET /api/instructor-files error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

function getFolderFromKey(key = "") {
  // "documents/abc.pdf" -> "documents"
  return key.split("/")[0] || "";
}

export async function POST(req) {
  try {
    const body = await req.json();

    const instructorEmail = (body?.instructorEmail || "").trim().toLowerCase();
    const key = (body?.key || "").trim();
    const originalName = (body?.originalName || "").trim();
    const createdBy = (body?.createdBy || "").trim();
    const size = Number(body?.size || 0);

    // Optional (recommended to send from frontend)
    const mimeType = (body?.mimeType || "").trim() || "application/octet-stream";

    if (!instructorEmail) {
      return NextResponse.json({ message: "instructorEmail is required" }, { status: 400 });
    }
    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }
    if (!originalName) {
      return NextResponse.json({ message: "originalName is required" }, { status: 400 });
    }

    const insCol = await instructorsFilesCollection();
    const storageCol = await storageFilesCollection();

    // 1) prevent duplicate instructor-files by key
    const exists = await insCol.findOne({ key });
    if (exists) {
      return NextResponse.json({ message: "File already saved" }, { status: 409 });
    }

    const now = new Date();
    const folder = getFolderFromKey(key);

    // 2) insert instructor file
    const insResult = await insCol.insertOne({
      instructorEmail,
      createdBy,
      key,
      originalName,
      size,
      createdAt: now,
      updatedAt: now,
    });

    // 3) insert into storage-files too (upsert so it won't duplicate)
    await storageCol.updateOne(
      { key },
      {
        $setOnInsert: {
          key,
          folder,
          originalName,
          size,
          mimeType,
          status: "pending",
          createdAt: now,
        },
        $set: {
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Saved (instructor-files + storage-files)", insertedId: insResult.insertedId },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/instructor-files error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = (searchParams.get("key") || "").trim();

    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }

    const insCol = await instructorsFilesCollection();
    const storageCol = await storageFilesCollection();

    // ensure exists (optional)
    const file = await insCol.findOne({ key });
    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // delete from MinIO
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
    );

    // delete from DB (both)
    const [insRes, storageRes] = await Promise.all([
      insCol.deleteOne({ key }),
      storageCol.deleteOne({ key }),
    ]);

    return NextResponse.json(
      {
        message: "Deleted (MinIO + DB)",
        deleted: {
          instructorFiles: insRes.deletedCount,
          storageFiles: storageRes.deletedCount,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("DELETE /api/instructor-files error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}