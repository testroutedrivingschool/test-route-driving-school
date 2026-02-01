import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/libs/s3/s3";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // TODO: Add auth check (recommended):
  // verify this key belongs to logged-in user

  try {
    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
    );

    return new Response(obj.Body, {
      headers: {
        "Content-Type": obj.ContentType || "application/octet-stream",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
