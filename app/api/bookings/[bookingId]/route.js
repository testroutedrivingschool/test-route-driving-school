

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
const CANCELLATION_REASONS = {
  none_given: {
    category: "client",
    label: "None Given",
  },
  reschedule: {
    category: "client",
    label: "Reschedule",
  },
  sick: {
    category: "client",
    label: "Sick",
  },
  other: {
    category: "client",
    label: "Other",
  },
  instructor_sick: {
    category: "business",
    label: "Instructor Sick",
  },
  cancelled_by_instructor: {
    category: "business",
    label: "Cancelled by Instructor",
  },
};

function normalizeServiceName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isDrivingTestPackage(serviceName) {
  return (
    normalizeServiceName(serviceName) ===
    "driving test package"
  );
}

function normalizeTestValue(value) {
  return String(value ?? "").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTestTimeForEmail(time) {
  const value = normalizeTestValue(time);

  if (!value) return "—";

  const match = value.match(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  );

  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes}${period}`;
}

function formatTestDateForEmail(date) {
  const value = normalizeTestValue(date);

  if (!value) return "—";

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return value;

  const parsed = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    )
  );

  return parsed.toLocaleDateString("en-AU", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTestResult(value) {
  const result = normalizeTestValue(
    value
  ).toLowerCase();

  if (result === "passed") return "Passed";
  if (result === "failed") return "Failed";

  return "Pending";
}

async function sendDrivingTestUpdateEmail({
  booking,
  changedFields,
}) {
  if (
    !isDrivingTestPackage(
      booking?.serviceName
    )
  ) {
    return {
      ok: false,
      skipped: true,
      reason:
        "Booking is not a Driving Test Package",
    };
  }

  const userEmail =
    booking?.userEmail ||
    booking?.clientEmail ||
    booking?.email ||
    "";

  if (!userEmail) {
    return {
      ok: false,
      skipped: true,
      reason: "User email not found",
    };
  }

  const userName =
    booking?.userName ||
    booking?.clientName ||
    "there";

  const result = normalizeTestValue(
    booking?.testResult
  ).toLowerCase();

  const resultText =
    formatTestResult(result);

  const resultColor =
    result === "passed"
      ? "#15803d"
      : result === "failed"
        ? "#dc2626"
        : "#4b5563";

  const resultBackground =
    result === "passed"
      ? "#dcfce7"
      : result === "failed"
        ? "#fee2e2"
        : "#f3f4f6";

  const resultBorder =
    result === "passed"
      ? "#86efac"
      : result === "failed"
        ? "#fca5a5"
        : "#d1d5db";

  const resultWasChanged =
    changedFields.includes("testResult");

  let subject =
    "Driving Test Information Updated";

  if (
    resultWasChanged &&
    result === "passed"
  ) {
    subject =
      "Driving Test Result: Passed";
  }

  if (
    resultWasChanged &&
    result === "failed"
  ) {
    subject =
      "Driving Test Result: Failed";
  }

  const changedLabels = {
    testLocation: "Test Location",
    testTime: "Test Time",
    bookingRefNo: "Booking Reference",
    testDate: "Pass / Fail Date",
    testResult: "Test Result",
    testResultComment: "Comment",
  };

  const changedText = changedFields
    .map(
      (field) =>
        changedLabels[field] || field
    )
    .join(", ");

  const bookingDateText =
    booking?.bookingDate
      ? new Date(
          booking.bookingDate
        ).toLocaleDateString("en-AU", {
          timeZone: "Australia/Sydney",
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—";

  const bookingRefHtml =
    booking?.bookingRefNo
      ? `
        <tr>
          <td style="padding:8px 12px;font-weight:700">
            Booking Ref #:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              booking.bookingRefNo
            )}
          </td>
        </tr>
      `
      : "";

  const commentHtml =
    booking?.testResultComment
      ? `
        <tr>
          <td style="padding:8px 12px;font-weight:700;vertical-align:top">
            Comment:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              booking.testResultComment
            )}
          </td>
        </tr>
      `
      : "";

  const html = `
    <div
      style="
        font-family:Arial,sans-serif;
        line-height:1.6;
        color:#111827;
        max-width:650px;
        margin:0 auto;
      "
    >
      <h2 style="margin-bottom:8px">
        ${escapeHtml(subject)}
      </h2>

      <p>
        Hi ${escapeHtml(userName)},
      </p>

      <p>
        Your Driving Test Package information has been updated.
      </p>

      <p style="color:#4b5563">
        <b>Updated:</b>
        ${escapeHtml(changedText)}
      </p>

      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:20px;
          border:1px solid #e5e7eb;
        "
      >
        <tr style="background:#f9fafb">
          <td style="padding:8px 12px;font-weight:700">
            Service:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              booking?.serviceName || "—"
            )}
          </td>
        </tr>

        <tr>
          <td style="padding:8px 12px;font-weight:700">
            Booking Date:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(bookingDateText)}
          </td>
        </tr>

        <tr style="background:#f9fafb">
          <td style="padding:8px 12px;font-weight:700">
            Test Location:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              booking?.testLocation || "—"
            )}
          </td>
        </tr>

        <tr>
          <td style="padding:8px 12px;font-weight:700">
            Test Time:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              formatTestTimeForEmail(
                booking?.testTime
              )
            )}
          </td>
        </tr>

        ${bookingRefHtml}

        <tr style="background:#f9fafb">
          <td style="padding:8px 12px;font-weight:700">
            Pass / Fail Date:
          </td>
          <td style="padding:8px 12px">
            ${escapeHtml(
              formatTestDateForEmail(
                booking?.testDate
              )
            )}
          </td>
        </tr>

        <tr>
          <td style="padding:8px 12px;font-weight:700">
            Test Result:
          </td>
          <td style="padding:8px 12px">
            <span
              style="
                display:inline-block;
                padding:4px 12px;
                border-radius:999px;
                font-weight:700;
                color:${resultColor};
                background:${resultBackground};
                border:1px solid ${resultBorder};
              "
            >
              ${escapeHtml(resultText)}
            </span>
          </td>
        </tr>

        ${commentHtml}
      </table>

      <p style="margin-top:24px">
        Thanks,<br/>
        Test Route Driving School
      </p>
    </div>
  `;

  const bookingRefText =
    booking?.bookingRefNo
      ? `Booking Ref #: ${booking.bookingRefNo}\n`
      : "";

  const commentText =
    booking?.testResultComment
      ? `Comment: ${booking.testResultComment}\n`
      : "";

  const text = `Hi ${userName},

Your Driving Test Package information has been updated.

Updated: ${changedText}

Service: ${booking?.serviceName || "—"}
Booking Date: ${bookingDateText}
Test Location: ${booking?.testLocation || "—"}
Test Time: ${formatTestTimeForEmail(
    booking?.testTime
  )}
${bookingRefText}Pass / Fail Date: ${formatTestDateForEmail(
    booking?.testDate
  )}
Test Result: ${resultText}
${commentText}
Thanks,
Test Route Driving School`;

  try {
    await sendMail({
      to: userEmail,
      subject,
      html,
      text,
    });

    return {
      ok: true,
      skipped: false,
      to: userEmail,
      subject,
      changedFields,
    };
  } catch (error) {
    console.error(
      "DRIVING TEST UPDATE EMAIL ERROR:",
      error
    );

    return {
      ok: false,
      skipped: false,
      to: userEmail,
      error: String(
        error?.message || error
      ),
    };
  }
}
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

    const cancellation = booking?.cancellation || {};

