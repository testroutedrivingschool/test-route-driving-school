import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/libs/s3/s3";
import { storageFilesCollection } from "@/app/libs/mongodb/db";

export async function uploadPdfToS3({
  key,
  buffer,
  originalName,
  folder,
  ownerEmail,
  status = "active",
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
      ContentDisposition: `inline; filename="${originalName || key.split("/").pop()}"`,
    })
  );

  const col = await storageFilesCollection();
  const now = new Date();

  await col.updateOne(
    { key },
    {
      $set: {
        key,
        folder: folder || key.split("/")[0] || "documents",
        originalName: originalName || key.split("/").pop(),
        size: buffer.length,
        mimeType: "application/pdf",
        status,
        ownerEmail: ownerEmail ? ownerEmail.toLowerCase() : null,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return key;
}