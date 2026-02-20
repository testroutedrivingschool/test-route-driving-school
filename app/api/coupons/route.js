import {couponsCollection} from "@/app/libs/mongodb/db";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const coupons = await (await couponsCollection()).find().toArray();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({error: "Failed to fetch coupons"}, {status: 500});
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.code || !body.discount || !body.expires) {
      return NextResponse.json(
        {error: "Missing required fields"},
        {status: 400},
      );
    }

    const result = await (
      await couponsCollection()
    ).insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(result, {status: 201});
  } catch (error) {
    return NextResponse.json({error: "Failed to add coupon"}, {status: 500});
  }
}

export async function DELETE(req) {
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({error: "Coupon ID is required"}, {status: 400});
    }

    const result = await (
      await couponsCollection()
    ).deleteOne({_id: new ObjectId(id)});

    if (result.deletedCount === 0) {
      return NextResponse.json({error: "Coupon not found"}, {status: 404});
    }

    return NextResponse.json({message: "Coupon deleted successfully"});
  } catch (error) {
    return NextResponse.json({error: "Failed to delete coupon"}, {status: 500});
  }
}
