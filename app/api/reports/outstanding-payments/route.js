import { NextResponse } from "next/server";
import { bookingsCollection } from "@/app/libs/mongodb/db";

function num(value) {
  return Number(value || 0);
}

function getDateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function daysOld(dateValue) {
  if (!dateValue) return "-";
  const now = new Date();
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${Math.max(days, 0)}d`;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const saleType = searchParams.get("saleType") || "all";
    const organisation = searchParams.get("organisation") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const service = searchParams.get("service") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const includeNegativeBalances =
      searchParams.get("includeNegativeBalances") === "true";

    const mongoFilter = {};

    if (instructorEmail && staff) {
      mongoFilter.$or = [{ instructorEmail }, { instructorName: staff }];
    } else if (instructorEmail) {
      mongoFilter.instructorEmail = instructorEmail;
    } else if (staff) {
      mongoFilter.instructorName = staff;
    }

    if (saleType !== "all") {
      mongoFilter.bookingType = saleType;
    }

    let bookings = await (await bookingsCollection())
      .find(mongoFilter)
      .toArray();

    if (dateFrom && dateTo) {
      bookings = bookings.filter((booking) => {
        const bookingDateOnly = getDateOnly(booking.bookingDate);
        if (!bookingDateOnly) return false;
        return bookingDateOnly >= dateFrom && bookingDateOnly <= dateTo;
      });
    }

    if (service !== "all") {
      bookings = bookings.filter((booking) => booking.serviceName === service);
    }

    let rows = bookings
      .map((booking) => {
        const servicePrice = num(
          booking.overridePrice ?? booking.price ?? booking.originalPrice
        );

        const paidAmount = num(booking.paidAmount);
        const storedOutstanding = booking.outstanding;

        let outstanding =
          storedOutstanding !== undefined && storedOutstanding !== null
            ? num(storedOutstanding)
            : Math.max(servicePrice - paidAmount, 0);

        const paymentStatus = String(booking.paymentStatus || "").toLowerCase();

        if (paymentStatus === "paid") {
          outstanding = 0;
        }

        const accountBalance = 0;

        return {
          _id: String(booking._id),
          client: booking.clientName || booking.userName || "-",
          organisation: booking.organisation || "-",
          type: booking.bookingType || "Booking",
          invoice: booking.invoiceNo || "-",
          invoiceKey: booking.invoiceKey || null,
          contactDetails: booking.clientPhone
            ? `Mob: ${booking.clientPhone}`
            : booking.userPhone
            ? `Mob: ${booking.userPhone}`
            : "-",
          date: booking.createdAt || booking.invoiceCreatedAt || booking.bookingDate || null,
          age: daysOld(booking.createdAt || booking.invoiceCreatedAt || booking.bookingDate),
          item: [booking.serviceName, booking.duration].filter(Boolean).join(" ") || "-",
          staff: booking.instructorName || "-",
          accountBalance,
          outstanding,
          paymentStatus,
        };
      })
      .filter((row) => row.outstanding > 0);

    if (!includeNegativeBalances) {
      rows = rows.filter((row) => row.accountBalance >= 0);
    }

    if (organisation !== "all") {
      rows = rows.filter((row) => row.organisation === organisation);
    }

    rows.sort((a, b) => b.outstanding - a.outstanding);

    const summary = rows.reduce(
      (acc, row) => {
        acc.totalAccountBalance += num(row.accountBalance);
        acc.totalOutstanding += num(row.outstanding);
        return acc;
      },
      {
        totalAccountBalance: 0,
        totalOutstanding: 0,
      }
    );

    return NextResponse.json({
      rows,
      summary,
    });
  } catch (error) {
    console.error("Outstanding payments API error:", error);

    return NextResponse.json(
      { error: "Failed to generate outstanding payments report" },
      { status: 500 }
    );
  }
}