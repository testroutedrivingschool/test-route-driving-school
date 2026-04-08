import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { packagesCollection } from "@/app/libs/mongodb/db";
import { redis } from "@/libs/redis/redis";

/* =========================
   GET – Fetch single package by ID
========================= */
export async function GET(req, context) {
  const { id } = context.params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const cacheKey = `package:id:${id}`;

    // ✅ Check Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const packageItem = await (
      await packagesCollection()
    ).findOne({ _id: new ObjectId(id) });

    if (!packageItem) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // ✅ Cache for 1 day
    await redis.set(cacheKey, JSON.stringify(packageItem), {
      EX: 86400,
    });

    return NextResponse.json(packageItem);
  } catch (error) {
    console.error("GET /api/packages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}