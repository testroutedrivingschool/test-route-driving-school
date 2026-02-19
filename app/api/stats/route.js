export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { bookingsCollection, usersCollection } from "@/app/libs/mongodb/db";

function toBookingDateTime(bookingDate, bookingTime) {
  const d = new Date(bookingDate);
  if (Number.isNaN(d.getTime())) return null;

  const t = String(bookingTime || "").trim().toUpperCase();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!m) return d;

  let hh = Number(m[1]);
  const mm = Number(m[2] || 0);
  const ap = m[3];

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  const combined = new Date(d);
  combined.setHours(hh, mm, 0, 0);
  return combined;
}

function durationToMinutes(duration) {
  if (!duration) return 0;
  const s = String(duration).toLowerCase();

  const hr = s.match(/(\d+)\s*h/);
  const mn = s.match(/(\d+)\s*m/);
  const hourWord = s.match(/(\d+)\s*hour/);
  const minWord = s.match(/(\d+)\s*min/);

  const hours = hr ? parseInt(hr[1], 10) : hourWord ? parseInt(hourWord[1], 10) : 0;
  const mins = mn ? parseInt(mn[1], 10) : minWord ? parseInt(minWord[1], 10) : 0;

  if (!hours && !mins) {
    const n = parseInt(s, 10);
    if (!Number.isNaN(n)) return n;
  }

  return hours * 60 + mins;
}

function normalizeRole(role) {
  const r = String(role || "").toLowerCase().trim();
  if (["user", "student", "client"].includes(r)) return "user";
  if (["instructor", "teacher"].includes(r)) return "instructor";
  if (["admin", "superadmin", "owner"].includes(r)) return "admin";
  return "";
}

function pickStatus(b) {
  return String(b.status || "").toLowerCase();
}

function buildNextLesson(next) {
  if (!next) return null;

  return {
    bookingId: String(next._id),
    type: next.serviceName || "Lesson",
    dateISO: next._dt.toISOString(),
    dateText: next._dt.toLocaleString("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    instructor: next.instructorName || "Instructor",
    userName: next.userName || "",
    status: (next.status || "confirmed").toString(),
    suburb: next.suburb || "",
    address: next.address || "",
    price: Number(next.price || 0),
  };
}

async function computeStatsForFilter(filter) {
  const col = await bookingsCollection();
  const bookings = await col
    .find(filter)
    .sort({ bookingDate: 1, createdAt: -1 })
    .toArray();

  const now = new Date();

  const enriched = bookings
    .map((b) => ({ ...b, _dt: toBookingDateTime(b.bookingDate, b.bookingTime) }))
    .filter((b) => b._dt);

  const totalBookings = bookings.length;

  const completedLessons = bookings.filter((b) =>
    ["completed"].includes(pickStatus(b))
  ).length;

  const upcomingLessons = enriched.filter((b) => b._dt > now).length;

  const totalMinutes = bookings.reduce(
    (sum, b) => sum + durationToMinutes(b.duration),
    0
  );
  const hoursDriven = Math.round((totalMinutes / 60) * 10) / 10;

  const nextLessons = enriched
    .filter((b) => b._dt > now)
    .sort((a, z) => a._dt - z._dt)
    .slice(0, 3)
    .map(buildNextLesson);

  return {
    stats: { totalBookings, completedLessons, upcomingLessons, hoursDriven },
    nextLessons,
  };
}

async function computeAdminStats() {
  const col = await bookingsCollection();
  const now = new Date();

  const bookings = await col.find({}).sort({ createdAt: -1 }).toArray();

  const enriched = bookings
    .map((b) => ({ ...b, _dt: toBookingDateTime(b.bookingDate, b.bookingTime) }))
    .filter((b) => b._dt);

  const totalBookings = bookings.length;

  const completedLessons = bookings.filter((b) =>
    ["completed"].includes(pickStatus(b))
  ).length;

  const upcomingLessons = enriched.filter((b) => b._dt > now).length;

  const totalMinutes = bookings.reduce(
    (sum, b) => sum + durationToMinutes(b.duration),
    0
  );
  const hoursDriven = Math.round((totalMinutes / 60) * 10) / 10;

  const totalRevenue = bookings.reduce((sum, b) => {
    const ps = String(b.paymentStatus || "").toLowerCase();
    if (ps === "paid" || ps === "partial") return sum + Number(b.price || 0);
    return sum;
  }, 0);

  const nextLessons = enriched
    .filter((b) => b._dt > now)
    .sort((a, z) => a._dt - z._dt)
    .slice(0, 3)
    .map(buildNextLesson);

  return {
    stats: {
      totalBookings,
      completedLessons,
      upcomingLessons,
      hoursDriven,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    },
    nextLessons,
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email") || "";
    let role = normalizeRole(searchParams.get("role"));

    if (!role && email) {
      try {
        const ucol = await usersCollection();
        const u = await ucol.findOne({ email });
        role = normalizeRole(u?.role);
      } catch {
        // ignore
      }
    }

    if (!role) {
      return NextResponse.json(
        { error: "role required (user | instructor | admin)" },
        { status: 400 }
      );
    }

    if (role !== "admin" && !email) {
      return NextResponse.json(
        { error: "email required for user/instructor" },
        { status: 400 }
      );
    }

    if (role === "user") {
      const data = await computeStatsForFilter({ userEmail: email });
      return NextResponse.json({ role, ...data });
    }

    if (role === "instructor") {
      const data = await computeStatsForFilter({ instructorEmail: email });
      return NextResponse.json({ role, ...data });
    }

    const adminData = await computeAdminStats();
    return NextResponse.json({ role, ...adminData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
