import { NextResponse } from "next/server";
import { purchasesCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";

// PATCH handler for updating purchase status
export async function PATCH(req, { params }) {
  try {
    const { purchaseId } = await params; // Get purchaseId from URL params

    if (!purchaseId) {
      return NextResponse.json({ error: "purchaseId is required" }, { status: 400 });
    }

    // Parse the body to get the status
    const body = await req.json();
    const { status } = body;

    // Valid status values
    const allowedStatuses = ["pending", "confirmed", "completed"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
    }

    // Fetch the purchase document from the database
    const purchaseCol = await purchasesCollection();
    const purchase = await purchaseCol.findOne({ _id: new ObjectId(purchaseId) });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // Check if the status transition is allowed (basic rule: pending -> confirmed, confirmed -> completed)
    if (purchase.status !== "pending" && status === "confirmed") {
      return NextResponse.json(
        { error: `Cannot confirm purchase when status is ${purchase.status}` },
        { status: 400 }
      );
    }

    if (purchase.status === "completed" && status !== "completed") {
      return NextResponse.json(
        { error: "Cannot change status once the purchase is completed" },
        { status: 400 }
      );
    }

    // Update the purchase status in the database
    await purchaseCol.updateOne(
      { _id: new ObjectId(purchaseId) },
      { $set: { status, updatedAt: new Date() } }
    );

    // Return success response
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update the purchase status" }, { status: 500 });
  }
}