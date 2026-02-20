
import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import { clientsCollection } from "@/app/libs/mongodb/db";


const pickAllowed = (body = {}) => {
  const allowed = [
    "firstName",
    "lastName",
    "organization",
    "mobile",
    "homePhone",
    "workPhone",
    "email",
    "anotherEmail",
    "dob",
    "gender",
    "emergencyContact",
    "emergencyPhone",
    "address",
    "suburb",
    "state",
    "postCode",
    "accountBalance",
    "referredBy",
    "activeClient",
    "marketingSubscriber",
    "receiveReminders",
    "loginAccess",
    "onlineBooking",
    "showPhoto",
    "actionShot",
    "actionRequired",
    "assignedTo",
    "actionBy",
    "alerts",
    "clientNote",
    "comments",
    "licence",
  ];

  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};

const normalize = (doc = {}) => {
  if (typeof doc.firstName === "string") doc.firstName = doc.firstName.trim();
  if (typeof doc.lastName === "string") doc.lastName = doc.lastName.trim();
  if (typeof doc.mobile === "string") doc.mobile = doc.mobile.trim();
  if (typeof doc.email === "string") doc.email = doc.email.trim().toLowerCase();
  if (typeof doc.anotherEmail === "string") doc.anotherEmail = doc.anotherEmail.trim().toLowerCase();
  if (typeof doc.address === "string") doc.address = doc.address.trim();
  if (typeof doc.clientNote === "string") doc.clientNote = doc.clientNote.trim();
  if (doc.accountBalance !== undefined) doc.accountBalance = Number(doc.accountBalance) || 0;
  return doc;
};

export async function GET(req, { params }) {
  try {
    const { clientId } = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid client id" }, { status: 400 });
    }

    const col = await clientsCollection();
    const client = await col.findOne({ _id: new ObjectId(clientId) });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("CLIENT GET ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { clientId } = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid client id" }, { status: 400 });
    }


    const body = await req.json();
    const updates = normalize(pickAllowed(body));

    if (!Object.keys(updates).length) {
      return NextResponse.json({ ok: true, message: "Nothing to update" }, { status: 200 });
    }

    updates.updatedAt = new Date();

    const col = await clientsCollection();

    // optional duplicate check
    const dupOr = [];
    if (updates.email) dupOr.push({ email: updates.email });
    if (updates.mobile) dupOr.push({ mobile: updates.mobile });

    if (dupOr.length) {
      const existing = await col.findOne({
        _id: { $ne: new ObjectId(clientId) },
        $or: dupOr,
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another client already has this email or mobile" },
          { status: 409 }
        );
      }
    }

    const r = await col.updateOne(
      { _id: new ObjectId(clientId) },
      { $set: updates }
    );

    if (r.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const updated = await col.findOne({ _id: new ObjectId(clientId) });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("CLIENT PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { clientId } = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid client id" }, { status: 400 });
    }

    const body = await req.json();
    const updates = normalize(pickAllowed(body));
    updates.updatedAt = new Date();

    const col = await clientsCollection();

    const dupOr = [];
    if (updates.email) dupOr.push({ email: updates.email });
    if (updates.mobile) dupOr.push({ mobile: updates.mobile });

    if (dupOr.length) {
      const existing = await col.findOne({
        _id: { $ne: new ObjectId(clientId) },
        $or: dupOr,
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another client already has this email or mobile" },
          { status: 409 }
        );
      }
    }

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(clientId) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error("CLIENT PUT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: error?.message },
      { status: 500 }
    );
  }
}