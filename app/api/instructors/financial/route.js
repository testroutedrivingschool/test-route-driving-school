import { instructorFinancialsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");

    if (!instructorId) {
      return NextResponse.json(
        { error: "instructorId is required" },
        { status: 400 }
      );
    }

    const collection = await instructorFinancialsCollection();
    const financial = await collection.findOne({ instructorId });

    return NextResponse.json(financial || {});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email, userId, instructorId, accountName, bsbNumber, accountNumber } = body;

    if (!email || !userId || !instructorId) {
      return NextResponse.json(
        { error: "Email, userId and instructorId are required" },
        { status: 400 }
      );
    }

    const collection = await instructorFinancialsCollection();
    const now = new Date();

    const existing = await collection.findOne({ instructorId });

    if (existing) {
      await collection.updateOne(
        { instructorId },
        {
          $set: {
            email,
            userId,
            instructorId,
            accountName: accountName || "",
            bsbNumber: bsbNumber || "",
            accountNumber: accountNumber || "",
            updatedAt: now,
          },
        }
      );
    } else {
      await collection.insertOne({
        email,
        userId,
        instructorId,
        accountName: accountName || "",
        bsbNumber: bsbNumber || "",
        accountNumber: accountNumber || "",
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({ message: "Financial info saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}