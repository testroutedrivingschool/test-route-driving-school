import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "@/app/libs/s3/s3";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || ""; // e.g. "images/" or "documents/"

  const out = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
      MaxKeys: 200,
    })
  );

  const items =
    out.Contents?.map((o) => ({
      key: o.Key,
      size: o.Size,
      lastModified: o.LastModified,
    })) || [];

  return NextResponse.json(items);
}
