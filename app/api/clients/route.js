import { clientsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const mobile = searchParams.get("mobile") || "";
    const email = searchParams.get("email") || "";
    const address = searchParams.get("address") || "";
    const clientNote = searchParams.get("clientNote") || "";
    const licence = searchParams.get("licence") || "";
    const clientId = searchParams.get("clientId") || "";
    const activeOnly = searchParams.get("activeOnly") === "true";
    const q = (searchParams.get("q") || "").trim();

    const and = [];

    // ✅ safer active filter (includes old docs missing activeClient)
    if (activeOnly) {
      and.push({
        $or: [{ activeClient: true }, { activeClient: { $exists: false } }],
      });
    }

    if (clientId.trim()) {
      if (!ObjectId.isValid(clientId.trim())) return NextResponse.json([], { status: 200 });
      and.push({ _id: new ObjectId(clientId.trim()) });
    }

    const rx = (val) => new RegExp(escapeRegExp(val.trim()), "i");

    if (firstName.trim()) and.push({ firstName: rx(firstName) });
    if (lastName.trim()) and.push({ lastName: rx(lastName) });
    if (mobile.trim()) and.push({ mobile: rx(mobile) });
    if (email.trim()) and.push({ email: rx(email) });
    if (address.trim()) and.push({ address: rx(address) });
    if (clientNote.trim()) and.push({ clientNote: rx(clientNote) });
    if (licence.trim()) and.push({ licence: rx(licence) });

    if (q) {
      const qr = rx(q);
      and.push({
        $or: [
          { firstName: qr },
          { lastName: qr },
          { mobile: qr },
          { email: qr },
          { address: qr },
          { clientNote: qr },
          { licence: qr },
        ],
      });
    }

    const matchFilter = and.length ? { $and: and } : {};

    const clients = await (await clientsCollection())
      .aggregate([
        { $match: matchFilter },
        { $sort: { createdAt: -1 } },
        { $limit: 50 },

        // ✅ last booking
        {
          $lookup: {
            from: "bookings",
            let: { clientIdStr: { $toString: "$_id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$clientId", "$$clientIdStr"] } } },
              {
                $addFields: {
                  __bookingDate: {
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
              { $sort: { __bookingDate: -1 } },
              { $limit: 1 },
              { $project: { __bookingDate: 1 } },
            ],
            as: "lastBookingArr",
          },
        },

        // ✅ booking count
        {
          $lookup: {
            from: "bookings",
            let: { clientIdStr: { $toString: "$_id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$clientId", "$$clientIdStr"] } } },
              { $count: "count" },
            ],
            as: "bookingCountArr",
          },
        },

        {
          $addFields: {
            bookingCount: { $ifNull: [{ $arrayElemAt: ["$bookingCountArr.count", 0] }, 0] },
            lastBooking: { $arrayElemAt: ["$lastBookingArr.__bookingDate", 0] },
          },
        },

        {
  $addFields: {
    lastBookingLabel: {
      $cond: [
        { $ifNull: ["$lastBooking", false] },
        {
          $dateToString: {
            date: "$lastBooking",
            format: "%d/%m/%Y %H:%M",
            timezone: "Australia/Sydney",
          },
        },
        null,
      ],
    },
  },
},

        { $project: { lastBookingArr: 0, bookingCountArr: 0 } },
      ])
      .toArray();

    return NextResponse.json(clients);
  } catch (error) {
  console.error("CLIENTS GET ERROR:", error);
  return NextResponse.json(
    { error: "Failed to fetch clients", details: error?.message },
    { status: 500 }
  );
}
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.firstName?.trim() || !body?.lastName?.trim()) {
      return NextResponse.json(
        { error: "First Name and Last Name are required" },
        { status: 400 }
      );
    }

    const collection = await clientsCollection();

    const doc = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      organization: body.organization ?? "None",

      mobile: body.mobile?.trim() || "",
      homePhone: body.homePhone?.trim() || "",
      workPhone: body.workPhone?.trim() || "",

      email: body.email?.trim()?.toLowerCase() || "",
      anotherEmail: body.anotherEmail?.trim()?.toLowerCase() || "",

      dob: body.dob || "",
      gender: body.gender || "male",

      emergencyContact: body.emergencyContact?.trim() || "",
      emergencyPhone: body.emergencyPhone?.trim() || "",

      address: body.address?.trim() || "",
      suburb: body.suburb?.trim() || "",
      state: body.state?.trim() || "",
      postCode: body.postCode?.trim() || "",

      accountBalance: body.accountBalance ? Number(body.accountBalance) : 0,
      referredBy: body.referredBy ?? "Not Specified",

      activeClient: body.activeClient ?? true,
      marketingSubscriber: body.marketingSubscriber ?? false,
      receiveReminders: body.receiveReminders ?? false,
      loginAccess: body.loginAccess ?? false,
      onlineBooking: body.onlineBooking ?? false,
      showPhoto: body.showPhoto ?? false,

      actionShot: body.actionShot ?? "No Action Set",
      actionRequired: body.actionRequired ?? "",
      assignedTo: body.assignedTo ?? "Anyone",
      actionBy: body.actionBy ?? "",
      alerts: body.alerts ?? "",
      clientNote: body.clientNote ?? "",
      comments: body.comments ?? "",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const dupOr = [];
    if (doc.email) dupOr.push({ email: doc.email });
    if (doc.mobile) dupOr.push({ mobile: doc.mobile });

    if (dupOr.length) {
      const existing = await collection.findOne({ $or: dupOr });
      if (existing) {
        return NextResponse.json(
          { error: "Client already exists with same email or mobile", clientId: existing._id },
          { status: 409 }
        );
      }
    }

    const result = await collection.insertOne(doc);

return NextResponse.json(
  { _id: result.insertedId, ...doc },
  { status: 201 }
);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
