export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";
import {
  bookingsCollection,
  invoicesCollection,
  emailsCollection,
  jobsCollection,
  clientsCollection,
} from "@/app/libs/mongodb/db";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";
import {getNextInvoiceNo} from "@/app/libs/invoice/getNextInvoiceNo";
import Stripe from "stripe";
import {generateInvoicePdfBuffer} from "@/app/libs/invoice/invoicePdf";
import {uploadPdfToS3} from "@/app/libs/storage/uploadPdfToS3";

//get all
export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);

    const email = searchParams.get("email");
    const instructorEmail = searchParams.get("instructorEmail");
    const userEmail = searchParams.get("userEmail");

    let filter = {};

    if (email) {
      filter = {$or: [{userEmail: email}, {instructorEmail: email}]};
    } else if (instructorEmail) {
      filter = {instructorEmail};
    } else if (userEmail) {
      filter = {userEmail};
    }

    const bookings = await (await bookingsCollection())
      .find(filter)
      .sort({createdAt: -1})
      .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to fetch bookings"},
      {status: 500},
    );
  }
}
export async function runInvoiceAndEmails({
  bookingDoc,
  bookingId,
  invoiceNo,
  reqUrl,
}) {
  // 1) Generate PDF
  const pdfBuffer = await generateInvoicePdfBuffer(
    {...bookingDoc, bookingId: String(bookingId), type: "BOOKINGS_CONFIRM"},
    reqUrl,
  );

  // 2) Upload to S3/MinIO
  const filename = `invoice-${invoiceNo}.pdf`;
  const invoiceKey = `invoices/${filename}`;

  await uploadPdfToS3({
    key: invoiceKey,
    buffer: pdfBuffer,
    originalName: filename,
    folder: "invoices",
    ownerEmail: bookingDoc?.userEmail || bookingDoc?.clientEmail || "",
    status: "active",
  });
  // 3) Prepare email contents
  const bookingDateText = bookingDoc.bookingDate
    ? new Date(bookingDoc.bookingDate).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const bookingTimeText = bookingDoc.bookingTime || "";
  const addressLine = `${bookingDoc.address}${
    bookingDoc.suburb ? `, ${bookingDoc.suburb}` : ""
  }`;

  const instructorName = bookingDoc.instructorName || "Instructor";
  const bookingTitle =
    `${bookingDoc.serviceName || ""} ${bookingDoc.duration || ""}`.trim();

  const instructorText = `Hi ${instructorName},

You have a new booking:
Name: ${bookingDoc.userName}
Booking: ${bookingTitle}
Date: ${bookingDateText}
Time: ${bookingTimeText}
Address: ${addressLine}
Email: ${bookingDoc.userEmail}
Mobile: ${bookingDoc.userPhone}
`;

  const instructorHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${instructorName},</p>
      <p><b>You have a new booking:</b></p>
      <p><b>Name:</b> ${bookingDoc.userName}</p>
      <p><b>Booking:</b> ${bookingTitle}</p>
      <p><b>Date:</b> ${bookingDateText}</p>
      <p><b>Time:</b> ${bookingTimeText}</p>
      <p><b>Address:</b> ${addressLine}</p>
      <p><b>Email:</b> ${bookingDoc.userEmail}</p>
      <p><b>Mobile:</b> ${bookingDoc.userPhone}</p>
    </div>
  `;

  const userSubject =
    bookingDoc.paymentStatus === "paid"
      ? `Payment Confirmed - Invoice #${invoiceNo}`
      : `Booking Confirmed - Invoice #${invoiceNo}`;

  const userText = `Hi ${bookingDoc.userName || "there"},

Your booking is confirmed.

Service: ${bookingDoc.serviceName || ""}
Date: ${bookingDateText}
Time: ${bookingTimeText}
Duration: ${bookingDoc.duration || ""}
Total: $${bookingDoc.price || 0}
Payment: ${bookingDoc.paymentStatus || "unpaid"}

Invoice attached.

Thanks,
Test Route Driving School
`;

  const userHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>${
        bookingDoc.paymentStatus === "paid"
          ? "Payment Confirmed 🎉"
          : "Booking Confirmed ✅"
      }</h2>
      <p>Hi ${bookingDoc.userName || "there"},</p>
      <p>Your booking is confirmed. Invoice attached (PDF).</p>
      <ul>
        <li><b>Service:</b> ${bookingDoc.serviceName || ""}</li>
        <li><b>Date:</b> ${bookingDateText}</li>
        <li><b>Time:</b> ${bookingTimeText}</li>
        <li><b>Duration:</b> ${bookingDoc.duration || ""}</li>
        <li><b>Total:</b> $${bookingDoc.price || 0}</li>
        <li><b>Payment:</b> ${bookingDoc.paymentStatus || "unpaid"}</li>
      </ul>
      <p>Thanks,<br/>Test Route Driving School</p>
    </div>
  `;

  // 4) Send emails + log results
  const mailLog = {
    user: {to: bookingDoc.userEmail, ok: false, error: null},
    instructor: {
      to: bookingDoc.instructorEmail || null,
      ok: false,
      error: null,
    },
    sentAt: new Date(),
  };

  // ✅ (small Option B inside A) Send in parallel
  const sendUser = async () => {
    if (!bookingDoc.userEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: bookingDoc.userEmail,
        subject: userSubject,
        html: userHtml,
        text: userText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    mailLog.user.ok = status === "SENT";
    mailLog.user.error = errorMsg;

    await (
      await emailsCollection()
    ).insertOne({
      bookingId,
      invoiceNo,
      actorType: "USER",
      type: "BOOKINGS_CONFIRM",
      to: bookingDoc.userEmail,
      subject: userSubject,
      text: userText,
      html: userHtml,
      preview: userText.slice(0, 200),
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      sentAt: new Date(),
      createdAt: new Date(),
      attachmentKey: invoiceKey,
    });
  };

  const sendInstructor = async () => {
    if (!bookingDoc.instructorEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: bookingDoc.instructorEmail,
        subject: `New Booking: ${bookingDoc.serviceName || ""} (Invoice #${invoiceNo})`,
        html: instructorHtml,
        text: instructorText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    mailLog.instructor.ok = status === "SENT";
    mailLog.instructor.error = errorMsg;

    await (
      await emailsCollection()
    ).insertOne({
      bookingId,
      invoiceNo,
      actorType: "INSTRUCTOR",
      type: "BOOKINGS_CONFIRM",
      to: bookingDoc.instructorEmail,
      subject: `New Booking: ${bookingDoc.serviceName || ""}`,
      text: instructorText,
      html: instructorHtml,
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      sentAt: new Date(),
      createdAt: new Date(),
      preview: instructorText.slice(0, 200),
      attachmentKey: invoiceKey,
    });
  };

  await Promise.all([sendUser(), sendInstructor()]);

  // 5) Save invoice doc
  await (
    await invoicesCollection()
  ).insertOne({
    invoiceNo,
    bookingId,
    createdAt: new Date(),
    paymentStatus: bookingDoc.paymentStatus || "unpaid",
    paymentMethod: bookingDoc.paymentMethod || "bank",
    cardBrand: bookingDoc.cardBrand || null,
    cardLast4: bookingDoc.cardLast4 || null,
    invoiceKey,
    filename,
    userEmail: bookingDoc.userEmail,
    instructorEmail: bookingDoc.instructorEmail || null,
    mailLog,
    total: bookingDoc.price || 0,
  });

  // (optional) update booking with invoiceKey so UI has it
  await (
    await bookingsCollection()
  ).updateOne(
    {_id: bookingId},
    {
      $set: {
        invoiceKey,
        invoiceFilename: filename,
        invoiceCreatedAt: new Date(),
      },
    },
  );
}

