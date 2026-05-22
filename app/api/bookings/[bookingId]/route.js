

import { sendMail } from "@/app/libs/mail/mailer";
import { bookingsCollection, instructorsCollection,clientsCollection } from "@/app/libs/mongodb/db";
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

async function sendStatusChangeEmails({ booking, oldStatus, newStatus }) {
  const userEmail =
    booking.userEmail || booking.clientEmail || booking.email || "";

  let instructorEmail = booking.instructorEmail || "";

  // Optional fallback: if instructorEmail missing, find from instructors collection
  if (!instructorEmail && booking.instructorId && ObjectId.isValid(booking.instructorId)) {
    try {
      const instructorsCol = await instructorsCollection();

      const instructor = await instructorsCol.findOne({
        _id: new ObjectId(booking.instructorId),
      });

      instructorEmail = instructor?.email || "";
    } catch (error) {
      console.error("Failed to find instructor email:", error);
    }
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

  const bookingDetailsHtml = `
    <p><b>Booking details:</b></p>
    <p><b>Service:</b> ${booking.serviceName || "—"}</p>
    <p><b>Date:</b> ${bookingDateText}</p>
    <p><b>Time:</b> ${booking.bookingTime || "—"}</p>
    <p><b>Client:</b> ${booking.userName || booking.clientName || "—"}</p>
    <p><b>Instructor:</b> ${booking.instructorName || "—"}</p>
    <p><b>Old Status:</b> ${oldStatus || "—"}</p>
    <p><b>New Status:</b> ${newStatus || "—"}</p>
  `;

  const bookingDetailsText = `
Booking details:
Service: ${booking.serviceName || "—"}
Date: ${bookingDateText}
Time: ${booking.bookingTime || "—"}
Client: ${booking.userName || booking.clientName || "—"}
Instructor: ${booking.instructorName || "—"}
Old Status: ${oldStatus || "—"}
New Status: ${newStatus || "—"}
`;

  const jobs = [];

  if (userEmail) {
    jobs.push({
      actorType: "USER",
      to: userEmail,
      subject: `Booking Status Changed: ${newStatus}`,
      text: `Your booking has been updated from ${oldStatus || "—"} to ${newStatus}.

${bookingDetailsText}

Thank you for booking with us!`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <p>
            Your booking has been updated from 
            <strong>${oldStatus || "—"}</strong> to 
            <strong>${newStatus}</strong>.
          </p>
          ${bookingDetailsHtml}
          <p>Thank you for booking with us!</p>
        </div>
      `,
    });
  }

  if (instructorEmail) {
    jobs.push({
      actorType: "INSTRUCTOR",
      to: instructorEmail,
      subject: `Booking Status Updated: ${booking.serviceName || "Booking"} - ${newStatus}`,
      text: `A booking assigned to you has been updated from ${oldStatus || "—"} to ${newStatus}.

${bookingDetailsText}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <p>
            A booking assigned to you has been updated from 
            <strong>${oldStatus || "—"}</strong> to 
            <strong>${newStatus}</strong>.
          </p>
          ${bookingDetailsHtml}
        </div>
      `,
    });
  }

  if (!jobs.length) {
    return {
      ok: false,
      skipped: true,
      error: "No user or instructor email found",
    };
  }

  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      try {
        await sendMail({
          to: job.to,
          subject: job.subject,
          html: job.html,
          text: job.text,
        });

        return {
          actorType: job.actorType,
          to: job.to,
          ok: true,
          error: null,
        };
      } catch (error) {
        return {
          actorType: job.actorType,
          to: job.to,
          ok: false,
          error: String(error?.message || error),
        };
      }
    })
  );

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ok: false,
          error: String(result.reason?.message || result.reason),
        }
  );
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


const CREDIT_STATUSES = ["cancelled", "unattended"];

function money(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function getClientFilterFromBooking(booking) {
  if (booking?.clientId && ObjectId.isValid(String(booking.clientId))) {
    return {
      _id: new ObjectId(String(booking.clientId)),
    };
  }

  const email = String(
    booking?.userEmail || booking?.clientEmail || ""
  )
    .trim()
    .toLowerCase();

  if (!email) return null;

  return {
    $or: [
      { email },
      { linkedUserEmail: email },
    ],
  };
}

async function issueBookingCreditOnce({ booking, bookingId, status }) {
  const creditAmount = money(
    booking.price ||
    booking.originalPrice ||
    booking.paidAmount ||
    0
  );

  if (creditAmount <= 0) {
    return {
      issued: false,
      amount: 0,
      reason: "No valid credit amount",
    };
  }

  const clientFilter = getClientFilterFromBooking(booking);

  if (!clientFilter) {
    return {
      issued: false,
      amount: creditAmount,
      reason: "No clientId or userEmail found",
    };
  }

  const ref = `booking-credit:${bookingId}:${status}`;

  const clientsCol = await clientsCollection();

  const result = await clientsCol.updateOne(
    {
      $and: [
        clientFilter,

        // prevents double credit for same booking/status
        {
          $or: [
            { "balanceLedger.ref": { $ne: ref } },
            { balanceLedger: { $exists: false } },
          ],
        },
      ],
    },
    {
      $inc: {
        accountBalance: creditAmount,
      },
      $push: {
        balanceLedger: {
          ref,
          type: "booking-credit-issued",
          bookingId: String(bookingId),
          amount: creditAmount,
          note: `Credit issued because booking was ${status}`,
          createdAt: new Date(),
        },
      },
      $set: {
        updatedAt: new Date(),
      },
    }
  );

  if (result.modifiedCount !== 1) {
    return {
      issued: false,
      amount: creditAmount,
      reason: "Credit already issued or client not found",
    };
  }

  return {
    issued: true,
    amount: creditAmount,
    reason: "Credit added",
  };
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

//  if (statusWasProvided && oldStatus !== newStatus) {
//   await sendStatusChangeEmails({
//     booking: updatedDoc,
//     oldStatus,
//     newStatus,
//   });
// }
let creditResult = null;

if (statusWasProvided && oldStatus !== newStatus) {
  await sendStatusChangeEmails({
    booking: updatedDoc,
    oldStatus,
    newStatus,
  });

  const finalStatus = String(newStatus || "").toLowerCase();
  const finalPaymentStatus = String(updatedDoc.paymentStatus || "").toLowerCase();

  const shouldIssueCredit =
    CREDIT_STATUSES.includes(finalStatus) &&
    finalPaymentStatus === "paid";

  if (shouldIssueCredit) {
    creditResult = await issueBookingCreditOnce({
      booking: updatedDoc,
      bookingId,
      status: finalStatus,
    });

    if (creditResult.issued) {
      await bookingsCol.updateOne(
        { _id: new ObjectId(bookingId) },
        {
          $set: {
            creditIssued: true,
            creditIssuedAmount: creditResult.amount,
            creditIssuedAt: new Date(),
            creditIssuedReason: finalStatus,
            updatedAt: new Date(),
          },
        }
      );
    }
  }
}
    const finalDoc = await bookingsCol.findOne({
  _id: new ObjectId(bookingId),
});

return NextResponse.json({
  ...finalDoc,
  creditResult,
});
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
