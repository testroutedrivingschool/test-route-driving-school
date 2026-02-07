export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { sendMail } from "@/app/libs/mail/mailer";
import {
  bookingsCollection,
  emailsCollection,
  usersCollection,
  clientsCollection,
} from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

// ---- CONFIG ----
const TZ = "Asia/Dhaka";

// Security: call with header x-cron-secret
function assertCron(req) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    throw new Error("FORBIDDEN");
  }
}

function hhmmNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h}:${m}`;
}

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === "year")?.value;
  const mo = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${mo}-${d}`;
}

// Mongo: match bookingDate belongs to "today" in TZ
function todayMatchExpr() {
  return {
    $expr: {
      $eq: [
        {
          $dateTrunc: {
            date: {
              $convert: {
                input: "$bookingDate",
                to: "date",
                onError: null,
                onNull: null,
              },
            },
            unit: "day",
            timezone: TZ,
          },
        },
        {
          $dateTrunc: {
            date: "$$NOW",
            unit: "day",
            timezone: TZ,
          },
        },
      ],
    },
  };
}

async function getTodaysBookingsByInstructor(instructorEmail) {
  const col = await bookingsCollection();
  return col
    .aggregate([
      { $match: { instructorEmail, ...todayMatchExpr() } },
      { $sort: { bookingDate: 1, createdAt: 1 } },
      {
        $project: {
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          bookingDate: 1,
          clientName: 1,
          userName: 1,
          userEmail: 1,
          userPhone: 1,
          clientPhone: 1,
          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
          instructorName: 1,
          instructorEmail: 1,
        },
      },
    ])
    .toArray();
}

async function getTodaysBookingsByUser(userEmail) {
  const col = await bookingsCollection();

  return col
    .aggregate([
      { $match: { userEmail, ...todayMatchExpr() } },
      { $sort: { bookingDate: 1, createdAt: 1 } },

      // ✅ join instructor info from users collection
      {
        $lookup: {
          from: "users",                
          localField: "instructorEmail",
          foreignField: "email",
          as: "instructorUser",
        },
      },
      { $unwind: { path: "$instructorUser", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          bookingDate: 1,

          instructorName: 1,
          instructorEmail: 1,

       
          userPhone: 1,
          clientPhone: 1,

       
          instructorPhone: "$instructorUser.phone",

          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
        },
      },
    ])
    .toArray();
}


async function getTodaysBookingsAll() {
  const col = await bookingsCollection();
  return col
    .aggregate([
      { $match: { ...todayMatchExpr() } },
      { $sort: { instructorEmail: 1, bookingTime: 1 } },
      {
        $project: {
          instructorName: 1,
          instructorEmail: 1,
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          clientName: 1,
          userName: 1,
          userEmail: 1,
          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
        },
      },
    ])
    .toArray();
}

