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

    const toEmail = to || booking.userEmail;
    if (!toEmail || !isEmail(toEmail)) {
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
    await uploadPdfToS3({key: invoiceKey, buffer: pdfBuffer});

    // ✅ send email (optional)
    const ps = String(booking.paymentStatus || "").toLowerCase();
    const subject =
      ps === "paid"
        ? `Payment Confirmed - Invoice #${invoiceNo}`
        : `Invoice Updated - Invoice #${invoiceNo}`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>${ps === "paid" ? "Payment Confirmed 🎉" : "Invoice Updated ✅"}</h2>
        <p>Hi ${booking.userName || "there"},</p>
        <p>Please find your updated invoice attached.</p>
      </div>
    `;

    const text = `Please find your updated invoice attached. Invoice #${invoiceNo}\n`;

    let status = "SENT";
    let errorMsg = null;
    try {
      await sendMailWithPdf({
        to: toEmail,
        subject,
        html,
        text,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    // ✅ log email
    await (
      await emailsCollection()
    ).insertOne({
      bookingId: new ObjectId(bookingId),
      invoiceNo,
      actorType: "USER",
      type: "PAYMENT_INVOICE",
      to: toEmail,
      subject,
      text,
      html,
      preview: text.slice(0, 200),
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
      sentAt: new Date(),
      createdAt: new Date(),
    });

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

    if (status !== "SENT") {
      return NextResponse.json({ok: false, error: errorMsg}, {status: 500});
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
