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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const months = Number(searchParams.get("months") || 14);
    const month = (searchParams.get("month") || "").trim(); // optional "YYYY-MM"
    const days = Number(searchParams.get("days") || 0);

    const bookingCol = await bookingsCollection();
    const clientCol = await clientsCollection();

    const now = new Date();

    // -----------------------
    // GENERAL STATS (ALL TIME)
    // -----------------------
    const bookingLifetime = await bookingCol
      .aggregate([
        {
          $addFields: {
            __price: {
              $convert: {
                input: "$price",
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            webBookings: {
              $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] },
            },
            paidBookings: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$paymentStatus" }, "paid"] }, 1, 0],
              },
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
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$email", ""] } }, 0] },
                  1,
                  0,
                ],
              },
            },
            clientsWithMobile: {
              $sum: {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$mobile", ""] } }, 0] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray();

    const clientStats = clientStatsAgg?.[0] || {};

    const generalStats = {
      bookedClients: bookingStats?.clientIds?.length || 0,
      totalBookings: bookingStats?.totalBookings || 0,
      webBookings: bookingStats?.webBookings || 0,
      paidBookings: bookingStats?.paidBookings || 0,
      newsletterSubscribers: clientStats?.newsletterSubscribers || 0,
      clientsWithEmail: clientStats?.clientsWithEmail || 0,
      clientsWithMobile: clientStats?.clientsWithMobile || 0,
    };

    // -----------------------
    // MONTH STATS (CURRENT or requested month)
    // -----------------------
    const targetMonth = month || monthKey(now);

    // active bookings (ALL instructors)
    const activeBookings = await bookingCol.countDocuments({
      status: { $in: ["pending", "confirmed"] },
    });

    // month aggregation to get paid/cancelled/unattended + distinct clients
    const monthAgg = await bookingCol
      .aggregate([
        {
          $addFields: {
            __bDate: {
              $ifNull: [
                {
                  $convert: {
                    input: "$bookingDate",
                    to: "date",
                    onError: null,
                    onNull: null,
                  },
                },
                {
                  $convert: {
                    input: "$createdAt",
                    to: "date",
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
          },
        },
        { $match: { __bDate: { $ne: null } } },
        {
          $addFields: {
            __month: { $dateToString: { format: "%Y-%m", date: "$__bDate" } },
          },
        },
        { $match: { __month: targetMonth } },
        {
          $group: {
            _id: "$__month",
            paidBookings: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$paymentStatus" }, "paid"] }, 1, 0],
              },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            unattended: {
              $sum: { $cond: [{ $eq: ["$status", "unattended"] }, 1, 0] },
            },
            clientIds: { $addToSet: { $ifNull: ["$clientId", "$userId"] } },
          },
        },
      ])
      .toArray();

    const mRow = monthAgg?.[0];

    const monthStats = {
      month: targetMonth,
      activeBookings,
      bookedClients: (mRow?.clientIds || []).filter(Boolean).length,
      paidBookings: Number(mRow?.paidBookings || 0),
      cancelledBookings: Number(mRow?.cancelled || 0),
      unattendedBookings: Number(mRow?.unattended || 0),
    };

    // ---------------------------------------
    // DAILY MODE (for Today/7/14/30 days charts)
    // ---------------------------------------
    if (days > 0) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - (days - 1));
      start.setHours(0, 0, 0, 0);

      const dailyRows = await bookingCol
        .aggregate([
          {
            $addFields: {
              __bDate: {
                $ifNull: [
                  {
                    $convert: {
                      input: "$bookingDate",
                      to: "date",
                      onError: null,
                      onNull: null,
                    },
                  },
                  {
                    $convert: {
                      input: "$createdAt",
                      to: "date",
                      onError: null,
                      onNull: null,
                    },
                  },
                ],
              },
              __price: {
                $convert: {
                  input: "$price",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
          { $match: { __bDate: { $ne: null, $gte: start, $lte: end } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$__bDate" } },
              webSales: {
                $sum: {
                  $cond: [{ $eq: ["$bookingType", "website"] }, "$__price", 0],
                },
              },
              manualSales: {
                $sum: {
                  $cond: [{ $eq: ["$bookingType", "manual"] }, "$__price", 0],
                },
              },
              webBookings: {
                $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] },
              },
              totalBookings: { $sum: 1 },
              cancelled: {
                $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray();

      const revenueData = dailyRows.map((x) => ({
        d: x._id,
        webSales: x.webSales || 0,
        manualSales: x.manualSales || 0,
        totalSales: (x.webSales || 0) + (x.manualSales || 0),
        webBookings: x.webBookings || 0,
      }));

      const activityData = dailyRows.map((x) => ({
        d: x._id,
        totalBookings: x.totalBookings || 0,
        webBookings: x.webBookings || 0,
        cancelled: x.cancelled || 0,
      }));

      return NextResponse.json({
        revenueData,
        activityData,
        monthStats,
        generalStats,
      });
    }

    // ---------------------------------------
    // MONTHLY MODE (fallback)
    // ---------------------------------------
    const monthsArr = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArr.push({ key: monthKey(d), name: monthLabel(d) });
    }

    const rows = await bookingCol
      .aggregate([
        {
          $addFields: {
            __bDate: {
              $ifNull: [
                {
                  $convert: {
                    input: "$bookingDate",
                    to: "date",
                    onError: null,
                    onNull: null,
                  },
                },
                {
                  $convert: {
                    input: "$createdAt",
                    to: "date",
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
            __price: {
              $convert: {
                input: "$price",
                to: "double",
                onError: 0,
                onNull: 0,
              },
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
            webSales: {
              $sum: {
                $cond: [{ $eq: ["$bookingType", "website"] }, "$__price", 0],
              },
            },
            manualSales: {
              $sum: {
                $cond: [{ $eq: ["$bookingType", "manual"] }, "$__price", 0],
              },
            },
            webBookings: {
              $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] },
            },
            manualBookings: {
              $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, 1, 0] },
            },
            bookings: { $sum: 1 },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            unattended: {
              $sum: { $cond: [{ $eq: ["$status", "unattended"] }, 1, 0] },
            },
            attended: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray();

    const map = new Map(rows.map((r) => [r._id, r]));

    const websiteActivity = monthsArr.map((m) => {
      const r = map.get(m.key);
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
      const r = map.get(m.key);
      return {
        key: m.key,
        name: m.name,
        bookings: Number(r?.bookings || 0),
        attended: Number(r?.attended || 0),
        cancelled: Number(r?.cancelled || 0),
        unattended: Number(r?.unattended || 0),
      };
    });

    const revenueData = websiteActivity.map((x) => ({
      d: x.key,
      webSales: x.webSales,
      manualSales: x.manualSales,
      totalSales: x.totalSales,
      webBookings: x.webBookings,
      manualBookings: x.manualBookings,
    }));

    const activityData = bookingActivity.map((x) => ({
      d: x.key,
      totalBookings: x.bookings,
      webBookings: x.webBookings,
      cancelled: x.cancelled,
      unattended: x.unattended,
      attended: x.attended,
    }));

    return NextResponse.json({
      websiteActivity,
      bookingActivity,
      monthStats,
      generalStats,
      revenueData,
      activityData,
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}