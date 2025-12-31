
import { instructorsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email, accountName, bsbNumber, accountNumber } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const collection = await instructorsCollection();

    const updateData = {
      financial: {
        accountName: accountName || "",
        bsbNumber: bsbNumber || "",
        accountNumber: accountNumber || "",
      },
    };

    const result = await collection.updateOne({ email }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Financial info saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
