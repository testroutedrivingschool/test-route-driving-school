import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/libs/s3/s3";

export async function uploadPdfToS3({ key, buffer }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
      // Optional (nice): force download name
      ContentDisposition: `inline; filename="${key.split("/").pop()}"`,
    })
  );

  return key;
}
