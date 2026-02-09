export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clientsChecklistsCollection } from "@/app/libs/mongodb/db";

export async function GET(_req, { params }) {
  try {
    const { clientId } =await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
    }

    const col = await clientsChecklistsCollection();
    const clientObjectId = new ObjectId(clientId);

    const docs = await col
      .find({ clientId: clientObjectId })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(docs, { status: 200 });
  } catch (err) {
    console.error("GET /api/clients/:clientId/checklists error:", err);
    return NextResponse.json(
      { error: "Failed to load client checklists" },
      { status: 500 }
    );
  }
}
