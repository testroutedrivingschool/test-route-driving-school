import { NextResponse } from "next/server";
import { bookingsCollection } from "@/app/libs/mongodb/db";

function num(value) {
  return Number(value || 0);
}

const SERVICE_CATEGORIES = [
  "Automatic Driving Lesson",
  "City Driving Package",
  "Night Driving Lesson",
  "Parking Package",
  "Driving Test Package",
  "Driving Test Assessment",
];

function normalizeCategory(serviceName = "") {
  const name = String(serviceName).trim().toLowerCase();

  if (name.includes("automatic driving lesson")) return "Automatic Driving Lesson";
  if (name.includes("city driving package")) return "City Driving Package";
  if (name.includes("night driving lesson")) return "Night Driving Lesson";
  if (name.includes("parking package")) return "Parking Package";
  if (name.includes("driving test package")) return "Driving Test Package";
  if (name.includes("driving test assessment")) return "Driving Test Assessment";

  return null;
}

function getDateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const services = searchParams.get("services") || "all";
    const products = searchParams.get("products") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const mongoFilter = {};

    if (instructorEmail && staff) {
      mongoFilter.$or = [{ instructorEmail }, { instructorName: staff }];
    } else if (instructorEmail) {
      mongoFilter.instructorEmail = instructorEmail;
    } else if (staff) {
      mongoFilter.instructorName = staff;
    }

    let bookings = await (await bookingsCollection()).find(mongoFilter).toArray();

    if (dateFrom && dateTo) {
      bookings = bookings.filter((booking) => {
        const bookingDateOnly = getDateOnly(booking.bookingDate);
        if (!bookingDateOnly) return false;
        return bookingDateOnly >= dateFrom && bookingDateOnly <= dateTo;
      });
    }

    const groupedMap = new Map();

    for (const categoryName of SERVICE_CATEGORIES) {
      groupedMap.set(categoryName, {
        category: categoryName,
        quantity: 0,
        totalPaid: 0,
        gst: 0,
        cash: 0,
        cardAmount: 0,
        revenue: 0,
      });
    }

    for (const booking of bookings) {
      const normalizedCategory = normalizeCategory(booking.serviceName);

      if (!normalizedCategory) continue;
      if (products !== "all") continue;
      if (services !== "all" && normalizedCategory !== services) continue;

      const servicePrice = num(
        booking.overridePrice ?? booking.price ?? booking.originalPrice
      );

      const gst = servicePrice / 11;
      const cash = num(booking.cashAmount);
      const cardAmount =
        num(booking.cardAmount) ||
        ((booking.paymentMethod || "").toLowerCase() === "card" ? servicePrice : 0);

      const revenue = servicePrice * 0.9;

      const item = groupedMap.get(normalizedCategory);
      item.quantity += 1;
      item.totalPaid += servicePrice;
      item.gst += gst;
      item.cash += cash;
      item.cardAmount += cardAmount;
      item.revenue += revenue;
    }

    let rows = Array.from(groupedMap.values());

    if (services !== "all") {
      rows = rows.filter((row) => row.category === services);
    }

    rows = rows.filter((row) => row.quantity > 0);

    const summary = rows.reduce(
      (acc, row) => {
        acc.totalQuantity += num(row.quantity);
        acc.totalPaid += num(row.totalPaid);
        acc.totalGst += num(row.gst);
        acc.totalCash += num(row.cash);
        acc.totalCardAmount += num(row.cardAmount);
        acc.totalRevenue += num(row.revenue);
        return acc;
      },
      {
        totalQuantity: 0,
        totalPaid: 0,
        totalGst: 0,
        totalCash: 0,
        totalCardAmount: 0,
        totalRevenue: 0,
      }
    );

    return NextResponse.json({
      rows,
      summary,
      categories: SERVICE_CATEGORIES,
    });
  } catch (error) {
    console.error("Income by category API error:", error);

    return NextResponse.json(
      { error: "Failed to generate income by category report" },
      { status: 500 }
    );
  }
}