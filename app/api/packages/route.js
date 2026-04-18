import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { packagesCollection } from "@/app/libs/mongodb/db";
import { redis } from "@/app/libs/redis/redis";

/* =========================
   Helpers
========================= */
const CACHE_TIME = 86400; // 1 day in seconds

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/(\d)\.(\d)/g, "$1.$2")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* =========================
   GET – Fetch all packages / single package
========================= */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const collection = await packagesCollection();

    /* =========================
       SINGLE PACKAGE CACHE
    ========================= */
    if (slug) {
      const cacheKey = `package:${slug}`;

      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }

      const singlePackage = await collection.findOne({ slug });

      if (!singlePackage) {
        return NextResponse.json(
          { error: "Package not found" },
          { status: 404 }
        );
      }

      await redis.set(cacheKey, JSON.stringify(singlePackage), {
        EX: CACHE_TIME,
      });

      return NextResponse.json(singlePackage);
    }

    /* =========================
       ALL PACKAGES CACHE
    ========================= */
    const cacheKey = "packages:all";

    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const packages = await collection
      .aggregate([
        {
          $addFields: {
            categoryOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$category", "driving-lesson"] }, then: 1 },
                  { case: { $eq: ["$category", "test-package"] }, then: 2 },
                  { case: { $eq: ["$category", "all"] }, then: 3 },
                ],
                default: 4,
              },
            },
            disabilityOrder: {
              $cond: [
                { $regexMatch: { input: "$name", regex: /disability/i } },
                1,
                0,
              ],
            },
          },
        },
        {
          $sort: {
            disabilityOrder: 1,
            categoryOrder: 1,
            durationNum: 1,
          },
        },
        {
          $project: {
            categoryOrder: 0,
            disabilityOrder: 0,
          },
        },
      ])
      .toArray();

    await redis.set(cacheKey, JSON.stringify(packages), {
      EX: CACHE_TIME,
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

/* =========================
   POST – Add new package
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      packageThumbline,
      lessons,
      duration,
      durationNum,
      price,
      originalPrice,
      description,
      features,
      popular,
      category,
    } = body;

    if (
      !name ||
      !packageThumbline ||
      !lessons ||
      !duration ||
      !durationNum ||
      !price ||
      !description ||
      !features ||
      !category
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const safePrice = Number(price || 0);
    const safeOriginalPrice = Number(originalPrice || 0);

    // base: $65 = 1 credit
    const rawCreditValue = safePrice / 65;

    // round to nearest 0.5
    const creditValue = Math.round(rawCreditValue * 2) / 2;

    const slug = generateSlug(name);

    const result = await (await packagesCollection()).insertOne({
      name,
      slug,
      packageThumbline,
      lessons: Number(lessons),
      duration,
      durationNum: Number(durationNum),
      price: safePrice,
      originalPrice: safeOriginalPrice,
      savings: safeOriginalPrice - safePrice,
      description,
      features,
      popular: !!popular,
      category,
      creditValue,
      createdAt: new Date(),
    });

    // Clear cache
    await redis.del("packages:all");
    await redis.del(`package:${slug}`);

    return NextResponse.json(
      {
        message: "Package added",
        id: result.insertedId,
        creditValue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/packages error:", error);
    return NextResponse.json(
      { error: "Failed to add package" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT – Update package
========================= */
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing package ID" },
        { status: 400 }
      );
    }

    const collection = await packagesCollection();

    // Find old package first so we can clear old slug cache
    const existingPackage = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // If name changes, update slug too
    if (body.name) {
      updateData.slug = generateSlug(body.name);
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Clear cache
    await redis.del("packages:all");

    if (existingPackage.slug) {
      await redis.del(`package:${existingPackage.slug}`);
    }

    if (updateData.slug) {
      await redis.del(`package:${updateData.slug}`);
    }

    return NextResponse.json({
      message: "Package updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/packages error:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – Delete package
========================= */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing package ID" },
        { status: 400 }
      );
    }

    const collection = await packagesCollection();

    // Find package first so we know which slug cache to clear
    const existingPackage = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Clear cache
    await redis.del("packages:all");

    if (existingPackage.slug) {
      await redis.del(`package:${existingPackage.slug}`);
    }

    return NextResponse.json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/packages error:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}