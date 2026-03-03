import { NextResponse } from "next/server";
import { s3 } from "@/app/libs/s3/s3";
import {
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { storageFilesCollection } from "@/app/libs/mongodb/db";

function folderFromKey(key = "") {
  return (key.split("/")[0] || "").trim();
}
function filenameFromKey(key = "") {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

async function listBucketObjects({ prefix = "", limit = 500 }) {
  const Bucket = process.env.S3_BUCKET;
  let ContinuationToken = undefined;
  const out = [];

  while (out.length < limit) {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket,
        Prefix: prefix || undefined,
        MaxKeys: Math.min(1000, limit - out.length),
        ContinuationToken,
      })
    );

    const contents = res?.Contents || [];
    for (const o of contents) {
      if (!o?.Key) continue;
      // skip "folder markers"
      if (o.Size === 0 && o.Key.endsWith("/")) continue;

      out.push({
        key: o.Key,
        size: o.Size || 0,
        updatedAt: o.LastModified || new Date(),
        folder: folderFromKey(o.Key),
        originalName: filenameFromKey(o.Key),
        mimeType: null,
        status: "unknown",
        source: "minio",
      });
    }

    if (!res.IsTruncated || !res.NextContinuationToken) break;
    ContinuationToken = res.NextContinuationToken;
  }

  return out;
}

// GET /api/storage-files?folder=images
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const folder = (searchParams.get("folder") || "").trim(); // e.g. "images"
    const prefix = folder ? `${folder}/` : ""; // IMPORTANT

    // 1) read from MinIO bucket
    const minioItems = await listBucketObjects({ prefix, limit: 500 });

    // 2) read matching records from DB
    const col = await storageFilesCollection();
    const dbItems = await col
      .find(folder ? { folder } : {})
      .sort({ updatedAt: -1 })
      .limit(1000)
      .toArray();

    // index DB by key
    const dbByKey = new Map(dbItems.map((x) => [x.key, x]));

    // 3) merge (prefer DB fields when available)
    const merged = minioItems.map((m) => {
      const d = dbByKey.get(m.key);
      if (!d) return m;
      return {
        ...m,
        ...d,
        source: "db+minio",
        folder: d.folder || m.folder,
        originalName: d.originalName || m.originalName,
        updatedAt: d.updatedAt || m.updatedAt,
        size: d.size ?? m.size,
      };
    });

    // 4) also include DB-only items (if any object missing in bucket)
    const minioKeys = new Set(minioItems.map((x) => x.key));
    const dbOnly = dbItems
      .filter((d) => d?.key && !minioKeys.has(d.key))
      .map((d) => ({
        ...d,
        source: "db-only",
        folder: d.folder || folderFromKey(d.key),
        originalName: d.originalName || filenameFromKey(d.key),
      }));

    // newest first
    const finalList = [...merged, ...dbOnly].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json(finalList);
  } catch (e) {
    console.error("GET /api/storage-files error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/storage-files?key=...
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = (searchParams.get("key") || "").trim();

    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }

    const Bucket = process.env.S3_BUCKET;
    const col = await storageFilesCollection();

    // 1) delete from MinIO ALWAYS (even if DB record doesn't exist)
    await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));

    // 2) delete from DB if exists
    await col.deleteOne({ key });

    return NextResponse.json({ message: "Deleted (MinIO + DB)" }, { status: 200 });
  } catch (e) {
    console.error("DELETE /api/storage-files error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}