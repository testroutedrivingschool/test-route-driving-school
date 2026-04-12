import { payoutsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await payoutsCollection();
    const payouts = await collection.find({}).toArray();

    return NextResponse.json(payouts);
  } catch (error) {
    console.error("GET /api/payouts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}