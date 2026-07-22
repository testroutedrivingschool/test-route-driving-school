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
const totalAmount = Number(
  booking.price ??
    booking.payableAmount ??
    0,
);

const paidAmount = Number(
  booking.paidAmount ??
    booking.totalPaidAmount ??
    booking.amountPaid ??
    0,
);

const outstandingAmount = Math.max(
  0,
  Number(
    booking.outstanding ??
      totalAmount - paidAmount,
  ),
);

const normalizedPaymentStatus =
  outstandingAmount <= 0 &&
  paidAmount >= totalAmount
    ? "paid"
    : paidAmount > 0
      ? "partial"
      : "unpaid";

const invoiceBooking = {
  ...booking,

  // Service total
  price: totalAmount,
  totalAmount,
  invoiceTotal: totalAmount,

  // Amount received
  paidAmount,
  amountPaid: paidAmount,
  totalPaidAmount: paidAmount,

  // Remaining balance
  outstanding: outstandingAmount,
  outstandingAmount,
  balanceDue: outstandingAmount,

  // Correct status
  paymentStatus: normalizedPaymentStatus,

  invoiceNo,
  bookingId: String(booking._id),
  type: "BOOKINGS_CONFIRM",
};
   const userEmail =
  [
    to,
    booking.userEmail,
    booking.clientEmail,
  ]
    .map((value) =>
      String(value || "").trim(),
    )
    .find((value) => isEmail(value)) ||
  "";

const instructorEmail = String(
  booking.instructorEmail || "",
).trim();


if (!isEmail(userEmail) && !isEmail(instructorEmail)) {
  return NextResponse.json(
    {error: "Valid recipient email required"},
    {status: 400},
  );
}

    // ✅ Generate updated PDF using SAME invoiceNo
   const pdfBuffer =
  await generateInvoicePdfBuffer(
    invoiceBooking,
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
  const ps = normalizedPaymentStatus;
  const subject =
  ps === "paid"
    ? `Payment Confirmed - Invoice #${invoiceNo}`
    : ps === "partial"
      ? `Partial Payment Received - Invoice #${invoiceNo}`
      : `Invoice Updated - Invoice #${invoiceNo}`;
    const userHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
   <h2>
  ${
    ps === "paid"
      ? "Payment Confirmed 🎉"
      : ps === "partial"
        ? "Partial Payment Received ✅"
        : "Invoice Updated ✅"
  }
</h2>
    <p>Hi ${booking.userName || "there"},</p>
    <p>Please find your updated invoice attached.</p>
  </div>
`;

const userText = `Hi ${booking.userName || "there"},

Please find your updated invoice attached.

Invoice #${invoiceNo}
Invoice Total: $${totalAmount.toFixed(2)}
Paid: $${paidAmount.toFixed(2)}
Balance Due: $${outstandingAmount.toFixed(2)}
Payment Status: ${
  ps === "paid"
    ? "Paid"
    : ps === "partial"
      ? "Partial Paid"
      : "Unpaid"
}
`;
const instructorHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>
      ${
        ps === "paid"
          ? "Payment Confirmed 🎉"
          : ps === "partial"
            ? "Partial Payment Received ✅"
            : "Invoice Updated ✅"
      }
    </h2>

    <p>
      Hi ${
        booking.instructorName ||
        "Instructor"
      },
    </p>

    <p>
      An updated invoice for this booking is attached.
    </p>

    <p>
      <b>Customer:</b>
      ${booking.userName || booking.clientName || "-"}
    </p>

    <p>
      <b>Invoice #:</b>
      ${invoiceNo}
    </p>

    <p>
      <b>Invoice Total:</b>
      $${totalAmount.toFixed(2)}
    </p>

    <p>
      <b>Paid:</b>
      $${paidAmount.toFixed(2)}
    </p>

    <p>
      <b>Balance Due:</b>
      $${outstandingAmount.toFixed(2)}
    </p>

    <p>
      <b>Status:</b>
      ${
        ps === "paid"
          ? "Paid in Full"
          : ps === "partial"
            ? "Partial Paid"
            : "Unpaid"
      }
    </p>
  </div>
`;

const instructorText = `Hi ${
  booking.instructorName ||
  "Instructor"
},

An updated invoice for this booking is attached.

Customer: ${
  booking.userName ||
  booking.clientName ||
  "-"
}
Invoice #: ${invoiceNo}
Invoice Total: $${totalAmount.toFixed(2)}
Paid: $${paidAmount.toFixed(2)}
Balance Due: $${outstandingAmount.toFixed(2)}
Payment Status: ${
  ps === "paid"
    ? "Paid in Full"
    : ps === "partial"
      ? "Partial Paid"
      : "Unpaid"
}
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
          paymentStatus:
    normalizedPaymentStatus,

  paymentMethod:
    booking.paymentMethod || "bank",

  total: totalAmount,
  paidAmount,
  outstanding: outstandingAmount,
  balanceDue: outstandingAmount,

  cashAmount: Number(
    booking.cashAmount || 0,
  ),

  cardAmount: Number(
    booking.cardAmount || 0,
  ),

  processingFee: Number(
    booking.processingFee || 0,
  ),

  cardBrand:
    booking.cardBrand || null,

  cardLast4:
    booking.cardLast4 || null,

  invoiceKey,
  filename,

  userEmail:
    booking.userEmail ||
    booking.clientEmail ||
    null,

  instructorEmail:
    booking.instructorEmail || null,

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
