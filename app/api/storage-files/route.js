import {NextResponse} from "next/server";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {s3} from "@/app/libs/s3/s3";
import {storageFilesCollection} from "@/app/libs/mongodb/db";

// GET /api/storage-files?ownerEmail=x&folder=images(optional)
export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);

    const folder = (searchParams.get("folder") || "").trim();

    const query = {};
    if (folder) query.folder = folder;

    const col = await storageFilesCollection();
    const items = await col
      .find(query)
      .sort({updatedAt: -1})
      .limit(200)
      .toArray();

    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    const msg = e?.message === "FORBIDDEN" ? "Forbidden" : "Server error";
    const code = e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({message: msg}, {status: code});
  }
}

// DELETE /api/storage-files?key=...
export async function DELETE(req) {
  try {
    const {searchParams} = new URL(req.url);
    const key = (searchParams.get("key") || "").trim();

    if (!key) {
      return NextResponse.json({message: "key is required"}, {status: 400});
    }

    const col = await storageFilesCollection();

    // ✅ find by key only (admin)
    const file = await col.findOne({key});
    if (!file) {
      return NextResponse.json({message: "File not found"}, {status: 404});
    }

    // ✅ Delete from MinIO/S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      }),
    );

    // ✅ Delete from DB
    await col.deleteOne({_id: file._id});

    return NextResponse.json({message: "Deleted"}, {status: 200});
  } catch (e) {
    console.error("DELETE STORAGE FILE ERROR:", e);
    const msg = e?.message === "FORBIDDEN" ? "Forbidden" : "Server error";
    const code = e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({message: msg}, {status: code});
  }
}
