export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { notesCollection } from "@/app/libs/mongodb/db";

export async function DELETE(_req, { params }) {
  try {
    const { clientId, noteId } =await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
    }
    if (!ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: "Invalid noteId" }, { status: 400 });
    }

    const notesCol = await notesCollection();

    // soft delete + ensure note belongs to this client
    const result = await notesCol.updateOne(
      { _id: new ObjectId(noteId), clientId: new ObjectId(clientId) },
      { $set: { isDeleted: true, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /clients/:clientId/notes/:noteId error:", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