function buildInstructorDigestHtml(name, bookings) {
  const rows = bookings
    .map((b) => {
      const student = b.userName || b.clientName || "—";
      const phone = b.userPhone || b.clientPhone || "—";
      const address = `${b.address || ""}${b.suburb ? `, ${b.suburb}` : ""}`;
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.bookingTime || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.serviceName || ""} ${b.duration || ""}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${student}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${phone}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${address || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.status || "—"}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Today's Bookings</h2>
      <p>Hi ${name || "Instructor"}, here are your bookings for today.</p>
      ${bookings.length ? `
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f3f3f3">
              <th style="text-align:left;padding:8px;">Time</th>
              <th style="text-align:left;padding:8px;">Service</th>
              <th style="text-align:left;padding:8px;">Student</th>
              <th style="text-align:left;padding:8px;">Phone</th>
              <th style="text-align:left;padding:8px;">Address</th>
              <th style="text-align:left;padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      ` : `<p><b>No bookings today.</b></p>`}
    </div>
  `;
}

function buildUserDigestHtml(name, bookings) {
  const rows = bookings
    .map((b) => {
      const address = `${b.address || ""}${b.suburb ? `, ${b.suburb}` : ""}`;
      const yourPhone = b.userPhone || b.clientPhone || "—";
      const instructorPhone = b.instructorPhone || "—";

      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.bookingTime || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.serviceName || ""} ${b.duration || ""}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${yourPhone}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.instructorName || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${instructorPhone}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${address || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${b.status || "—"}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Today's Lesson(s)</h2>
      <p>Hi ${name || "there"}, here are your bookings for today.</p>

      ${bookings.length ? `
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f3f3f3">
              <th style="text-align:left;padding:8px;">Time</th>
              <th style="text-align:left;padding:8px;">Service</th>
              <th style="text-align:left;padding:8px;">Your Phone</th>
              <th style="text-align:left;padding:8px;">Instructor</th>
              <th style="text-align:left;padding:8px;">Instructor Phone</th>
              <th style="text-align:left;padding:8px;">Address</th>
              <th style="text-align:left;padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      ` : `<p><b>No bookings today.</b></p>`}
    </div>
  `;
}


function buildAdminDigestHtml(bookings) {
  const map = new Map();
  for (const b of bookings) {
    const key = b.instructorEmail || "unknown";
    if (!map.has(key)) map.set(key, { name: b.instructorName || "Instructor", items: [] });
    map.get(key).items.push(b);
  }

  const blocks = Array.from(map.entries())
    .map(([email, group]) => {
      const rows = group.items
        .map((b) => {
          const student = b.userName || b.clientName || "—";
          const address = `${b.address || ""}${b.suburb ? `, ${b.suburb}` : ""}`;
          return `<li>${b.bookingTime || "—"} — ${b.serviceName || ""} ${b.duration || ""} — ${student} — ${address} — ${b.status || "—"}</li>`;
        })
        .join("");

      return `
        <h3 style="margin-top:16px;">${group.name} (${email})</h3>
        <ul style="margin:6px 0 0 18px;">${rows || "<li>No bookings</li>"}</ul>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Today's Bookings (All Instructors)</h2>
      ${bookings.length ? blocks : "<p><b>No bookings today.</b></p>"}
    </div>
  `;
}

export async function GET(req) {
  try {
    assertCron(req);

    const nowHHMM = hhmmNow();
    const dayKey = todayKey();

    const usersCol = await usersCollection();
    const clientsCol = await clientsCollection();
    const emailCol = await emailsCollection();

    // 1) Users (admin/instructor/user)
    const userReceivers = await usersCol
      .find({
        emailScheduleTime: nowHHMM,
        role: { $in: ["user", "instructor", "admin"] },
      })
      .project({ email: 1, name: 1, role: 1 })
      .toArray();

    // 2) Clients (roleType: client)
    const clientReceivers = await clientsCol
      .find({
        emailScheduleTime: nowHHMM,
        roleType: "client",
      })
      .project({ email: 1, name: 1, roleType: 1 })
      .toArray();

    // Normalize into one list
const userEmailSet = new Set(
  userReceivers.map(u => String(u.email).trim().toLowerCase())
);

// 2️⃣ Normalize users
const receivers = userReceivers.map((u) => ({
  email: String(u.email).trim().toLowerCase(),
  name: u.name,
  role: u.role, // user | instructor | admin
}));

// 3️⃣ Add clients ONLY if not present in users
for (const c of clientReceivers) {
  const email = String(c.email || "").trim().toLowerCase();
  if (!email) continue;

  if (!userEmailSet.has(email)) {
    receivers.push({
      email,
      name: c.name,
      role: "client",
    });
  }
}

    if (!receivers.length) {
      return NextResponse.json({ ok: true, sent: 0, note: "No schedules at this minute" });
    }

    let sent = 0;

    for (const u of receivers) {
     const to = String(u.email || "").trim().toLowerCase();
      if (!to) continue;

      // prevent duplicate same day
      const already = await emailCol.findOne({
        type: "DAILY_DIGEST",
        to,
        digestDay: dayKey,
        digestRole: u.role, // includes "client"
        status: "SENT",
      });
      if (already) continue;

      let subject = `Today's Bookings - ${dayKey}`;
      let html = "";
      let text = "";

      if (u.role === "instructor") {
        const bookings = await getTodaysBookingsByInstructor(to);
        html = buildInstructorDigestHtml(u.name, bookings);
        text = `Hi ${u.name || "Instructor"}, you have ${bookings.length} booking(s) today.`;
      } else if (u.role === "user" || u.role === "client") {
        // ✅ clients use the same logic as user (bookings by userEmail)
        const bookings = await getTodaysBookingsByUser(to);
        html = buildUserDigestHtml(u.name, bookings);
        text = `Hi ${u.name || "there"}, you have ${bookings.length} booking(s) today.`;
      } else if (u.role === "admin") {
        const bookings = await getTodaysBookingsAll();
        html = buildAdminDigestHtml(bookings);
        text = `Admin digest: ${bookings.length} booking(s) today.`;
      }

      let status = "SENT";
      let errorMsg = null;

      try {
        await sendMail({ to, subject, html, text });
      } catch (e) {
        status = "FAILED";
        errorMsg = String(e?.message || e);
      }

      await emailCol.insertOne({
        type: "DAILY_DIGEST",
        to,
        subject,
        html,
        text,
        status,
        error: errorMsg,
        hasAttachment: false,
        sentAt: new Date(),
        createdAt: new Date(),
        digestDay: dayKey,
        digestRole: u.role, 
      });

      if (status === "SENT") sent += 1;
    }

    return NextResponse.json({ ok: true, sent, scheduledAt: nowHHMM, dayKey });
  } catch (e) {
    console.error("DAILY DIGEST CRON ERROR:", e);
    const code = e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: code });
  }
}
