import {
  instructorsCollection,
  instructorFinancialsCollection,
  payoutsCollection,
  bookingsCollection,
} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

const TZ = "Australia/Sydney";

const VALID_PERIOD_TYPES = ["daily", "weekly", "fortnight", "monthly"];

function normalizePeriodType(v) {
  return VALID_PERIOD_TYPES.includes(v) ? v : "monthly";
}

function isEligibleBooking(booking) {
  if (!booking) return false;

  const status = String(booking.status || "").toLowerCase();
  const paymentStatus = String(booking.paymentStatus || "").toLowerCase();

  // ✅ payout needed when money received, even if not completed
  if (status === "cancelled") return false;
  if (paymentStatus === "unpaid") return false;

  return true;
}

function num(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n : 0;
}

function getPaidServiceAmount(booking) {
  const price = num(booking.price);
  const paymentStatus = String(booking.paymentStatus || "").toLowerCase();

  const paidAmount = num(booking.paidAmount);
  const cashAmount = num(booking.cashAmount);
  const cardAmount = num(booking.cardAmount);

  if (paymentStatus === "paid") return price;

  const actualPaid = paidAmount || cashAmount + cardAmount;

  return Math.min(price, actualPaid);
}

function getCashCollectedByInstructor(booking, paidServiceAmount) {
  const method = String(booking.paymentMethod || "").toLowerCase();
  const cashAmount = num(booking.cashAmount);

  if (cashAmount > 0) {
    return Math.min(cashAmount, paidServiceAmount);
  }

  if (method === "cash") {
    return paidServiceAmount;
  }

  return 0;
}

function getCardCollected(booking, paidServiceAmount, cashCollected) {
  const method = String(booking.paymentMethod || "").toLowerCase();
  const cardAmount = num(booking.cardAmount);

  if (cardAmount > 0) return cardAmount;

  if (method === "card") {
    return Math.max(0, paidServiceAmount - cashCollected);
  }

  return 0;
}

function getSydneyDateParts(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  if (!year || !month || !day) return null;

  return {year, month, day};
}