//Credit
function money(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function getClientFilter({clientId, userEmail, clientEmail}) {
  if (clientId && ObjectId.isValid(String(clientId))) {
    return {
      _id: new ObjectId(String(clientId)),
    };
  }

  const email = String(userEmail || clientEmail || "")
    .trim()
    .toLowerCase();

  if (!email) return null;

  return {
    $or: [{email}, {linkedUserEmail: email}],
  };
}

async function useClientCreditOnce({
  clientId,
  userEmail,
  clientEmail,
  bookingId,
  amount,
}) {
  const creditAmount = money(amount);

  if (creditAmount <= 0) {
    return {
      used: false,
      amount: 0,
      reason: "No credit used",
    };
  }

  const clientFilter = getClientFilter({
    clientId,
    userEmail,
    clientEmail,
  });

  if (!clientFilter) {
    return {
      used: false,
      amount: creditAmount,
      reason: "Client not found",
    };
  }

  const ref = `booking-credit-used:${bookingId}`;

  const result = await (
    await clientsCollection()
  ).updateOne(
    {
      $and: [
        clientFilter,
        {accountBalance: {$gte: creditAmount}},
        {
          $or: [
            {"balanceLedger.ref": {$ne: ref}},
            {balanceLedger: {$exists: false}},
          ],
        },
      ],
    },
    {
      $inc: {
        accountBalance: -creditAmount,
      },
      $push: {
        balanceLedger: {
          ref,
          type: "booking-credit-used",
          bookingId: String(bookingId),
          amount: -creditAmount,
          note: "Credit used for booking",
          createdAt: new Date(),
        },
      },
      $set: {
        updatedAt: new Date(),
      },
    },
  );

  if (result.modifiedCount !== 1) {
    return {
      used: false,
      amount: creditAmount,
      reason: "Not enough credit balance",
    };
  }

  return {
    used: true,
    amount: creditAmount,
    reason: "Credit used",
  };
}

// POST create booking + invoiceNo + PDF + emails + store invoice+email log
export async function POST(req) {
  try {
    const body = await req.json();

    const normalized = {
      ...body,
      userName: body.userName || body.clientName || "",
      userEmail: body.userEmail || body.clientEmail || "",
      userPhone: body.userPhone || body.clientPhone || body.phone || "",
      address: body.address || body.clientAddress || body.userAddress || "",
      suburb: body.suburb || body.location || "",
    };
    const totalPrice = money(normalized.price);
    const requestedCredit = money(normalized.creditToUse);
    const creditToUse = Math.min(requestedCredit, totalPrice);
    const payableAmount = money(totalPrice - creditToUse);

    const bookingId = new ObjectId();
   let paymentMethod = String(normalized.paymentMethod || "bank").toLowerCase();
    let cardBrand = null;
    let cardLast4 = null;

    if (normalized.bookingType === "website") {
      if (payableAmount > 0) {
        paymentMethod = creditToUse > 0 ? "card+credit" : "card";

        if (!normalized.paymentIntentId) {
          return NextResponse.json(
            {error: "Payment required for website booking"},
            {status: 400},
          );
        }

        try {
          const stripe = new Stripe(process.env.NEXT_PUBLIC_Stripe_Secret_key);

          const intent = await stripe.paymentIntents.retrieve(
            normalized.paymentIntentId,
            {expand: ["charges.data.payment_method_details"]},
          );

          if (intent.status !== "succeeded") {
            return NextResponse.json(
              {error: "Stripe payment is not completed"},
              {status: 400},
            );
          }

          const charge = intent?.charges?.data?.[0];
          const card = charge?.payment_method_details?.card;

          cardBrand = card?.brand || null;
          cardLast4 = card?.last4 || null;
        } catch (err) {
          return NextResponse.json(
            {error: err.message || "Unable to verify Stripe payment"},
            {status: 400},
          );
        }
      } else {
        paymentMethod = "credit";
      }
    }

    const invoiceNo = await getNextInvoiceNo();
const isPaid =
  String(normalized.paymentStatus || "").toLowerCase() === "paid";

const actualPaidAmount =
  normalized.bookingType === "website"
    ? totalPrice
    : money(normalized.paidAmount || creditToUse || 0);

const actualOutstanding =
  isPaid || normalized.bookingType === "website"
    ? 0
    : money(totalPrice - actualPaidAmount);
    const bookingDoc = {
      _id: bookingId,
      ...normalized,

      price: totalPrice,
      creditUsed: creditToUse,
      payableAmount,

      invoiceNo,
      paymentMethod,
      cardBrand,
      cardLast4,

      paymentStatus:
        normalized.paymentStatus ||
        (normalized.bookingType === "website" ? "paid" : "unpaid"),

      paidAmount: actualPaidAmount,

cardAmount:
  paymentMethod === "card" || paymentMethod === "card+credit"
    ? payableAmount
    : 0,

cashAmount:
  paymentMethod === "cash"
    ? actualPaidAmount
    : Number(normalized.cashAmount || 0),

outstanding: actualOutstanding,

      creditIssued: false,
      status: normalized.status || "pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await (await bookingsCollection()).insertOne(bookingDoc);

    if (creditToUse > 0) {
      const creditResult = await useClientCreditOnce({
        clientId: normalized.clientId,
        userEmail: normalized.userEmail,
        clientEmail: normalized.clientEmail,
        bookingId,
        amount: creditToUse,
      });

      if (!creditResult.used) {
        await (await bookingsCollection()).deleteOne({_id: bookingId});

        return NextResponse.json(
          {
            error: creditResult.reason || "Unable to use client credit",
          },
          {status: 400},
        );
      }
    }
    await (
      await jobsCollection()
    ).insertOne({
      type: "BOOKING_CONFIRMATION",
      bookingId: String(bookingId),
      invoiceNo,
      reqUrl: process.env.APP_URL || req.url,
      status: "pending",
      attempts: 0,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        ok: true,
        bookingId: String(bookingId),
        invoiceNo,
        message: "Booking created successfully.",
      },
      {status: 201},
    );
  } catch (error) {
    return NextResponse.json({error: "Failed to add booking"}, {status: 500});
  }
}

// DELETE a booking by ID
export async function DELETE(req) {
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {error: "Booking ID is required"},
        {status: 400},
      );
    }

    const result = await (
      await bookingsCollection()
    ).deleteOne({_id: new ObjectId(id)});

    if (result.deletedCount === 0) {
      return NextResponse.json({error: "Booking not found"}, {status: 404});
    }

    return NextResponse.json({message: "Booking deleted successfully"});
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to delete booking"},
      {status: 500},
    );
  }
}
