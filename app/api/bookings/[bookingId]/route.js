

import { sendMail } from "@/app/libs/mail/mailer";
import { bookingsCollection, instructorsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "unattended",
];

const ALLOWED_PAYMENT_STATUSES = ["paid", "partial", "unpaid"];

async function sendStatusChangeEmail({ booking, oldStatus, newStatus }) {
  const to = booking.userEmail || booking.clientEmail || booking.email || "";

  if (!to) {
    return {
      ok: false,
      skipped: true,
      error: "Client email not found",
    };
  }

  const bookingDateText = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const subject = `Booking Status Changed: ${newStatus}`;

  const text = `Your booking has been updated from ${oldStatus || "—"} to ${newStatus}.

Booking details:
Service: ${booking.serviceName || "—"}
Date: ${bookingDateText}
Time: ${booking.bookingTime || "—"}
Instructor: ${booking.instructorName || "—"}
Status: ${newStatus}

Thank you for booking with us!`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <p>
        Your booking has been updated from 
        <strong>${oldStatus || "—"}</strong> to 
        <strong>${newStatus}</strong>.
      </p>

      <p><b>Booking details:</b></p>
      <p><b>Service:</b> ${booking.serviceName || "—"}</p>
      <p><b>Date:</b> ${bookingDateText}</p>
      <p><b>Time:</b> ${booking.bookingTime || "—"}</p>
      <p><b>Instructor:</b> ${booking.instructorName || "—"}</p>
      <p><b>Status:</b> ${newStatus}</p>

      <p>Thank you for booking with us!</p>
    </div>
  `;

  try {
    await sendMail({
      to,
      subject,
      html,
      text,
    });

    return {
      ok: true,
      skipped: false,
      error: null,
    };
  } catch (e) {
    return {
      ok: false,
      skipped: false,
      error: String(e?.message || e),
    };
  }
}

export async function GET(req, { params }) {
  try {
    const { bookingId } = await params;

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking id" },
        { status: 400 }
      );
    }

    const bookingsCol = await bookingsCollection();
    const instructorsCol = await instructorsCollection();

    const booking = await bookingsCol.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let instructorPhoto = "";
    let instructorPhotoKey = "";
    let instructorName = booking.instructorName || "";

    if (booking.instructorId && ObjectId.isValid(booking.instructorId)) {
      const instructor = await instructorsCol.findOne({
        _id: new ObjectId(booking.instructorId),
      });

      if (instructor) {
        instructorPhoto = instructor.photo || "";
        instructorPhotoKey = instructor.photoKey || "";
        instructorName = instructor.name || instructorName;
      }
    }

    const enrichedBooking = {
      ...booking,
      instructorPhoto,
      instructorPhotoKey,
      instructorName,
    };

    return NextResponse.json(enrichedBooking);
  } catch (e) {
    console.error("GET BOOKING ERROR:", e);

    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { bookingId } = await params;

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking id" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const allowed = [
      "status",
      "paymentStatus",
      "paymentMethod",
      "paymentIntentId",
      "paidAmount",
      "cashAmount",
      "cardAmount",
      "outstanding",
      "processingFee",
      "cardBrand",
      "cardLast4",
      "userPhone",
      "address",
      "suburb",
      "bookingDate",
      "bookingTime",
      "price",
      "originalPrice",
      "overridePrice",
      "isPriceOverridden",
    ];

    const $set = {
      updatedAt: new Date(),
    };

    for (const key of allowed) {
      if (body[key] !== undefined) {
        $set[key] = body[key];
      }
    }

    if (Object.keys($set).length === 1) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400 }
      );
    }

    if ($set.bookingDate !== undefined) {
      const d = new Date($set.bookingDate);

      if (Number.isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Invalid bookingDate" },
          { status: 400 }
        );
      }

      $set.bookingDate = d;
    }

    if ($set.bookingTime !== undefined) {
      $set.bookingTime = String($set.bookingTime).trim();
    }

    if ($set.paymentStatus !== undefined) {
      const value = String($set.paymentStatus).toLowerCase();

      if (!ALLOWED_PAYMENT_STATUSES.includes(value)) {
        return NextResponse.json(
          { error: "Invalid paymentStatus" },
          { status: 400 }
        );
      }

      $set.paymentStatus = value;
    }

    if ($set.paymentMethod !== undefined) {
      $set.paymentMethod = String($set.paymentMethod).toLowerCase();
    }

    if ($set.status !== undefined) {
      const value = String($set.status).toLowerCase();

      if (!ALLOWED_STATUSES.includes(value)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }

      $set.status = value;
      $set.statusUpdatedAt = new Date();

      if (value === "completed") {
        $set.completedAt = new Date();
      }

      if (value === "cancelled") {
        $set.cancelledAt = new Date();
      }

      if (value === "unattended") {
        $set.unattendedAt = new Date();
      }
    }

    if ($set.price !== undefined) {
      $set.price = Number($set.price);

      if (Number.isNaN($set.price) || $set.price < 0) {
        return NextResponse.json(
          { error: "Invalid price" },
          { status: 400 }
        );
      }
    }

    if ($set.originalPrice !== undefined) {
      $set.originalPrice = Number($set.originalPrice);

      if (Number.isNaN($set.originalPrice) || $set.originalPrice < 0) {
        return NextResponse.json(
          { error: "Invalid originalPrice" },
          { status: 400 }
        );
      }
    }

    if ($set.overridePrice !== undefined) {
      if ($set.overridePrice === null || $set.overridePrice === "") {
        $set.overridePrice = null;
      } else {
        $set.overridePrice = Number($set.overridePrice);

        if (Number.isNaN($set.overridePrice) || $set.overridePrice < 0) {
          return NextResponse.json(
            { error: "Invalid overridePrice" },
            { status: 400 }
          );
        }
      }
    }

    if ($set.isPriceOverridden !== undefined) {
      $set.isPriceOverridden = Boolean($set.isPriceOverridden);
    }

    const bookingsCol = await bookingsCollection();

    const oldBooking = await bookingsCol.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!oldBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const update = await bookingsCol.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set }
    );

    if (update.matchedCount === 0) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const updatedDoc = await bookingsCol.findOne({
      _id: new ObjectId(bookingId),
    });

    const statusWasProvided = Object.prototype.hasOwnProperty.call(
      body,
      "status"
    );

    const oldStatus = oldBooking.status;
    const newStatus = updatedDoc.status;

    if (statusWasProvided && oldStatus !== newStatus) {
      await sendStatusChangeEmail({
        booking: updatedDoc,
        oldStatus,
        newStatus,
      });
    }

    return NextResponse.json(updatedDoc);
  } catch (e) {
    console.error("PATCH BOOKING ERROR:", e);

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
// export async function PATCH(req, {params}) {
//   try {
//     const {bookingId} = await params;

//     if (!ObjectId.isValid(bookingId)) {
//       return NextResponse.json({error: "Invalid booking id"}, {status: 400});
//     }

//     const body = await req.json();

//     const allowed = [
//       "status",
//       "paymentStatus",
//       "paymentMethod",
//       "paymentIntentId",
//       "paidAmount",
//       "cashAmount",
//       "cardAmount",
//       "outstanding",
//       "processingFee",
//       "cardBrand",
//       "cardLast4",
//       "userPhone",
//       "address",
//       "suburb",
//       "bookingDate",
//       "bookingTime",

//       // ✅ cost override fields
//       "price",
//       "originalPrice",
//       "overridePrice",
//       "isPriceOverridden",
//     ];

//     const $set = {updatedAt: new Date()};

//     for (const k of allowed) {
//       if (body[k] !== undefined) $set[k] = body[k];
//     }

//     if ($set.bookingDate !== undefined) {
//       const d = new Date($set.bookingDate);
//       if (Number.isNaN(d.getTime())) {
//         return NextResponse.json({error: "Invalid bookingDate"}, {status: 400});
//       }
//       $set.bookingDate = d;
//     }

//     if ($set.bookingTime !== undefined) {
//       $set.bookingTime = String($set.bookingTime).trim();
//     }

//     if ($set.paymentStatus !== undefined) {
//       const v = String($set.paymentStatus).toLowerCase();
//       const ok = ["paid", "partial", "unpaid"].includes(v);
//       if (!ok) {
//         return NextResponse.json({error: "Invalid paymentStatus"}, {status: 400});
//       }
//       $set.paymentStatus = v;
//     }

//     if ($set.paymentMethod !== undefined) {
//       $set.paymentMethod = String($set.paymentMethod).toLowerCase();
//     }

//     if ($set.status !== undefined) {
//       const v = String($set.status).toLowerCase();
//       const ok = ["pending", "confirmed", "cancelled", "completed", "unattended"].includes(v);
//       if (!ok) {
//         return NextResponse.json({error: "Invalid status"}, {status: 400});
//       }
//       $set.status = v;
//     }

//     // ✅ normalize numbers
//     if ($set.price !== undefined) {
//       $set.price = Number($set.price);
//       if (Number.isNaN($set.price) || $set.price < 0) {
//         return NextResponse.json({error: "Invalid price"}, {status: 400});
//       }
//     }

//     if ($set.originalPrice !== undefined) {
//       $set.originalPrice = Number($set.originalPrice);
//       if (Number.isNaN($set.originalPrice) || $set.originalPrice < 0) {
//         return NextResponse.json({error: "Invalid originalPrice"}, {status: 400});
//       }
//     }

//     if ($set.overridePrice !== undefined) {
//       if ($set.overridePrice === null || $set.overridePrice === "") {
//         $set.overridePrice = null;
//       } else {
//         $set.overridePrice = Number($set.overridePrice);
//         if (Number.isNaN($set.overridePrice) || $set.overridePrice < 0) {
//           return NextResponse.json({error: "Invalid overridePrice"}, {status: 400});
//         }
//       }
//     }

//     if ($set.isPriceOverridden !== undefined) {
//       $set.isPriceOverridden = !!$set.isPriceOverridden;
//     }

//     const bookingsCol = await bookingsCollection();

//     const update = await bookingsCol.updateOne(
//       {_id: new ObjectId(bookingId)},
//       {$set},
//     );

//     if (update.matchedCount === 0) {
//       return NextResponse.json({error: "Not found"}, {status: 404});
//     }

//     const updatedDoc = await bookingsCol.findOne({_id: new ObjectId(bookingId)});
//     return NextResponse.json(updatedDoc);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       {error: "Failed to update booking"},
//       {status: 500},
//     );
//   }
// }
