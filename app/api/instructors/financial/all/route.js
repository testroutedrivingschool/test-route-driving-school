import { instructorFinancialsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await instructorFinancialsCollection();
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET all financials error:", err);
    return NextResponse.json(
      { error: "Failed to fetch instructor financials" },
      { status: 500 }
    );
  }
}