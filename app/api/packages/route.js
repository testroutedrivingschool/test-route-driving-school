import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import {packagesCollection} from "@/app/libs/mongodb/db";

/* =========================
   GET – Fetch all packages
========================= */
export async function GET(request) {
  try {
    const {searchParams} = new URL(request.url);
    const slug = searchParams.get("slug");

    const collection = await packagesCollection();

    if (slug) {
      const singlePackage = await collection.findOne({slug});

      if (!singlePackage) {
        return NextResponse.json({error: "Package not found"}, {status: 404});
      }

      return NextResponse.json(singlePackage);
    }

    const packages = await collection.find().toArray();
    return NextResponse.json(packages);
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json(
      {error: "Failed to fetch packages"},
      {status: 500},
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

    // Validation
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
        {error: "All fields are required"},
        {status: 400},
      );
    }

    const result = await (
      await packagesCollection()
    ).insertOne({
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/(\d)\.(\d)/g, "$1.$2")
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      packageThumbline,
      lessons,
      duration,
      durationNum,
      price,
      originalPrice,
      savings: originalPrice - price,
      description,
      features,
      popular: !!popular,
      category,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {message: "Package added", id: result.insertedId},
      {status: 201},
    );
  } catch (error) {
    return NextResponse.json({error: "Failed to add package"}, {status: 500});
  }
}

/* =========================
   PUT – Update package
========================= */
export async function PUT(req) {
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({error: "Missing package ID"}, {status: 400});
    }

    const body = await req.json();

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await (
      await packagesCollection()
    ).updateOne({_id: new ObjectId(id)}, {$set: updateData});

    if (result.matchedCount === 0) {
      return NextResponse.json({error: "Package not found"}, {status: 404});
    }

    return NextResponse.json({message: "Package updated successfully"});
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to update package"},
      {status: 500},
    );
  }
}

/* =========================
   DELETE – Delete package
========================= */
export async function DELETE(req) {
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({error: "Missing package ID"}, {status: 400});
    }

    const result = await (
      await packagesCollection()
    ).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({error: "Package not found"}, {status: 404});
    }

    return NextResponse.json({message: "Package deleted successfully"});
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to delete package"},
      {status: 500},
    );
  }
}
