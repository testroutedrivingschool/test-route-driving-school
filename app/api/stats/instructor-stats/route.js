import { bookingsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const instructorEmail = searchParams.get("instructorEmail");

  if (!instructorEmail) {
    return new NextResponse(JSON.stringify({ error: "instructorEmail is required" }), { status: 400 });
  }

  try {
    const bookingCol = await bookingsCollection(); // Make sure this is properly initialized
    const bookings = await bookingCol.aggregate([
      {
        $match: { instructorEmail, status: { $in: ["completed", "cancelled"] } },
      },
      {
        // Convert bookingDate to Date format if it's a string
        $addFields: {
          bookingDate: { $toDate: "$bookingDate" }, // Convert string to Date
        },
      },
      {
        $group: {
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } } },
          webSales: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, "$price", 0] } },
          manualSales: { $sum: { $cond: [{ $eq: ["$bookingType", "manual"] }, "$price", 0] } },
          totalBookings: { $sum: 1 },
          webBookings: { $sum: { $cond: [{ $eq: ["$bookingType", "website"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        },
      },
      {
        $project: {
          d: "$_id.date",
          webSales: 1,
          manualSales: 1,
          totalBookings: 1,
          webBookings: 1,
          cancelled: 1,
        },
      },
    ]).toArray(); // Ensure the query returns a valid array

    // Format the data into the shape expected by your front-end
    return NextResponse.json({
      revenueData: bookings.map((booking) => ({
        d: booking.d,
        webSales: booking.webSales,
        manualSales: booking.manualSales,
        webBookings: booking.webBookings,
        totalBookings: booking.totalBookings,
      })),
      activityData: bookings.map((booking) => ({
        d: booking.d,
        totalBookings: booking.totalBookings,
        webBookings: booking.webBookings,
        cancelled: booking.cancelled,
      })),
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructor stats:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch instructor stats" }), { status: 500 });
  }
}