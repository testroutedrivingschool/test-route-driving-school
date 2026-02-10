import { NextResponse } from "next/server";
import { emailsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const url = new URL(req.url);

    // ✅ filter keys
    const actorType = url.searchParams.get("actorType"); // USER | INSTRUCTOR | ADMIN
    const to = url.searchParams.get("to");               // email address
    const clientId = url.searchParams.get("clientId");   // optional
    const bookingId = url.searchParams.get("bookingId"); // optional
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
    const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
    const skip = (page - 1) * limit;

    const query = {};

    // ✅ IMPORTANT: filter by actorType (NOT type)
    if (actorType) query.actorType = actorType;

    // common filters you’ll likely need
    if (to) query.to = to;

    if (clientId && ObjectId.isValid(clientId)) {
      query.clientId = clientId; // (your schema stores clientId as string)
      
    }

    if (bookingId) query.bookingId = bookingId;

    const col = await emailsCollection();

    const [items, total] = await Promise.all([
      col
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load emails" }, { status: 500 });
  }
}
