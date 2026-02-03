import { reviewsCollection, instructorsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const targetType = url.searchParams.get("targetType"); // website | instructor
    const targetEmail = url.searchParams.get("targetEmail"); // instructor email

    const query = {};
    if (targetType) query.targetType = targetType;
    if (targetEmail) query.targetEmail = targetEmail;

    const collection = await reviewsCollection();
    const reviews = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      authorName,
      email,
      rating,
      message,

      // ✅ allow both, but we will normalize
      authorImage,
      authorImageKey,

      targetType = "website",
      targetName = "Test Route Driving School",
      targetEmail = "",
    } = body;

    // ---------- validation ----------
    if (!email || !authorName) {
      return NextResponse.json({ error: "Missing author info" }, { status: 400 });
    }

    const numRating = Number(rating);
    if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (targetType === "instructor" && !targetEmail) {
      return NextResponse.json({ error: "Instructor email is required" }, { status: 400 });
    }

    // ---------- normalize author image ----------
    // Rule: prefer key (MinIO) over url
    const normalizedAuthorImageKey = authorImageKey ? String(authorImageKey).trim() : "";
    const normalizedAuthorImage = normalizedAuthorImageKey
      ? "" // ✅ if key exists, clear url
      : authorImage
        ? String(authorImage).trim()
        : "";

    const reviewDoc = {
      authorName: String(authorName).trim(),
      email: String(email).trim().toLowerCase(),

      rating: numRating,
      message: message.trim().slice(0, 500),

      // ✅ store consistent fields
      authorImage: normalizedAuthorImage,
      authorImageKey: normalizedAuthorImageKey,

      targetType,
      targetName,
      targetEmail: targetType === "instructor" ? String(targetEmail).trim().toLowerCase() : "",

      createdAt: new Date(),
    };

    // 1) Save in reviews collection
    const reviewsCol = await reviewsCollection();
    const result = await reviewsCol.insertOne(reviewDoc);

    // 2) Also push into instructor document (optional)
    if (targetType === "instructor") {
      const insCol = await instructorsCollection();
      await insCol.updateOne(
        { email: reviewDoc.targetEmail },
        {
          $push: {
            reviews: {
              _id: result.insertedId,
              authorName: reviewDoc.authorName,
              email: reviewDoc.email,
              rating: reviewDoc.rating,
              message: reviewDoc.message,
              createdAt: reviewDoc.createdAt,

              // ✅ push consistent image fields too
              authorImage: reviewDoc.authorImage,
              authorImageKey: reviewDoc.authorImageKey,
            },
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Review added", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}
