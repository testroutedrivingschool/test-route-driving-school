import { usersCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ exists: false, error: "Email is required" }, { status: 400 });
    }

    const collection = await usersCollection();
    const user = await collection.findOne({ email });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json({ exists: false, error: "Server error" }, { status: 500 });
  }
}