function localDateAsUTC(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function dateKeyUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysUTC(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function startOfWeekMondayUTC(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  return addDaysUTC(d, -diffToMonday);
}

function startOfFortnightUTC(date) {
  const weekStart = startOfWeekMondayUTC(date);
  const anchor = new Date(Date.UTC(1970, 0, 5));
  const days = Math.floor((weekStart.getTime() - anchor.getTime()) / 86400000);
  const fortnightStartOffset = Math.floor(days / 14) * 14;

  return addDaysUTC(anchor, fortnightStartOffset);
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMonthLabel(baseKey) {
  const [year, month] = baseKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.toLocaleString("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getPeriodFromBookingDate(dateValue, periodType) {
  const parts = getSydneyDateParts(dateValue);
  if (!parts) return null;

  const localDate = localDateAsUTC(parts);

  if (periodType === "daily") {
    const baseKey = dateKeyUTC(localDate);

    return {
      periodType,
      baseKey,
      periodKey: `daily:${baseKey}`,
      periodLabel: formatDateLabel(localDate),
    };
  }

  if (periodType === "weekly") {
    const start = startOfWeekMondayUTC(localDate);
    const end = addDaysUTC(start, 6);
    const baseKey = dateKeyUTC(start);

    return {
      periodType,
      baseKey,
      periodKey: `weekly:${baseKey}`,
      periodLabel: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
    };
  }

  if (periodType === "fortnight") {
    const start = startOfFortnightUTC(localDate);
    const end = addDaysUTC(start, 13);
    const baseKey = dateKeyUTC(start);

    return {
      periodType,
      baseKey,
      periodKey: `fortnight:${baseKey}`,
      periodLabel: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
    };
  }

  const baseKey = `${parts.year}-${String(parts.month).padStart(2, "0")}`;

  return {
    periodType: "monthly",
    baseKey,
    periodKey: `monthly:${baseKey}`,
    periodLabel: formatMonthLabel(baseKey),
  };
}

function parseSelectedPeriod(periodType, rawPeriod) {
  let type = periodType;
  let baseKey = rawPeriod;

  if (String(rawPeriod || "").includes(":")) {
    const [prefix, ...rest] = String(rawPeriod).split(":");
    type = normalizePeriodType(prefix);
    baseKey = rest.join(":");
  }

  if (type === "daily") {
    const start = new Date(`${baseKey}T00:00:00.000Z`);

    return {
      periodType: type,
      baseKey,
      periodKey: `daily:${baseKey}`,
      periodLabel: formatDateLabel(start),
    };
  }

  if (type === "weekly") {
    const start = new Date(`${baseKey}T00:00:00.000Z`);
    const end = addDaysUTC(start, 6);

    return {
      periodType: type,
      baseKey,
      periodKey: `weekly:${baseKey}`,
      periodLabel: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
    };
  }

  if (type === "fortnight") {
    const start = new Date(`${baseKey}T00:00:00.000Z`);
    const end = addDaysUTC(start, 13);

    return {
      periodType: type,
      baseKey,
      periodKey: `fortnight:${baseKey}`,
      periodLabel: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
    };
  }

  return {
    periodType: "monthly",
    baseKey,
    periodKey: `monthly:${baseKey}`,
    periodLabel: formatMonthLabel(baseKey),
  };
}

export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);

    const periodType = normalizePeriodType(
      searchParams.get("periodType") || "monthly",
    );

    const rawPeriod = searchParams.get("period") || searchParams.get("month");

    const search = (searchParams.get("search") || "").trim().toLowerCase();

    if (!rawPeriod) {
      return NextResponse.json(
        {error: "period is required"},
        {status: 400},
      );
    }

    const selectedPeriod = parseSelectedPeriod(periodType, rawPeriod);

    const {periodKey, periodLabel, baseKey} = selectedPeriod;

    const [instructors, financials, payouts, allBookings] = await Promise.all([
      (await instructorsCollection())
        .find({status: "approved"})
        .sort({name: 1})
        .toArray(),

      (await instructorFinancialsCollection()).find({}).toArray(),

      // ✅ periodKey stores daily/weekly/fortnight/monthly.
      // ✅ baseKey keeps old monthly records working.
      (await payoutsCollection())
        .find({
          monthKey: {
            $in: [periodKey, baseKey],
          },
        })
        .toArray(),

      (await bookingsCollection()).find({}).toArray(),
    ]);

    const bookings = allBookings.filter((booking) => {
      if (!isEligibleBooking(booking)) return false;

      const bookingPeriod = getPeriodFromBookingDate(
        booking.bookingDate,
        selectedPeriod.periodType,
      );

      return bookingPeriod?.periodKey === periodKey;
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
          const paidServiceAmount = getPaidServiceAmount(booking);

          const cashCollected = getCashCollectedByInstructor(
            booking,
            paidServiceAmount,
          );

          const cardCollected = getCardCollected(
            booking,
            paidServiceAmount,
            cashCollected,
          );

          const fee = num(booking.processingFee);

          totalRevenue += paidServiceAmount;
          cashTotal += cashCollected;
          cardTotal += cardCollected;
          processingFees += fee;

          const instructorEarned = paidServiceAmount * 0.9;

          // ✅ cash already collected by instructor
          const payoutDue = Math.max(0, instructorEarned - cashCollected);

          instructorPayout += payoutDue;

          companyCut += paidServiceAmount * 0.1;
        }

        const payout =
          payoutMap.get(`${instructorId}-${periodKey}`) ||
          payoutMap.get(`${instructorId}-${baseKey}`);

        const savedKey = payout?.monthKey || periodKey;

        return {
          instructorId,
          instructorName: ins.name || "-",
          instructorEmail: ins.email || "-",

          periodType: selectedPeriod.periodType,
          periodKey: savedKey,
          periodLabel,

          // ✅ aliases for old frontend/update API
          monthKey: savedKey,
          monthLabel: periodLabel,

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
      periodType: selectedPeriod.periodType,
      periodKey,
      periodLabel,

      // aliases
      month: periodKey,
      monthLabel: periodLabel,

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