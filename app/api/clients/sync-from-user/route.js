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

    // ✅ get user info (optional)
    const user = await usersCol.findOne({ email });

    const fullName = user?.name || body?.name || "";
    const firstName = body?.firstName || fullName.split(" ")[0] || "";
    const lastName =
      body?.lastName || fullName.split(" ").slice(1).join(" ") || "";

    // ✅ upsert client
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

    // ✅ fetch the client id
    const client = await clientsCol.findOne({ email });
    if (!client?._id) {
      return NextResponse.json({ error: "Client sync failed" }, { status: 500 });
    }

   
    if (user?._id) {
      await usersCol.updateOne(
        { _id: user._id },
        {
          $set: {
            clientId: client._id, 
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({ success: true, clientId: client._id });
  } catch (e) {
    console.error("SYNC CLIENT ERROR:", e);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
