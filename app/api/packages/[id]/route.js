import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import {packagesCollection} from "@/app/libs/mongodb/db";

/* =========================
   GET – Fetch single package by ID
========================= */
export async function GET(req, context) {
  const params = await context.params;
  const id = params.id;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({error: "Invalid package ID"}, {status: 400});
    }

    const packageItem = await (
      await packagesCollection()
    ).findOne({_id: ObjectId.isValid(id) ? new ObjectId(id) : id});

    if (!packageItem) {
      return NextResponse.json({error: "Package not found"}, {status: 404});
    }

    return NextResponse.json(packageItem);
  } catch (error) {
    return NextResponse.json({error: "Failed to fetch package"}, {status: 500});
  }
}
