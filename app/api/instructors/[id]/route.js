import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { instructorsCollection } from "@/app/libs/mongodb/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Instructor ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Instructor ID" },
        { status: 400 }
      );
    }

    const collection = await instructorsCollection();

    const instructor = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);

  } catch (err) {
    console.error("GET Instructor by ID error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
