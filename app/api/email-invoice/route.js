export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {s3} from "@/app/libs/s3/s3";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      to,
      bookingId,
      invoiceNo,
      invoiceKey,
      bookingServiceName,
      noteText, // ✅ invoice note
    } = body || {};

    // ✅ Validate "to"
    if (!to || !isEmail(to)) {
      return NextResponse.json({error: "Valid recipient email is required"}, {status: 400});
    }

    // ✅ Validate invoice key/no
    const key = invoiceKey || (invoiceNo ? `invoices/invoice-${invoiceNo}.pdf` : "");
    if (!key) {
      return NextResponse.json({error: "Invoice key or invoiceNo is required"}, {status: 400});
    }

    // ✅ Validate note (only if you're using invoiceNote flow)
    const note = String(noteText || "").trim();


    // ✅ Get PDF from MinIO/S3 with proper 404 handling
    let obj;
    try {
      obj = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        })
      );
    } catch (e) {
      console.error("S3 GET ERROR:", e);
      return NextResponse.json({error: "Invoice PDF not found in storage"}, {status: 404});
    }

    if (!obj?.Body) {
      return NextResponse.json({error: "Invoice PDF not found"}, {status: 404});
    }

    const pdfBuffer = await streamToBuffer(obj.Body);

    const subject = `Invoice ${invoiceNo ? `#${invoiceNo}` : ""} - Test Route Driving School`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color:#111">
        <h2>Your Invoice</h2>
        <p>Please find your invoice attached.</p>
        <p><b>Booking:</b> ${bookingServiceName || ""}</p>

        ${note ? `
  <div style="margin-top:12px;padding:12px;border:1px solid #eee;border-radius:8px">
    <b>Invoice Note:</b>
    <p style="white-space:pre-line;margin:8px 0">${escapeHtml(note)}</p>
  </div>
` : ""}
      </div>
    `;

    const text =
      `Please find your invoice attached.\n` +
      `Booking ID: ${bookingId || ""}\n\n` +
      `Invoice Note:\n${note}\n`;

    await sendMailWithPdf({
      to,
      subject,
      html,
      text,
      pdfBuffer,
      filename: invoiceNo ? `invoice-${invoiceNo}.pdf` : "invoice.pdf",
    });

    return NextResponse.json({ok: true});
  } catch (err) {
    console.error("EMAIL INVOICE ERROR:", err);
    return NextResponse.json({error: err?.message || "Failed to email invoice"}, {status: 500});
  }
}
