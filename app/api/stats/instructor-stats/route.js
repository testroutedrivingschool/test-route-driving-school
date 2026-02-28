import { NextResponse } from "next/server";
import { bookingsCollection, clientsCollection } from "@/app/libs/mongodb/db";

// helpers
function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "2026-02"
}
function monthLabel(date) {
  return date.toLocaleDateString("en-AU", { month: "short" }); // "Feb"
}

function dayKey(date) {
  // YYYY-MM-DD in local time
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const instructorEmail = (searchParams.get("instructorEmail") || "").trim();
    const months = Number(searchParams.get("months") || 14);
    const month = (searchParams.get("month") || "").trim(); // optional YYYY-MM
    const days = Number(searchParams.get("days") || 0); // optional daily range

    if (!instructorEmail) {
      return NextResponse.json({ error: "instructorEmail is required" }, { status: 400 });
    }

    // ✅ init collections first (fix)
    const bookingCol = await bookingsCollection();
    const clientCol = await clientsCollection();

    const now = new Date();

    /* =========================
       1) MONTHLY AGG (for monthStats + monthly charts)
    ========================== */
    const monthsArr = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArr.push({ key: monthKey(d), name: monthLabel(d) });
    }

    const monthlyRows = await bookingCol
      .aggregate([
        { $match: { instructorEmail } },
        {
          $addFields: {
            __bDate: {
              $ifNull: [
                { $convert: { input: "$bookingDate", to: "date", onError: null, onNull: null } },
                { $convert: { input: "$createdAt", to: "date", onError: null, onNull: null } },
              ],
            },
            __price: {
              $convert: { input: "$price", to: "double", onError: 0, onNull: 0 },
            },
          },
        },
        { $match: { __bDate: { $ne: null } } },
        {
          $addFields: {
            __month: { $dateToString: { format: "%Y-%m", date: "$__bDate" } },
          },
        },
        {
          $group: {
            _id: "$__month",

            // sales
            webSales: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, "$__price", 0] } },
            manualSales: { $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, "$__price", 0] } },

            // counts
            webBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] } },
            manualBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, 1, 0] } },

            // activity
            bookings: { $sum: 1 },
            attended: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            unattended: { $sum: { $cond: [{ $eq: ["$status", "unattended"] }, 1, 0] } },

            paidBookings: {
              $sum: { $cond: [{ $eq: [{ $toLower: "$paymentStatus" }, "paid"] }, 1, 0] },
            },

            clientIds: { $addToSet: { $ifNull: ["$clientId", "$userId"] } },
          },
        },
      ])
      .toArray();

    const monthMap = new Map(monthlyRows.map((r) => [r._id, r]));

    const websiteActivity = monthsArr.map((m) => {
      const r = monthMap.get(m.key);
      const webSales = Number(r?.webSales || 0);
      const manualSales = Number(r?.manualSales || 0);

      return {
        key: m.key,
        name: m.name,
        webSales,
        manualSales,
        totalSales: webSales + manualSales,
        webBookings: Number(r?.webBookings || 0),
        manualBookings: Number(r?.manualBookings || 0),
      };
    });

    const bookingActivity = monthsArr.map((m) => {
      const r = monthMap.get(m.key);
      return {
        key: m.key,
        name: m.name,
        bookings: Number(r?.bookings || 0),
        attended: Number(r?.attended || 0),
        cancelled: Number(r?.cancelled || 0),
        unattended: Number(r?.unattended || 0),
      };
    });

    /* =========================
       2) monthStats (computed ALWAYS)
    ========================== */
    const targetMonth = month || monthKey(now);
    const monthRow = monthMap.get(targetMonth);

    const activeBookings = await bookingCol.countDocuments({
      instructorEmail,
      status: { $in: ["pending", "confirmed"] },
    });

    const monthStats = {
      month: targetMonth,
      activeBookings,
      bookedClients: (monthRow?.clientIds || []).filter(Boolean).length,
      paidBookings: Number(monthRow?.paidBookings || 0),
      cancelledBookings: Number(monthRow?.cancelled || 0),
      unattendedBookings: Number(monthRow?.unattended || 0),
    };

    /* =========================
       3) generalStats (computed ALWAYS)
    ========================== */
    const bookingLifetime = await bookingCol
      .aggregate([
        { $match: { instructorEmail } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            webBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] } },
            paidBookings: {
              $sum: { $cond: [{ $eq: [{ $toLower: "$paymentStatus" }, "paid"] }, 1, 0] },
            },
            clientIds: { $addToSet: { $ifNull: ["$clientId", "$userId"] } },
          },
        },
      ])
      .toArray();

    const bookingStats = bookingLifetime?.[0] || {};

    const clientStatsAgg = await clientCol
      .aggregate([
        { $match: { roleType: "client" } },
        {
          $group: {
            _id: null,
            newsletterSubscribers: {
              $sum: { $cond: [{ $eq: ["$marketingSubscriber", true] }, 1, 0] },
            },
            clientsWithEmail: {
              $sum: {
                $cond: [{ $gt: [{ $strLenCP: { $ifNull: ["$email", ""] } }, 0] }, 1, 0],
              },
            },
            clientsWithMobile: {
              $sum: {
                $cond: [{ $gt: [{ $strLenCP: { $ifNull: ["$mobile", ""] } }, 0] }, 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    const clientStats = clientStatsAgg?.[0] || {};

    const generalStats = {
      bookedClients: bookingStats?.clientIds?.filter(Boolean)?.length || 0,
      totalBookings: bookingStats?.totalBookings || 0,
      webBookings: bookingStats?.webBookings || 0,
      paidBookings: bookingStats?.paidBookings || 0,
      newsletterSubscribers: clientStats?.newsletterSubscribers || 0,
      clientsWithEmail: clientStats?.clientsWithEmail || 0,
      clientsWithMobile: clientStats?.clientsWithMobile || 0,
    };

    /* =========================
       4) If days > 0 => DAILY series for dashboard charts
    ========================== */
    if (days > 0) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - (days - 1));
      start.setHours(0, 0, 0, 0);

      const dailyRows = await bookingCol
        .aggregate([
          { $match: { instructorEmail } },
          {
            $addFields: {
              __bDate: {
                $ifNull: [
                  { $convert: { input: "$bookingDate", to: "date", onError: null, onNull: null } },
                  { $convert: { input: "$createdAt", to: "date", onError: null, onNull: null } },
                ],
              },
              __price: { $convert: { input: "$price", to: "double", onError: 0, onNull: 0 } },
            },
          },
          { $match: { __bDate: { $ne: null, $gte: start, $lte: end } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$__bDate" } },
              webSales: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, "$__price", 0] } },
              manualSales: { $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, "$__price", 0] } },
              webBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] } },
              manualBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, 1, 0] } },
              totalBookings: { $sum: 1 },
              cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            },
          },
          { $project: { _id: 0, d: "$_id", webSales: 1, manualSales: 1, webBookings: 1, manualBookings: 1, totalBookings: 1, cancelled: 1 } },
          { $sort: { d: 1 } },
        ])
        .toArray();

      // ✅ fill missing days so chart is stable
      const dMap = new Map(dailyRows.map((r) => [r.d, r]));
      const daysArr = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const k = dayKey(d);
        const r = dMap.get(k);

        const webSales = Number(r?.webSales || 0);
        const manualSales = Number(r?.manualSales || 0);

        daysArr.push({
          d: k,
          webSales,
          manualSales,
          totalSales: webSales + manualSales,
          webBookings: Number(r?.webBookings || 0),
          manualBookings: Number(r?.manualBookings || 0),
          totalBookings: Number(r?.totalBookings || 0),
          cancelled: Number(r?.cancelled || 0),
        });
      }

      return NextResponse.json({
        // keep monthly arrays too (optional, but useful)
        websiteActivity,
        bookingActivity,

        // dashboard daily series
        revenueData: daysArr.map((x) => ({
          d: x.d,
          webSales: x.webSales,
          manualSales: x.manualSales,
          totalSales: x.totalSales,
          webBookings: x.webBookings,
          manualBookings: x.manualBookings,
        })),
        activityData: daysArr.map((x) => ({
          d: x.d,
          totalBookings: x.totalBookings,
          webBookings: x.webBookings,
          cancelled: x.cancelled,
        })),

        monthStats,
        generalStats,
      });
    }

    /* =========================
       5) Default: MONTHLY series for dashboard (revenueData/activityData)
    ========================== */
    const revenueData = websiteActivity.map((x) => ({
      d: x.key, // X axis key
      webSales: x.webSales,
      manualSales: x.manualSales,
      totalSales: x.totalSales,
      webBookings: x.webBookings,
      manualBookings: x.manualBookings,
    }));

    const activityData = bookingActivity.map((x) => ({
      d: x.key,
      totalBookings: x.bookings,
      webBookings: 0, // bookingActivity doesn't track webBookings separately
      cancelled: x.cancelled,
    }));

    return NextResponse.json({
      websiteActivity,
      bookingActivity,
      revenueData,
      activityData,
      monthStats,
      generalStats,
    });
  } catch (err) {
    console.error("INSTRUCTOR STATS ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch instructor stats" }, { status: 500 });
  }
}