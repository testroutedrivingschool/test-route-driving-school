import { NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/app/libs/s3/s3";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

// Private-only allowlist (recommended)
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const BLOCKED_EXT = [
  ".exe", ".msi", ".bat", ".cmd", ".sh",
  ".js", ".html", ".htm", ".php", ".dll", ".jar", ".scr",
  ".zip", ".rar", ".7z"
];

function hasBlockedExt(name = "") {
  const n = name.toLowerCase();
  return BLOCKED_EXT.some((e) => n.endsWith(e));
}

function extFromMime(mime) {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "bin";
}

// Optional: lock folder choices
const ALLOWED_FOLDERS = new Set(["documents", "invoices", "images"]);

export async function POST(req) {
  const { fileName, fileType, fileSize, folder } = await req.json();

  if (!fileName || !fileType || typeof fileSize !== "number" || !folder) {
    return NextResponse.json({ error: "Missing file info" }, { status: 400 });
  }

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  if (fileSize > MAX_BYTES) {
    return NextResponse.json({ error: "File maximum size 10MB" }, { status: 400 });
  }

  if (!ALLOWED.has(fileType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (hasBlockedExt(fileName)) {
    return NextResponse.json({ error: "Blocked extension" }, { status: 400 });
  }

  // NOTE: If folder is invoices/documents, you can enforce fileType === "application/pdf"
  if ((folder === "documents" || folder === "invoices") && fileType !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF allowed here" }, { status: 400 });
  }

  const key = `${folder}/${crypto.randomUUID()}.${extFromMime(fileType)}`;

  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 }); 

  // private-only: no publicUrl
  return NextResponse.json({ uploadUrl, key });
}
