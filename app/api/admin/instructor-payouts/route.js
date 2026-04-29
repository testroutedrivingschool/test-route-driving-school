import {
  instructorsCollection,
  instructorFinancialsCollection,
  payoutsCollection,
  bookingsCollection,
} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

function getMonthRange(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return {start, end};
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleString("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function isEligibleBooking(booking) {
  if (!booking) return false;
  if (booking.status === "cancelled") return false;
  if (booking.paymentStatus === "unpaid") return false;
  return true;
}

export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);
    const month = searchParams.get("month");
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    if (!month) {
      return NextResponse.json(
        {error: "month is required. Example: 2026-04"},
        {status: 400},
      );
    }

    const {start, end} = getMonthRange(month);

    const [instructors, financials, payouts, allBookings] = await Promise.all([
      (await instructorsCollection())
        .find({status: "approved"})
        .sort({name: 1})
        .toArray(),
      (await instructorFinancialsCollection()).find({}).toArray(),
      (await payoutsCollection()).find({monthKey: month}).toArray(),
      (await bookingsCollection()).find({}).toArray(),
    ]);
    const bookings = allBookings.filter((booking) => {
      if (!isEligibleBooking(booking)) return false;

      const bookingDate = new Date(booking.bookingDate);
      if (Number.isNaN(bookingDate.getTime())) return false;

      return bookingDate >= start && bookingDate < end;
    });

    const financialMap = new Map(
      financials.map((item) => [String(item.instructorId), item]),
    );

    const payoutMap = new Map(
      payouts.map((item) => [
        `${String(item.instructorId)}-${item.monthKey}`,
        item,
      ]),
    );

    const bookingMap = new Map();

    for (const booking of bookings) {
      if (!isEligibleBooking(booking)) continue;

      const instructorId = String(booking.instructorId || "");
      if (!bookingMap.has(instructorId)) {
        bookingMap.set(instructorId, []);
      }
      bookingMap.get(instructorId).push(booking);
    }

    const rows = instructors
      .filter((ins) => {
        if (!search) return true;
        return (
          ins?.name?.toLowerCase().includes(search) ||
          ins?.email?.toLowerCase().includes(search)
        );
      })
      .map((ins) => {
        const instructorId = String(ins._id);
        const instructorBookings = bookingMap.get(instructorId) || [];

        let totalRevenue = 0;
        let instructorPayout = 0;
        let companyCut = 0;

        let cashTotal = 0;
        let cardTotal = 0;
        let processingFees = 0;

        for (const booking of instructorBookings) {
          const paidAmount = Number(booking.paidAmount || booking.price || 0);
          const cash = Number(booking.cashAmount || 0);
          const card = Number(booking.cardAmount || 0);
          const fee = Number(booking.processingFee || 0);

          totalRevenue += paidAmount;

          cashTotal += cash;
          cardTotal += card;
          processingFees += fee;

          // Instructor gets 90% of actual paid (excluding fees if you want)
          instructorPayout += (paidAmount - fee) * 0.9;

          // Company earns 10% + fee
          companyCut += (paidAmount - fee) * 0.1 + fee;
        }

        const payout = payoutMap.get(`${instructorId}-${month}`);

        return {
          instructorId,
          instructorName: ins.name || "-",
          instructorEmail: ins.email || "-",
          monthKey: month,
          monthLabel: formatMonthLabel(month),
          bookingsCount: instructorBookings.length,
          totalRevenue,
          instructorPayout,
          companyCut,

          cashTotal,
          cardTotal,
          processingFees,
          hasBookings: instructorBookings.length > 0,
          isPaid: payout?.isPaid || false,
          paidAt: payout?.paidAt || null,
          paymentNote: payout?.paymentNote || "",
          paymentProofKey: payout?.paymentProofKey || "",
          paymentProofName: payout?.paymentProofName || "",
          paymentProofSize: payout?.paymentProofSize || 0,
          paymentProofUploadedAt: payout?.paymentProofUploadedAt || null,
          financial: financialMap.get(instructorId) || null,
          bookings: instructorBookings.sort(
            (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate),
          ),
        };
      });

    const stats = rows.reduce(
      (acc, row) => {
        acc.totalRevenue += row.totalRevenue;
        acc.totalPayout += row.instructorPayout;
        acc.totalCompany += row.companyCut;
        acc.totalBookings += row.bookingsCount;

        if (!row.hasBookings) acc.noBookingCount += 1;
        else if (row.isPaid) acc.paidCount += 1;
        else acc.unpaidCount += 1;

        return acc;
      },
      {
        totalRevenue: 0,
        totalPayout: 0,
        totalCompany: 0,
        totalBookings: 0,
        paidCount: 0,
        unpaidCount: 0,
        noBookingCount: 0,
      },
    );

    return NextResponse.json({
      month,
      monthLabel: formatMonthLabel(month),
      rows,
      stats,
    });
  } catch (error) {
    console.error("GET /api/admin/instructor-payouts error:", error);
    return NextResponse.json(
      {error: "Failed to fetch instructor payouts"},
      {status: 500},
    );
  }
}
