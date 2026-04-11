import { NextResponse } from "next/server";
import {  bookingsCollection, clientsCollection } from "@/app/libs/mongodb/db";

function getDateOnly(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}
function toTime(value) {
  if (!value) return 0;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  return date.getTime();
}

function normalizeGender(value) {
  if (!value || value === "not_set") return "";
  return value;
}

function buildName(client) {
  const parts = [client.firstName, client.lastName ].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return client.email || "-";
}

function buildAddress(client) {
  return [client.address, client.suburb, client.state, client.postCode]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function clientMatchKey(client) {
  return [
    client._id ? String(client._id) : "",
    client.email || "",
    client.mobile || "",
  ];
}

function calculateAgeFromDob(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : "";
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location") || "all";
    const staff = searchParams.get("staff") || "";
    const instructorEmail = searchParams.get("instructorEmail") || "";
    const organisation = searchParams.get("organisation") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    let clients = await (await clientsCollection())
  .find({ roleType: { $ne: "staff" } })
  .toArray();

    // filter clients by createdAt
    if (dateFrom && dateTo) {
      clients = clients.filter((client) => {
        const created = getDateOnly(client.createdAt);
        if (!created) return false;
        return created >= dateFrom && created <= dateTo;
      });
    }

    if (organisation !== "all") {
      clients = clients.filter(
        (client) => (client.organization || "None") === organisation
      );
    }

    if (location !== "all") {
      clients = clients.filter(
        (client) => (client.suburb || "") === location
      );
    }

    let staffBookings = [];
    if (staff || instructorEmail) {
      const bookingFilter = {};

      if (instructorEmail && staff) {
        bookingFilter.$or = [{ instructorEmail }, { instructorName: staff }];
      } else if (instructorEmail) {
        bookingFilter.instructorEmail = instructorEmail;
      } else if (staff) {
        bookingFilter.instructorName = staff;
      }

      staffBookings = await (await bookingsCollection()).find(bookingFilter).toArray();
    } else {
      staffBookings = await (await bookingsCollection()).find({}).toArray();
    }

    const organisations = [
      ...new Set(
        (await (await clientsCollection()).find({}).toArray())
          .map((client) => client.organization || "None")
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

    const locations = [
      ...new Set(
        (await (await clientsCollection()).find({}).toArray())
          .map((client) => client.suburb)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

    const rows = clients
      .map((client) => {
        const keys = clientMatchKey(client);

        const relatedBookings = staffBookings
          .filter((booking) => {
            const bookingClientId = booking.clientId ? String(booking.clientId) : "";
            const bookingEmail = booking.clientEmail || booking.userEmail || "";
            const bookingPhone = booking.clientPhone || booking.userPhone || "";

            return (
              keys.includes(bookingClientId) ||
              (bookingEmail && keys.includes(bookingEmail)) ||
              (bookingPhone && keys.includes(bookingPhone))
            );
          })
          .sort((a, b) => toTime(a.bookingDate) - toTime(b.bookingDate));

        const firstBooking = relatedBookings[0];
        const lastBooking =
          relatedBookings.length > 0 ? relatedBookings[relatedBookings.length - 1] : null;

        const now = Date.now();
        const nextBooking = relatedBookings.find(
          (booking) => toTime(booking.bookingDate) >= now
        );

        const services = [
          ...new Set(
            relatedBookings.map((booking) => booking.serviceName).filter(Boolean)
          ),
        ].join(", ");

        return {
          _id: String(client._id),
          name: buildName(client),
          orgName: client.organization || "",
          gender: normalizeGender(client.gender),
          age: calculateAgeFromDob(client.dob),
          accountBalance: "",
          phone: client.mobile || client.homePhone || client.workPhone || "",
          email: client.email || "",
          address: buildAddress(client),
          referredBy: client.referredBy || "",
          created: client.createdAt || null,
          firstBookingDate: firstBooking?.bookingDate || "-",
          firstBookingInstructor: firstBooking?.instructorName || "",
          lastBookingDate: lastBooking?.bookingDate || "-",
          lastBookingInstructor: lastBooking?.instructorName || "",
          nextBookingDate: nextBooking?.bookingDate || "-",
          nextBookingInstructor: nextBooking?.instructorName || "",
          locationName: client.suburb || "Sydney",
          services: services || "",
        };
      })
      .sort((a, b) => toTime(b.created) - toTime(a.created));

    return NextResponse.json({
      rows,
      filterOptions: {
        locations,
        organisations,
      },
    });
  } catch (error) {
    console.error("Clients API error:", error);

    return NextResponse.json(
      { error: "Failed to generate clients report" },
      { status: 500 }
    );
  }
}