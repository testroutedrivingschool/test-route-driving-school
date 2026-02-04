import { NextResponse } from "next/server";
import { clientsCollection, usersCollection } from "@/app/libs/mongodb/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email?.trim()?.toLowerCase();
    const provider = body?.provider || "Credential";

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const usersCol = await usersCollection();
    const clientsCol = await clientsCollection();

    // get user info (optional, but good)
    const user = await usersCol.findOne({ email });

    const fullName = user?.name || body?.name || "";
    const firstName = body?.firstName || fullName.split(" ")[0] || "";
    const lastName = body?.lastName || fullName.split(" ").slice(1).join(" ") || "";

    // ✅ upsert client (create if not exists, update if exists)
    await clientsCol.updateOne(
      { email },
      {
        $setOnInsert: {
          createdAt: new Date(),
          bookingCount: 0,
          lastBookingLabel: null,
        },
        $set: {
          firstName,
          lastName,
          email,
          linkedUserEmail: email,
          provider,
          mobile: user?.phone || body?.phone || "",
          loginAccess: true,
          onlineBooking: true,
          activeClient: true,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("SYNC CLIENT ERROR:", e);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
