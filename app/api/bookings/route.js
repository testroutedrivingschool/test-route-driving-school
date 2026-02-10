export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";
import {
  bookingsCollection,
  invoicesCollection,
  emailsCollection,
} from "@/app/libs/mongodb/db";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";
import {getNextInvoiceNo} from "@/app/libs/invoice/getNextInvoiceNo";
import Stripe from "stripe";
import {uploadPdfToS3} from "@/app/libs/storage/uploadPdfToS3";
import {generateInvoicePdfBuffer} from "@/app/libs/invoice/invoicePdf";
import { type } from "os";

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
    console.error(error);
    return NextResponse.json(
      {error: "Failed to fetch bookings"},
      {status: 500},
    );
  }
}

// POST create booking + invoiceNo + PDF + emails + store invoice+email log
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("USING invoicePdf from:", __filename);
    // ✅ Normalize (manual uses client*, website uses user*)
    const normalized = {
      ...body,
      userName: body.userName || body.clientName || "",
      userEmail: body.userEmail || body.clientEmail || "",
      userPhone: body.userPhone || body.clientPhone || body.phone || "",
      address: body.address || body.clientAddress || body.userAddress || "",
      suburb: body.suburb || body.location || "",
    };
    // payment defaults
    let paymentMethod = "bank";
    let cardBrand = null;
    let cardLast4 = null;

    // website bookings = card only
    if (normalized.bookingType === "website") {
      paymentMethod = "card";

      // 🚨 website booking MUST be paid
      if (!normalized.paymentIntentId) {
        return NextResponse.json(
          {error: "Payment required for website booking"},
          {status: 400},
        );
      }

      // 🔑 Stripe lookup (THIS is where your code goes)
      try {
        const stripe = new Stripe(process.env.NEXT_PUBLIC_Stripe_Secret_key);

        const intent = await stripe.paymentIntents.retrieve(
          normalized.paymentIntentId,
          {expand: ["charges.data.payment_method_details"]},
        );

        const charge = intent?.charges?.data?.[0];
        const card = charge?.payment_method_details?.card;

        cardBrand = card?.brand || null; // e.g. visa
        cardLast4 = card?.last4 || null; // e.g. 4242
      } catch (err) {
        console.error("Stripe retrieve failed:", err);
        return NextResponse.json(
          {error: "Unable to verify Stripe payment"},
          {status: 400},
        );
      }
    }

    const invoiceNo = await getNextInvoiceNo();

    const bookingDoc = {
      ...normalized,
      invoiceNo,
      paymentMethod,
      cardBrand,
      cardLast4,
      createdAt: new Date(),
    };

    const bookingResult = await (
      await bookingsCollection()
    ).insertOne(bookingDoc);
    const bookingId = bookingResult.insertedId;

    const pdfBuffer = await generateInvoicePdfBuffer(
      {...bookingDoc, bookingId: String(bookingId)},
      req.url,
    );

    const filename = `invoice-${invoiceNo}.pdf`;
    const invoiceKey = `invoices/${filename}`;
    await uploadPdfToS3({key: invoiceKey, buffer: pdfBuffer});
    // ✅ 4) Prepare emails
    const bookingDateText = bookingDoc.bookingDate
      ? new Date(bookingDoc.bookingDate).toLocaleDateString("en-AU", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";

    const bookingTimeText = bookingDoc.bookingTime || "";
    const addressLine = `${bookingDoc.address}${bookingDoc.suburb ? `, ${bookingDoc.suburb}` : ""}`;

    // Instructor mail (your required info)
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
        <h2>${bookingDoc.paymentStatus === "paid" ? "Payment Confirmed 🎉" : "Booking Confirmed ✅"}</h2>
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

    // ✅ 5) Send emails
    const mailLog = {
      user: {to: bookingDoc.userEmail, ok: false, error: null},
      instructor: {
        to: bookingDoc.instructorEmail || null,
        ok: false,
        error: null,
      },
      sentAt: new Date(),
    };

    // Send to user
    if (bookingDoc.userEmail) {
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

      // ✅ keep mailLog accurate
      mailLog.user.ok = status === "SENT";
      mailLog.user.error = errorMsg;

      await (
        await emailsCollection()
      ).insertOne({
        bookingId,
        invoiceNo,
        actorType: "USER",
        type:"BOOKINGS_CONFIRM",
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
    }

    // Send to instructor
    if (bookingDoc.instructorEmail) {
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
        type:"BOOKINGS_CONFIRM",
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
    }

    await (
      await invoicesCollection()
    ).insertOne({
      invoiceNo,
      bookingId,
      createdAt: new Date(),
      paymentStatus: bookingDoc.paymentStatus || "unpaid",
      paymentMethod,
      cardBrand,
      cardLast4,

      // ✅ store storage key instead of base64
      invoiceKey,
      filename,

      userEmail: bookingDoc.userEmail,
      instructorEmail: bookingDoc.instructorEmail || null,

      mailLog,
      total: bookingDoc.price || 0,
    });

    // ✅ 7) Return success
    return NextResponse.json(
      {
        ok: true,
        bookingId: String(bookingId),
        invoiceNo,
        mailLog,
      },
      {status: 201},
    );
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return NextResponse.json(
      {error: "Failed to delete booking"},
      {status: 500},
    );
  }
}
