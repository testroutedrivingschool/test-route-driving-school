import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  instructorSlotsCollection,
  bookingsCollection,
  emailsCollection,
} from "@/app/libs/mongodb/db";
import { sendMail } from "@/app/libs/mail/mailer";

function formatDate(d) {
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function formatDateLong(d) {
  return new Date(d).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export async function POST(req) {
  try {
    const { instructorId, instructorEmail, instructorName, weekStart } =
      await req.json();

    if (!instructorId || !weekStart) {
      return NextResponse.json(
        { error: "Missing instructorId or weekStart" },
        { status: 400 }
      );
    }

    const instructorObjectId = new ObjectId(instructorId);

    const weekDates = getWeekDates(weekStart);
    const weekEnd = weekDates[6];

    const slotsCol = await instructorSlotsCollection();
    const bookingsCol = await bookingsCollection();

    const slots = await slotsCol
      .find({
        instructorId: instructorObjectId,
        date: { $gte: weekStart, $lte: weekEnd },
      })
      .toArray();

    const bookings = await bookingsCol
      .find({
        instructorId,
        bookingDate: {
          $gte: `${weekStart}T00:00:00.000Z`,
          $lte: `${weekEnd}T23:59:59.999Z`,
        },
      })
      .toArray();

    const totalBookings = bookings.length;
    const cancellations = bookings.filter((b) => b.status === "cancelled").length;
    const noShows = bookings.filter((b) => b.status === "no-show").length;
    const pending = bookings.filter((b) => b.status === "pending").length;

    const availabilitySlots = slots
      .filter((s) => s.visibility === "public")
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });

    const availabilityHtml =
      availabilitySlots.length > 0
        ? availabilitySlots
            .map((s) => `<li>${s.date} – ${s.time}</li>`)
            .join("")
        : "<li>No availability slots</li>";

    const subject = "Weekly Schedule Summary";

    const text = `Hi ${instructorName},

The week from ${formatDateLong(weekStart)} to ${formatDateLong(weekEnd)} you had:

${totalBookings} Bookings
${cancellations || "Zero"} Cancellations
${noShows || "Zero"} No Shows
${pending || "Zero"} Bookings that still need action

Availability Slots:
${availabilitySlots.map((s) => `${s.date} ${s.time}`).join("\n")}

Test Route Driving School
`;

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">

<h2>Weekly Summary</h2>

<p>Hi ${instructorName},</p>

<p>
The week from <b>${formatDateLong(weekStart)}</b> to
<b>${formatDateLong(weekEnd)}</b> you had:
</p>

<ul>
<li><b>${totalBookings}</b> Bookings</li>
<li>${cancellations || "Zero"} Cancellations</li>
<li>${noShows || "Zero"} No Shows</li>
<li>${pending || "Zero"} Bookings that still need action</li>
</ul>



<p style="margin-top:30px;color:#666;font-size:12px">
Test Route Driving School System
</p>

</div>
`;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMail({
        to: instructorEmail,
        subject,
        html,
        text,
      });
    } catch (err) {
      status = "FAILED";
      errorMsg = String(err?.message || err);
    }

    // ✅ log email in DB
    await (await emailsCollection()).insertOne({
      actorType: "INSTRUCTOR",
      type: "WEEKLY_SUMMARY",
      instructorId: instructorObjectId,
      to: instructorEmail,
      subject,
      text,
      html,
      preview: text.slice(0, 200),
      status,
      error: errorMsg,
      hasAttachment: false,
      sentAt: new Date(),
      createdAt: new Date(),
      meta: {
        weekStart,
        weekEnd,
        totalBookings,
        cancellations,
        noShows,
        pending,
        availabilityCount: availabilitySlots.length,
      },
    });

    return NextResponse.json({
      success: status === "SENT",
      totalBookings,
      cancellations,
      noShows,
      pending,
      availabilityCount: availabilitySlots.length,
    });
  } catch (err) {
    console.error("send-weekly-summary error:", err);

    return NextResponse.json(
      { error: err.message || "Failed to send summary" },
      { status: 500 }
    );
  }
}