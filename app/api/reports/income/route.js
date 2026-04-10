import { NextResponse } from "next/server";
import { bookingsCollection } from "@/app/libs/mongodb/db";

function startOfDay(dateStr) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(dateStr) {
  const date = new Date(dateStr);
  date.setHours(23, 59, 59, 999);
  return date;
}

function num(value) {
  return Number(value || 0);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const saleType = searchParams.get("saleType") || "all";
    const organisation = searchParams.get("organisation") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const dateType = searchParams.get("dateType") || "paid";

    const filter = {};

    if (instructorEmail) {
      filter.instructorEmail = instructorEmail;
    } else if (staff) {
      filter.instructorName = staff;
    }

    if (saleType !== "all") {
      filter.bookingType = saleType;
    }

    if (organisation !== "all") {
      filter.organisation = organisation;
    }

    if (dateFrom && dateTo) {
      const from = startOfDay(dateFrom);
      const to = endOfDay(dateTo);

      if (dateType === "booking") {
        filter.bookingDate = { $gte: from, $lte: to };
      } else {
        filter.createdAt = { $gte: from, $lte: to };
      }
    }

    const bookings = await (await bookingsCollection())
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const rows = bookings.map((booking) => {
      const price = num(
        booking.overridePrice ?? booking.price ?? booking.originalPrice
      );

      const processingFee = num(booking.processingFee);
      const totalPaidAmount = num(booking.totalPaidAmount);
      const paymentMethod = (booking.paymentMethod || "").toLowerCase();
      const paymentStatus = (booking.paymentStatus || "").toLowerCase();

      const cash = paymentMethod === "cash" ? totalPaidAmount : 0;
      const credit =
        paymentMethod === "card" ? Math.max(totalPaidAmount - processingFee, 0) : 0;

      // Keep online only for website bookings
      const online =
        booking.bookingType === "website"
          ? Math.max(totalPaidAmount - processingFee, 0)
          : 0;

      const voucher = 0;
      const services = price;
      const onlineSurcharge = processingFee;
      const gst = price / 11;
      const tracking = booking.paymentIntentId || "-";

      // one total income field only
     const totalIncome =
  paymentStatus === "paid"
    ? Math.max(totalPaidAmount - processingFee, 0)
    : 0;

// ✅ payout = service price - 10%
const payout = price * 0.9;

      return {
        _id: booking._id.toString(),
        paidDate:
          paymentStatus === "paid"
            ? booking.createdAt || booking.invoiceCreatedAt || null
            : null,
        bookingDate: booking.bookingDate || null,
        type: booking.bookingType || "-",
        status: booking.status || "-",
        invoice: booking.invoiceNo || "-",
        staff: booking.instructorName || "-",
        client: booking.clientName || booking.userName || "-",
        organisation: booking.organisation || "-",
        category: "Services",
        item: [booking.serviceName, booking.duration].filter(Boolean).join(" - ") || "-",
        cash,
        credit,
        online,
        voucher,
        services,
        onlineSurcharge,
        gst,
        totalIncome,
        tracking,
        payout,
        invoiceKey: booking.invoiceKey || null,
      };
    });

    const summary = rows.reduce(
      (acc, row) => {
        acc.totalRecords += 1;
        acc.totalCash += num(row.cash);
        acc.totalCredit += num(row.credit);
        acc.totalOnline += num(row.online);
        acc.totalVoucher += num(row.voucher);
        acc.totalServices += num(row.services);
        acc.totalOnlineSurcharge += num(row.onlineSurcharge);
        acc.totalGst += num(row.gst);
        acc.totalIncome += num(row.totalIncome);
        acc.totalPayout += num(row.payout);
        return acc;
      },
      {
        totalRecords: 0,
        totalCash: 0,
        totalCredit: 0,
        totalOnline: 0,
        totalVoucher: 0,
        totalServices: 0,
        totalOnlineSurcharge: 0,
        totalGst: 0,
        totalIncome: 0,
        totalPayout: 0,
      }
    );

    return NextResponse.json({
      rows,
      summary,
    });
  } catch (error) {
    console.error("Income report API error:", error);

    return NextResponse.json(
      { error: "Failed to generate income report" },
      { status: 500 }
    );
  }
}