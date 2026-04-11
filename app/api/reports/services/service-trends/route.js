import { NextResponse } from "next/server";
import { bookingsCollection } from "@/app/libs/mongodb/db";

function num(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    return Number(cleaned || 0);
  }
  return Number(value || 0);
}

function str(value) {
  return String(value || "").trim();
}

function getDateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function getBookingPrice(booking) {
  return num(
    booking.overridePrice ??
      booking.price ??
      booking.originalPrice ??
      booking.totalAmount ??
      booking.amount ??
      booking.servicePrice
  );
}

// ContactHours means duration count
function getContactHours(booking) {
  const minutes = num(
    booking.minutes ??
      booking.durationMinutes ??
      booking.lessonMinutes ??
      booking.serviceMinutes
  );
  if (minutes) return minutes / 60;

  const durationText = str(
    booking.duration ??
      booking.lessonDuration ??
      booking.serviceDuration
  ).toLowerCase();

  if (durationText) {
    const match = durationText.match(/(\d+(\.\d+)?)/);
    if (match) {
      const value = Number(match[1]);

      if (durationText.includes("hour")) return value;
      if (durationText.includes("min")) return value / 60;
    }
  }

  return 0;
}

function normalizePaymentType(booking) {
  return str(
    booking.paymentType || booking.paymentMethod || booking.paymentMode
  );
}

function normalizeVehicle(booking) {
  return str(
    booking.vehicle ||
      booking.vehicleType ||
      booking.carType ||
      booking.carName
  );
}

function normalizeLocation(booking) {
  return str(
    booking.location ||
      booking.locationName ||
      booking.branch ||
      booking.branchName
  );
}

function normalizeOrganisation(booking) {
  return str(
    booking.organisation ||
      booking.organization ||
      booking.organisationName ||
      booking.organizationName
  );
}

function isClassBooking(booking) {
  const bookingType = str(booking.bookingType).toLowerCase();
  const serviceType = str(booking.serviceType).toLowerCase();
  const serviceName = str(booking.serviceName).toLowerCase();

  return (
    bookingType.includes("class") ||
    serviceType.includes("class") ||
    serviceName.includes("class")
  );
}

function getStatus(booking) {
  return str(
    booking.status ||
      booking.bookingStatus ||
      booking.attendanceStatus ||
      booking.lessonStatus
  ).toLowerCase();
}

