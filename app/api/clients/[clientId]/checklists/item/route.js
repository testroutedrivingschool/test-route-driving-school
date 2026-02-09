export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clientsChecklistsCollection } from "@/app/libs/mongodb/db";

function safeStr(v) {
  return v === null || v === undefined ? "" : String(v);
}

export async function PUT(req, { params }) {
  try {
    const { clientId } = await params; 

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
    }

    const body = await req.json();

    const checklistId = safeStr(body.checklistId).trim();
    const checklistTitle = safeStr(body.checklistTitle).trim();
    const name = safeStr(body.name).trim();

    const comment = safeStr(body.comment);
    const rating =
      body.rating === null || body.rating === undefined ? null : Number(body.rating);

    const lastCompleted = safeStr(body.lastCompleted).trim();
    const tally = Number(body.tally || 0);

    if (!checklistId) {
      return NextResponse.json({ error: "checklistId is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "item name is required" }, { status: 400 });
    }
    if (rating !== null && (Number.isNaN(rating) || rating < 1 || rating > 10)) {
      return NextResponse.json({ error: "rating must be 1-10 or null" }, { status: 400 });
    }

    const col = await clientsChecklistsCollection();
    const clientObjectId = new ObjectId(clientId);
    const now = new Date();

    // ✅ 1) Update existing item (NO UPSERT)
    const updateExisting = await col.updateOne(
      { clientId: clientObjectId, checklistId, "items.name": name },
      {
        $set: {
          checklistTitle,
          "items.$.comment": comment,
          "items.$.rating": rating,
          "items.$.lastCompleted": lastCompleted,
          "items.$.tally": tally,
          "items.$.updatedAt": now,
          updatedAt: now,
        },
      }
    );

    // ✅ 2) If not found, create doc and push item (UPSERT SAFE)
    if (updateExisting.matchedCount === 0) {
      await col.updateOne(
        { clientId: clientObjectId, checklistId },
        {
          $set: { checklistTitle, updatedAt: now },
          $setOnInsert: { clientId: clientObjectId, checklistId, createdAt: now },
          $push: {
            items: { name, comment, rating, lastCompleted, tally, updatedAt: now },
          },
        },
        { upsert: true }
      );
    }

    const doc = await col.findOne({ clientId: clientObjectId, checklistId });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error("PUT /api/clients/:clientId/checklists/item error:", err);
    return NextResponse.json({ error: "Failed to save checklist item" }, { status: 500 });
  }
}
