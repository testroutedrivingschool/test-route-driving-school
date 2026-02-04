import { NextResponse } from "next/server";
import { emailsCollection } from "@/app/libs/mongodb/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const to = (searchParams.get("to") || "").trim().toLowerCase();
    const type = (searchParams.get("type") || "").trim(); 
    const limit = Number(searchParams.get("limit") || 50);

    if (!to) {
      return NextResponse.json(
        { message: "`to` email is required" },
        { status: 400 }
      );
    }

    const collection = await emailsCollection();

    const query = {
      to,
    };

    if (type) {
      query.type = type; 
    }

    const emails = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(emails);
  } catch (error) {
    console.error("GET EMAILS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
