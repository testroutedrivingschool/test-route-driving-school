import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/app/libs/s3/s3";

export async function POST(req) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // IMPORTANT: check permission here (owner/admin/instructor).
  // Example: verify the key belongs to the logged-in user in your DB.

  const cmd = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 min
  return NextResponse.json({ url });
}
