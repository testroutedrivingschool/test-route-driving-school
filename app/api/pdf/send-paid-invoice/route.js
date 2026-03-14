export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import {
  bookingsCollection,
  invoicesCollection,
  emailsCollection,
} from "@/app/libs/mongodb/db";
import {generateInvoicePdfBuffer} from "@/app/libs/invoice/invoicePdf";
import {uploadPdfToS3} from "@/app/libs/storage/uploadPdfToS3";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const bookingId = body?.bookingId;
    const to = body?.to;

    if (!bookingId || !ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        {error: "Valid bookingId required"},
        {status: 400},
      );
    }

    const bookingsCol = await bookingsCollection();
    const booking = await bookingsCol.findOne({_id: new ObjectId(bookingId)});

    if (!booking) {
      return NextResponse.json({error: "Booking not found"}, {status: 404});
    }

    // ✅ must already have an invoiceNo from original booking creation
    const invoiceNo = booking.invoiceNo;
    if (!invoiceNo) {
      return NextResponse.json(
        {error: "Booking has no invoiceNo"},
        {status: 400},
      );
    }

   const userEmail = to || booking.userEmail;
const instructorEmail = booking.instructorEmail;

if (!isEmail(userEmail) && !isEmail(instructorEmail)) {
  return NextResponse.json(
    {error: "Valid recipient email required"},
    {status: 400},
  );
}

    // ✅ Generate updated PDF using SAME invoiceNo
    const pdfBuffer = await generateInvoicePdfBuffer(
      {
        ...booking,
        invoiceNo,
        bookingId: String(booking._id),
        type: "BOOKINGS_CONFIRM",
      },
      req.url,
    );

    const filename = `invoice-${invoiceNo}.pdf`;
    const invoiceKey = `invoices/${filename}`; // ✅ SAME KEY

    // ✅ overwrite existing PDF in S3/MinIO
    await uploadPdfToS3({
  key: invoiceKey,
  buffer: pdfBuffer,
  originalName: filename,
  folder: "invoices",
  ownerEmail: booking.userEmail || booking.instructorEmail || null,
  status: "active",
});
   

    // ✅ send email (optional)
    const ps = String(booking.paymentStatus || "").toLowerCase();
    const subject =
      ps === "paid"
        ? `Payment Confirmed - Invoice #${invoiceNo}`
        : `Invoice Updated - Invoice #${invoiceNo}`;

    const userHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>${ps === "paid" ? "Payment Confirmed 🎉" : "Invoice Updated ✅"}</h2>
    <p>Hi ${booking.userName || "there"},</p>
    <p>Please find your updated invoice attached.</p>
  </div>
`;

const userText = `Hi ${booking.userName || "there"},

Please find your updated invoice attached.

Invoice #${invoiceNo}
`;

const instructorHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>${ps === "paid" ? "Payment Confirmed 🎉" : "Invoice Updated ✅"}</h2>
    <p>Hi ${booking.instructorName || "Instructor"},</p>
    <p>An updated invoice for this booking is attached.</p>
    <p><b>Customer:</b> ${booking.userName || "-"}</p>
    <p><b>Invoice #:</b> ${invoiceNo}</p>
  </div>
`;

const instructorText = `Hi ${booking.instructorName || "Instructor"},

An updated invoice for this booking is attached.

Customer: ${booking.userName || "-"}
Invoice #${invoiceNo}
`;

  

    // ✅ log email
const bookingObjectId = new ObjectId(bookingId);

const sendUser = async () => {
  if (!userEmail || !isEmail(userEmail)) {
    return {status: "SKIPPED", error: null};
  }

  let status = "SENT";
  let errorMsg = null;

  try {
    await sendMailWithPdf({
      to: userEmail,
      subject,
      html: userHtml,
  text: userText,
      pdfBuffer,
      filename,
    });
  } catch (e) {
    status = "FAILED";
    errorMsg = String(e?.message || e);
  }

  await (
    await emailsCollection()
  ).insertOne({
    bookingId: bookingObjectId,
    invoiceNo,
    actorType: "USER",
    type: "PAYMENT_INVOICE",
    to: userEmail,
    subject,
    html: userHtml,
  text: userText,
    preview: userText.slice(0, 200),
    status,
    error: errorMsg,
    hasAttachment: true,
    attachmentName: filename,
    attachmentKey: invoiceKey,
    sentAt: new Date(),
    createdAt: new Date(),
  });

  return {status, error: errorMsg};
};

const sendInstructor = async () => {
  if (!instructorEmail || !isEmail(instructorEmail)) {
    return {status: "SKIPPED", error: null};
  }

  let status = "SENT";
  let errorMsg = null;

  try {
   await sendMailWithPdf({
  to: instructorEmail,
  subject,
  html: instructorHtml,
  text: instructorText,
  pdfBuffer,
  filename,
});
  } catch (e) {
    status = "FAILED";
    errorMsg = String(e?.message || e);
  }

  await (
    await emailsCollection()
  ).insertOne({
    bookingId: bookingObjectId,
    invoiceNo,
    actorType: "INSTRUCTOR",
    type: "PAYMENT_INVOICE",
    to: instructorEmail,
    subject,
    html: instructorHtml,
  text: instructorText,
    preview: instructorText.slice(0, 200),
    status,
    error: errorMsg,
    hasAttachment: true,
    attachmentName: filename,
    attachmentKey: invoiceKey,
    sentAt: new Date(),
    createdAt: new Date(),
  });

  return {status, error: errorMsg};
};

const [userMailResult, instructorMailResult] = await Promise.all([
  sendUser(),
  sendInstructor(),
]);

    // ✅ update invoice doc (overwrite/refresh existing one)
    await (
      await invoicesCollection()
    ).updateOne(
      {bookingId: new ObjectId(bookingId), invoiceNo},
      {
        $set: {
          paymentStatus: booking.paymentStatus || "unpaid",
          paymentMethod: booking.paymentMethod || "bank",
          cardBrand: booking.cardBrand || null,
          cardLast4: booking.cardLast4 || null,
          invoiceKey,
          filename,
          userEmail: booking.userEmail || null,
          instructorEmail: booking.instructorEmail || null,
          total: booking.price || 0,
          updatedAt: new Date(),
        },
        $setOnInsert: {createdAt: new Date()},
      },
      {upsert: true},
    );

    // ✅ update booking fields (same invoiceNo, just refresh key/time)
    await bookingsCol.updateOne(
      {_id: new ObjectId(bookingId)},
      {
        $set: {
          invoiceKey,
          invoiceFilename: filename,
          invoiceCreatedAt: new Date(),
        },
      },
    );

   const hasFailure =
  userMailResult?.status === "FAILED" ||
  instructorMailResult?.status === "FAILED";

if (hasFailure) {
  return NextResponse.json(
    {
      ok: false,
      error:
        userMailResult?.error ||
        instructorMailResult?.error ||
        "Failed to send one or more emails",
    },
    {status: 500},
  );
}

    return NextResponse.json({ok: true, invoiceNo, invoiceKey});
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error: "Failed to update/send invoice"},
      {status: 500},
    );
  }
}
