import {locationsCollection} from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET() {
  const collection = await locationsCollection();
  const locations = await collection.find().toArray();
  return NextResponse.json(locations);
}
