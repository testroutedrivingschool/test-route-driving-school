
import { organisationsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rx = (val) => new RegExp(escapeRegExp((val || "").trim()), "i");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const organisationName = searchParams.get("organisationName") || "";
    const contactFirstName = searchParams.get("contactFirstName") || "";
    const contactLastName = searchParams.get("contactLastName") || "";
    const email = searchParams.get("email") || "";
    const mobile = searchParams.get("mobile") || "";
    const suburb = searchParams.get("suburb") || "";
    const state = searchParams.get("state") || "";
    const organisationId = searchParams.get("organisationId") || "";
    const activeOnly = searchParams.get("activeOnly") === "true";
    const q = (searchParams.get("q") || "").trim();

    const and = [];

  
    if (activeOnly) {
      and.push({ $or: [{ active: true }, { active: { $exists: false } }] });
    }

    if (organisationId.trim()) {
      if (!ObjectId.isValid(organisationId.trim())) {
        return NextResponse.json([], { status: 200 });
      }
      and.push({ _id: new ObjectId(organisationId.trim()) });
    }

    if (organisationName.trim()) and.push({ organisationName: rx(organisationName) });
    if (contactFirstName.trim()) and.push({ contactFirstName: rx(contactFirstName) });
    if (contactLastName.trim()) and.push({ contactLastName: rx(contactLastName) });
    if (email.trim()) and.push({ email: rx(email) });
    if (mobile.trim()) and.push({ mobile: rx(mobile) });
    if (suburb.trim()) and.push({ suburb: rx(suburb) });
    if (state.trim()) and.push({ state: rx(state) });

    if (q) {
      const qr = rx(q);
      and.push({
        $or: [
          { organisationName: qr },
          { contactFirstName: qr },
          { contactLastName: qr },
          { email: qr },
          { ccEmail: qr },
          { mobile: qr },
          { landLine: qr },
          { address: qr },
          { suburb: qr },
          { state: qr },
          { postcode: qr },
        ],
      });
    }

    const matchFilter = and.length ? { $and: and } : {};

    const orgs = await (await organisationsCollection())
      .find(matchFilter)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(orgs);
  } catch (error) {
    console.error("ORGANISATIONS GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisations", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.organisationName?.trim()) {
      return NextResponse.json(
        { error: "Organisation Name is required" },
        { status: 400 }
      );
    }

    const collection = await organisationsCollection();

    const doc = {
      organisationName: body.organisationName.trim(),

      contactFirstName: body.contactFirstName?.trim() || "",
      contactLastName: body.contactLastName?.trim() || "",

      email: body.email?.trim()?.toLowerCase() || "",
      ccEmail: body.ccEmail?.trim()?.toLowerCase() || "",

      mobile: body.mobile?.trim() || "",
      landLine: body.landLine?.trim() || "",
      fax: body.fax?.trim() || "",

      address: body.address?.trim() || "",
      suburb: body.suburb?.trim() || "",
      state: body.state?.trim() || "",
      postcode: body.postcode?.trim() || "",

      comments: body.comments?.trim() || "",

      productSupplier: body.productSupplier ?? false,
      accountBalance: body.accountBalance ? Number(body.accountBalance) : 0,

      active: body.active ?? true,
      marketingSubscriber: body.marketingSubscriber ?? false,
      bookingReminders: body.bookingReminders ?? false,
      debtorLoginAccess: body.debtorLoginAccess ?? false,

      actionState: body.actionState ?? "No Action Set",
      actionRequired: body.actionRequired ?? "",
      assignedTo: body.assignedTo ?? "Anyone",
      actionBy: body.actionBy ?? "",
      alerts: body.alerts ?? "",
      organisationNotes: body.organisationNotes ?? "",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Duplicate check (name + email + mobile)
    const dupOr = [{ organisationName: doc.organisationName }];
    if (doc.email) dupOr.push({ email: doc.email });
    if (doc.mobile) dupOr.push({ mobile: doc.mobile });

    const existing = await collection.findOne({ $or: dupOr });
    if (existing) {
      return NextResponse.json(
        {
          error: "Organisation already exists with same name/email/mobile",
          organisationId: existing._id,
        },
        { status: 409 }
      );
    }

    const result = await collection.insertOne(doc);

    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (error) {
    console.error("ORGANISATIONS POST ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error?.message },
      { status: 500 }
    );
  }
}