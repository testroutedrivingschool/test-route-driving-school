export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import {
  clientsCollection,
  notesCollection,
  usersCollection,
} from "@/app/libs/mongodb/db";

function safeStr(v) {
  return v === null || v === undefined ? "" : String(v);
}

export async function GET(_req, {params}) {
  try {
    const {clientId} = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({error: "Invalid clientId"}, {status: 400});
    }

    const clientsCol = await clientsCollection();
    const notesCol = await notesCollection();

    const clientObjectId = new ObjectId(clientId);

    const client = await clientsCol.findOne({_id: clientObjectId});
    if (!client) {
      return NextResponse.json({error: "Client not found"}, {status: 404});
    }

    // ✅ support old notes where clientId was stored as string
    const notes = await notesCol
      .find({
        isDeleted: {$ne: true},
        $or: [{clientId: clientObjectId}, {clientId: clientId}],
      })
      .sort({createdAt: -1})
      .toArray();

    return NextResponse.json(notes);
  } catch (err) {
    console.error("GET /clients/:clientId/notes error:", err);
    return NextResponse.json({error: "Failed to load notes"}, {status: 500});
  }
}
export async function POST(req, {params}) {
  try {
    const {clientId} = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({error: "Invalid clientId"}, {status: 400});
    }

    const body = await req.json();

    const type = safeStr(body.type || "general").toLowerCase();
    const text = safeStr(body.text).trim();

   if (!text) {
  return NextResponse.json(
    { error: "Text is required", got: body.text },
    { status: 400 }
  );
}

if (!["booking", "general","session"].includes(type)) {
  return NextResponse.json(
    { error: "Invalid note type", got: body.type },
    { status: 400 }
  );
}



    const bookingId =
      body.bookingId && ObjectId.isValid(body.bookingId)
        ? new ObjectId(body.bookingId)
        : null;

    const bookingTitle =
      type === "booking" ? safeStr(body.bookingTitle || "").trim() : "";

if (type === "booking" && !bookingTitle) {
  return NextResponse.json(
    { error: "bookingTitle is required for booking notes", got: body.bookingTitle },
    { status: 400 }
  );
}

    // createdBy comes from frontend, but keep it safe + optional fields
    const createdByUserId = safeStr(body.createdBy?.userId || "");

    let createdBy = {
      userId: createdByUserId,
      name: safeStr(body.createdBy?.name || ""),
      role: safeStr(body.createdBy?.role || "instructor"),
      ...(body.createdBy?.photo ? {photo: safeStr(body.createdBy.photo)} : {}),
      ...(body.createdBy?.photoKey
        ? {photoKey: safeStr(body.createdBy.photoKey)}
        : {}),
    };

    // OPTIONAL (recommended): trust DB more than frontend if userId is valid
    if (ObjectId.isValid(createdByUserId)) {
      const usersCol = await usersCollection();
      const u = await usersCol.findOne({_id: new ObjectId(createdByUserId)});

      if (u) {
        createdBy = {
          userId: createdByUserId,
          name: safeStr(u.name || createdBy.name),
          role: safeStr(u.role || createdBy.role),
          ...(u.photo
            ? {photo: safeStr(u.photo)}
            : createdBy.photo
              ? {photo: createdBy.photo}
              : {}),
          ...(u.photoKey
            ? {photoKey: safeStr(u.photoKey)}
            : createdBy.photoKey
              ? {photoKey: createdBy.photoKey}
              : {}),
        };
      }
    }

    const noteDoc = {
      clientId: new ObjectId(clientId),
      type,
      text,
      bookingId,
      bookingTitle,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const notesCol = await notesCollection();
    const result = await notesCol.insertOne(noteDoc);

    const inserted = await notesCol.findOne({_id: result.insertedId});
    return NextResponse.json(inserted, {status: 201});
  } catch (err) {
    console.error("POST /clients/:clientId/notes error:", err);
    return NextResponse.json({error: "Failed to create note"}, {status: 500});
  }
}