const cancellationReasonText =
  cancellation.reasonCode === "other"
    ? cancellation.customReason || "Other"
    : cancellation.reasonLabel || "None Given";

const cancellationDetailsHtml =
  String(newStatus).toLowerCase() === "cancelled"
    ? `
        <p>
          <b>Cancellation Reason:</b>
          ${cancellationReasonText}
        </p>

        <p>
          <b>Reason Category:</b>
          ${cancellation.reasonCategory || "client"}
        </p>

        <p>
          <b>Client Forfeit:</b>
          $${money(cancellation.clientForfeit || 0).toFixed(2)}
        </p>
      `
    : "";

const cancellationDetailsText =
  String(newStatus).toLowerCase() === "cancelled"
    ? `
Cancellation Reason: ${cancellationReasonText}
Reason Category: ${cancellation.reasonCategory || "client"}
Client Forfeit: $${money(
        cancellation.clientForfeit || 0
      ).toFixed(2)}
`
    : "";

  const bookingDetailsHtml = `
    <p><b>Booking details:</b></p>
    <p><b>Service:</b> ${booking.serviceName || "—"}</p>
    <p><b>Date:</b> ${bookingDateText}</p>
    <p><b>Time:</b> ${booking.bookingTime || "—"}</p>
    <p><b>Client:</b> ${booking.userName || booking.clientName || "—"}</p>
    <p><b>Instructor:</b> ${booking.instructorName || "—"}</p>
    
    ${cancellationDetailsHtml}
  `;

  const bookingDetailsText = `
Booking details:
Service: ${booking.serviceName || "—"}
Date: ${bookingDateText}
Time: ${booking.bookingTime || "—"}
Client: ${booking.userName || booking.clientName || "—"}
Instructor: ${booking.instructorName || "—"}

${cancellationDetailsHtml}
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

async function issueBookingCreditOnce({   booking,
  bookingId,
  status,
  amount,}) {
  // const creditAmount = money(
  //   booking.price ||
  //   booking.originalPrice ||
  //   booking.paidAmount ||
  //   0
  // );
  const creditAmount = money(amount);

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

  // Driving Test Package fields
  "testLocation",
  "testTime",
  "bookingRefNo",
  "testDate",
  "testResult",
  "testResultComment",
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

    /*
 * Driving Test Package fields
 */

if ($set.testLocation !== undefined) {
  $set.testLocation = String(
    $set.testLocation || ""
  ).trim();
}

if ($set.testTime !== undefined) {
  $set.testTime = String(
    $set.testTime || ""
  ).trim();

  /*
   * Empty value is allowed.
   * Otherwise the format must be HH:MM.
   */
  if (
    $set.testTime &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(
      $set.testTime
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Test time must use HH:MM format",
      },
      {status: 400}
    );
  }
}

if ($set.bookingRefNo !== undefined) {
  /*
   * Booking reference is optional.
   */
  $set.bookingRefNo = String(
    $set.bookingRefNo || ""
  ).trim();
}

if ($set.testDate !== undefined) {
  $set.testDate = String(
    $set.testDate || ""
  ).trim();

  /*
   * Empty date is allowed.
   * Otherwise it must use YYYY-MM-DD.
   */
  if (
    $set.testDate &&
    !/^\d{4}-\d{2}-\d{2}$/.test(
      $set.testDate
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Pass / Fail date must use YYYY-MM-DD format",
      },
      {status: 400}
    );
  }

  if ($set.testDate) {
    const parsedTestDate = new Date(
      `${$set.testDate}T00:00:00`
    );

    if (
      Number.isNaN(
        parsedTestDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Pass / Fail date",
        },
        {status: 400}
      );
    }
  }
}

if ($set.testResult !== undefined) {
  $set.testResult = String(
    $set.testResult || ""
  )
    .trim()
    .toLowerCase();

  const allowedTestResults = [
    "",
    "passed",
    "failed",
  ];

  if (
    !allowedTestResults.includes(
      $set.testResult
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Test result must be passed or failed",
      },
      {status: 400}
    );
  }
}

if ($set.testResultComment !== undefined) {
  $set.testResultComment = String(
    $set.testResultComment || ""
  ).trim();
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

    /*
 * Validate the final Pass / Fail information
 * using both existing and newly submitted values.
 */
const finalTestResult =
  $set.testResult !== undefined
    ? $set.testResult
    : String(
        oldBooking.testResult || ""
      )
        .trim()
        .toLowerCase();

const finalTestDate =
  $set.testDate !== undefined
    ? $set.testDate
    : String(
        oldBooking.testDate || ""
      ).trim();

if (
  finalTestResult &&
  !finalTestDate
) {
  return NextResponse.json(
    {
      error:
        "Pass / Fail date is required when a result is selected",
    },
    {status: 400}
  );
}

if (
  finalTestDate &&
  !finalTestResult
) {
  return NextResponse.json(
    {
      error:
        "Select Passed or Failed when entering a Pass / Fail date",
    },
    {status: 400}
  );
}
let cancellationData = null;

if ($set.status === "cancelled") {
  const cancellation = body?.cancellation;

  if (!cancellation) {
    return NextResponse.json(
      {
        error: "Cancellation reason is required",
      },
      {
        status: 400,
      }
    );
  }

  const reasonCode = String(
    cancellation.reasonCode || ""
  )
    .trim()
    .toLowerCase();

  const selectedReason =
    CANCELLATION_REASONS[reasonCode];

  if (!selectedReason) {
    return NextResponse.json(
      {
        error: "Please select a valid cancellation reason",
      },
      {
        status: 400,
      }
    );
  }

  const customReason = String(
    cancellation.customReason || ""
  ).trim();

  if (
    reasonCode === "other" &&
    !customReason
  ) {
    return NextResponse.json(
      {
        error: "Please enter the cancellation reason",
      },
      {
        status: 400,
      }
    );
  }

  const sendCustomSms = Boolean(
    cancellation.sendCustomSms
  );

  const customSms = String(
    cancellation.customSms || ""
  ).trim();

  if (
    sendCustomSms &&
    !customSms
  ) {
    return NextResponse.json(
      {
        error: "Please enter the custom cancellation SMS",
      },
      {
        status: 400,
      }
    );
  }

  const clientForfeit = money(
    cancellation.clientForfeit || 0
  );

  const maximumForfeit = money(
    oldBooking.paidAmount ||
      oldBooking.price ||
      0
  );

  if (
    !Number.isFinite(clientForfeit) ||
    clientForfeit < 0
  ) {
    return NextResponse.json(
      {
        error: "Invalid client forfeit amount",
      },
      {
        status: 400,
      }
    );
  }

  if (clientForfeit > maximumForfeit) {
    return NextResponse.json(
      {
        error:
          "Client forfeit cannot be greater than the booking amount",
      },
      {
        status: 400,
      }
    );
  }

  cancellationData = {
    reasonCode,

    // Server determines these values
    reasonCategory:
      selectedReason.category,

    reasonLabel:
      selectedReason.label,

    customReason:
      reasonCode === "other"
        ? customReason
        : "",

    clientForfeit,

    blockClient: Boolean(
      cancellation.blockClient
    ),

    sendCustomSms,

    customSms:
      sendCustomSms
        ? customSms
        : "",

    cancelledBy: {
      userId: String(
        cancellation.cancelledBy?.userId || ""
      ),

      name: String(
        cancellation.cancelledBy?.name || ""
      ),

      role: String(
        cancellation.cancelledBy?.role || ""
      ),
    },

    cancelledAt: new Date(),
  };

  $set.cancellation = cancellationData;
  $set.cancelledAt = new Date();
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
const testEmailFields = [
  "testLocation",
  "testTime",
  "bookingRefNo",
  "testDate",
  "testResult",
  "testResultComment",
];

const changedTestFields =
  testEmailFields.filter((field) => {
    /*
     * Only inspect fields included in this
     * specific PATCH request.
     */
    const wasSubmitted =
      Object.prototype.hasOwnProperty.call(
        body,
        field
      );

    if (!wasSubmitted) {
      return false;
    }

    const oldValue =
      normalizeTestValue(
        oldBooking?.[field]
      );

    const newValue =
      normalizeTestValue(
        updatedDoc?.[field]
      );

    return oldValue !== newValue;
  });

let testUpdateEmailResult = null;

if (changedTestFields.length > 0) {
  testUpdateEmailResult =
    await sendDrivingTestUpdateEmail({
      booking: updatedDoc,
      changedFields:
        changedTestFields,
    });
}
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
  const paidAmount = money(
    updatedDoc.paidAmount ||
      updatedDoc.price ||
      0
  );

  const clientForfeit =
    finalStatus === "cancelled"
      ? money(
          updatedDoc.cancellation
            ?.clientForfeit || 0
        )
      : 0;

  const refundableAmount = money(
    Math.max(
      0,
      paidAmount - clientForfeit
    )
  );

  creditResult =
    await issueBookingCreditOnce({
      booking: updatedDoc,
      bookingId,
      status: finalStatus,
      amount: refundableAmount,
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
let clientBlockResult = null;
let smsWarning = null;

/*
 * Block the client from online booking
 */
if (cancellationData?.blockClient) {
  const clientFilter =
    getClientFilterFromBooking(updatedDoc);

  if (!clientFilter) {
    clientBlockResult = {
      blocked: false,
      reason: "Client could not be identified",
    };
  } else {
    const clientsCol =
      await clientsCollection();

    const blockResult =
      await clientsCol.updateOne(
        clientFilter,
        {
          $set: {
            onlineBookingBlocked: true,

            onlineBookingBlockedAt:
              new Date(),

            onlineBookingBlockedReason:
              cancellationData.reasonCode === "other"
                ? cancellationData.customReason
                : cancellationData.reasonLabel,

            onlineBookingBlockedBy:
              cancellationData.cancelledBy,

            updatedAt:
              new Date(),
          },
        }
      );

    clientBlockResult = {
      blocked:
        blockResult.matchedCount > 0,

      reason:
        blockResult.matchedCount > 0
          ? "Client blocked"
          : "Client not found",
    };
  }
}

/*
 * SMS provider is not connected yet
 */
if (cancellationData?.sendCustomSms) {
  smsWarning =
    "Booking cancelled and custom SMS saved, but SMS provider is not configured.";
}

    const finalDoc = await bookingsCol.findOne({
  _id: new ObjectId(bookingId),
});

return NextResponse.json({
  // Keep old response compatibility
  ...finalDoc,

  // New structured response
  ok: true,
  booking: finalDoc,

  creditResult,
  clientBlockResult,
  smsWarning,
  testUpdateEmailResult,
  message:
    String(finalDoc?.status).toLowerCase() === "cancelled"
      ? "Booking cancelled successfully"
      : "Booking updated successfully",
});
  } catch (e) {
    console.error("PATCH BOOKING ERROR:", e);

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
