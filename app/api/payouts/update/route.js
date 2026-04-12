import { payoutsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const {
      instructorId,
      instructorEmail,
      instructorName,
      monthKey,
      monthLabel,
      totalRevenue,
      instructorPayout,
      companyCut,
      bookingsCount,
      isPaid,
      paymentNote,
      paymentProofKey,
      paymentProofName,
      paymentProofSize,
    } = body;

    if (!instructorId || !monthKey) {
      return NextResponse.json(
        { error: "instructorId and monthKey are required" },
        { status: 400 }
      );
    }

    const collection = await payoutsCollection();
    const now = new Date();

    const updateData = {
      instructorId: String(instructorId),
      instructorEmail: instructorEmail || "",
      instructorName: instructorName || "",
      monthKey,
      monthLabel: monthLabel || "",
      totalRevenue: Number(totalRevenue || 0),
      instructorPayout: Number(instructorPayout || 0),
      companyCut: Number(companyCut || 0),
      bookingsCount: Number(bookingsCount || 0),
      isPaid: !!isPaid,
      paymentNote: paymentNote || "",
      paymentProofKey: paymentProofKey || "",
      paymentProofName: paymentProofName || "",
      paymentProofSize: Number(paymentProofSize || 0),
      paymentProofUploadedAt: paymentProofKey ? now : null,
      updatedAt: now,
      ...(isPaid ? { paidAt: now } : { paidAt: null }),
    };

    const existing = await collection.findOne({
      instructorId: String(instructorId),
      monthKey,
    });

    if (existing) {
      await collection.updateOne(
        { instructorId: String(instructorId), monthKey },
        { $set: updateData }
      );
    } else {
      await collection.insertOne({
        ...updateData,
        createdAt: now,
      });
    }

    return NextResponse.json({ message: "Payout updated successfully" });
  } catch (error) {
    console.error("PATCH /api/payouts/update error:", error);
    return NextResponse.json(
      { error: "Failed to update payout" },
      { status: 500 }
    );
  }
}