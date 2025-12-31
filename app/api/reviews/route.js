import {reviewsCollection} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const collection = await reviewsCollection();
    const reviews = await collection.find().toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to fetch reviews"}, {status: 500});
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const collection = await reviewsCollection();
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {message: "Review added", insertedId: result.insertedId},
      {status: 201}
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to add review"}, {status: 500});
  }
}
