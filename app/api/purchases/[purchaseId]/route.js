import { NextResponse } from "next/server";
import {
  purchasesCollection,
  instructorsCollection,
} from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { purchaseId } = await params;

    if (!purchaseId) {
      return NextResponse.json(
        { error: "purchaseId is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, instructorId } = body;

    const purchaseCol = await purchasesCollection();
    const purchase = await purchaseCol.findOne({
      _id: new ObjectId(purchaseId),
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    // status update
    if (status) {
      const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status provided" },
          { status: 400 }
        );
      }

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

      updateData.status = status;
    }

    // instructor assignment
    if (instructorId) {
      const instructorCol = await instructorsCollection();
      const instructor = await instructorCol.findOne({
        _id: new ObjectId(instructorId),
      });

      if (!instructor) {
        return NextResponse.json(
          { error: "Instructor not found" },
          { status: 404 }
        );
      }

      updateData.instructorId = instructor._id.toString();
      updateData.instructorName = instructor.name || "";
      updateData.instructorEmail = instructor.email || "";
    }

    await purchaseCol.updateOne(
      { _id: new ObjectId(purchaseId) },
      { $set: updateData }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update the purchase" },
      { status: 500 }
    );
  }
}