function getPaymentStatus(booking) {
  return str(booking.paymentStatus).toLowerCase();
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const meta = searchParams.get("meta") || "";
    const allBookings = await (await bookingsCollection()).find({}).toArray();

    if (meta === "1") {
      const locations = [
        ...new Set(allBookings.map(normalizeLocation).filter(Boolean)),
      ].sort();

      const organisations = [
        ...new Set(allBookings.map(normalizeOrganisation).filter(Boolean)),
      ].sort();

      const paymentTypes = [
        ...new Set(allBookings.map(normalizePaymentType).filter(Boolean)),
      ].sort();

      const vehicles = [
        ...new Set(allBookings.map(normalizeVehicle).filter(Boolean)),
      ].sort();

      return NextResponse.json({
        locations,
        organisations,
        paymentTypes,
        vehicles,
      });
    }

    const location = searchParams.get("location") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const organisation = searchParams.get("organisation") || "all";
    const paymentType = searchParams.get("paymentType") || "all";
    const vehicle = searchParams.get("vehicle") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    let bookings = [...allBookings];

    if (instructorEmail && staff) {
      bookings = bookings.filter(
        (booking) =>
          str(booking.instructorEmail) === instructorEmail ||
          str(booking.instructorName) === staff
      );
    } else if (instructorEmail) {
      bookings = bookings.filter(
        (booking) => str(booking.instructorEmail) === instructorEmail
      );
    } else if (staff) {
      bookings = bookings.filter(
        (booking) => str(booking.instructorName) === staff
      );
    }

    if (location !== "all") {
      bookings = bookings.filter(
        (booking) => normalizeLocation(booking) === location
      );
    }

    if (organisation !== "all") {
      bookings = bookings.filter(
        (booking) => normalizeOrganisation(booking) === organisation
      );
    }

    if (paymentType !== "all") {
      bookings = bookings.filter(
        (booking) => normalizePaymentType(booking) === paymentType
      );
    }

    if (vehicle !== "all") {
      bookings = bookings.filter(
        (booking) => normalizeVehicle(booking) === vehicle
      );
    }

    if (dateFrom && dateTo) {
      bookings = bookings.filter((booking) => {
        const bookingDateOnly = getDateOnly(
          booking.bookingDate ||
            booking.date ||
            booking.start ||
            booking.startDate
        );

        if (!bookingDateOnly) return false;
        return bookingDateOnly >= dateFrom && bookingDateOnly <= dateTo;
      });
    }

    const groupedMap = new Map();

    for (const booking of bookings) {
      const serviceName = str(
        booking.serviceName || booking.service || booking.title
      );
      if (!serviceName) continue;

      if (!groupedMap.has(serviceName)) {
        groupedMap.set(serviceName, {
          serviceName,
          attendedBookings: 0,
          classCount: 0,
          unpaidBookings: 0,
          cancelledBookings: 0,
          failedToAttend: 0,
          currentRevenue: 0,
          expectedRevenue: 0,
          contactHours: 0,
        });
      }

      const item = groupedMap.get(serviceName);
      const status = getStatus(booking);
      const paymentStatus = getPaymentStatus(booking);
      const price = getBookingPrice(booking);
      const expectedRevenue = price - price * 0.1;
      const contactHours = getContactHours(booking);

      if (isClassBooking(booking)) {
        item.classCount += 1;
      }

      if (status === "cancelled") {
        item.cancelledBookings += 1;
        continue;
      }

      if (status === "unattented" || status === "unattended") {
        item.failedToAttend += 1;
        continue;
      }

      if (paymentStatus === "unpaid") {
        item.unpaidBookings += 1;
        continue;
      }

      if (status === "completed") {
        item.attendedBookings += 1;
        item.currentRevenue += price;
        item.expectedRevenue += expectedRevenue;
        item.contactHours += contactHours;
      }
    }

    let rows = Array.from(groupedMap.values());

    rows = rows
      .filter(
        (row) =>
          row.attendedBookings > 0 ||
          row.classCount > 0 ||
          row.unpaidBookings > 0 ||
          row.cancelledBookings > 0 ||
          row.failedToAttend > 0
      )
      .sort((a, b) => a.serviceName.localeCompare(b.serviceName));

    const summary = rows.reduce(
      (acc, row) => {
        acc.serviceCount += 1;
        acc.totalAttendedBookings += num(row.attendedBookings);
        acc.totalClassCount += num(row.classCount);
        acc.totalUnpaidBookings += num(row.unpaidBookings);
        acc.totalCancelledBookings += num(row.cancelledBookings);
        acc.totalFailedToAttend += num(row.failedToAttend);
        acc.totalCurrentRevenue += num(row.currentRevenue);
        acc.totalExpectedRevenue += num(row.expectedRevenue);
        acc.totalContactHours += num(row.contactHours);
        return acc;
      },
      {
        serviceCount: 0,
        totalAttendedBookings: 0,
        totalClassCount: 0,
        totalUnpaidBookings: 0,
        totalCancelledBookings: 0,
        totalFailedToAttend: 0,
        totalCurrentRevenue: 0,
        totalExpectedRevenue: 0,
        totalContactHours: 0,
      }
    );

    return NextResponse.json({
      rows,
      summary,
    });
  } catch (error) {
    console.error("Service trends API error:", error);

    return NextResponse.json(
      { error: "Failed to generate service trends report" },
      { status: 500 }
    );
  }
}