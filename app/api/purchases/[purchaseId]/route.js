import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  purchasesCollection,
  instructorsCollection,
  clientsCollection,
} from "@/app/libs/mongodb/db";

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

async function findClientForPurchase(purchase) {
  const clientCol = await clientsCollection();

  if (purchase?.clientId && ObjectId.isValid(String(purchase.clientId))) {
    const client = await clientCol.findOne({
      _id: new ObjectId(String(purchase.clientId)),
    });
    if (client) return client;
  }

  const email = normalizeEmail(
    purchase?.userEmail || purchase?.billing?.email || ""
  );

  if (!email) return null;

  return clientCol.findOne({ email });
}

export async function PATCH(req, { params }) {
  try {
    const { purchaseId } = await params;

    if (!purchaseId || !ObjectId.isValid(purchaseId)) {
      return NextResponse.json(
        { error: "Invalid purchaseId" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, instructorId } = body || {};

    const purchaseCol = await purchasesCollection();
    const purchaseObjectId = new ObjectId(purchaseId);

    const purchase = await purchaseCol.findOne({
      _id: purchaseObjectId,
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    const currentStatus = String(purchase.status || "pending").toLowerCase();

    if (currentStatus === "completed") {
      return NextResponse.json(
        { error: "Completed purchase cannot be changed" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["pending", "confirmed", "cancelled"];

    const updateData = {
      updatedAt: new Date(),
    };

    // ------------------------
    // 1. STATUS UPDATE
    // ------------------------
    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status provided" },
          { status: 400 }
        );
      }

      updateData.status = status;

      if (status === "confirmed") {
        updateData.confirmedAt = purchase.confirmedAt || new Date();
      }

      if (status === "cancelled") {
        updateData.cancelledAt = new Date();

        // clear instructor on cancel
        updateData.instructorId = "";
        updateData.instructorName = "";
        updateData.instructorEmail = "";
      }
    }

    // ------------------------
    // 2. INSTRUCTOR ASSIGNMENT
    // ------------------------
    if (instructorId !== undefined) {
      if (currentStatus === "cancelled") {
        return NextResponse.json(
          { error: "Cancelled purchase cannot be assigned" },
          { status: 400 }
        );
      }

      if (!instructorId) {
        // remove instructor
        updateData.instructorId = "";
        updateData.instructorName = "";
        updateData.instructorEmail = "";

        if (status !== "cancelled") {
          updateData.status = "pending";
        }
      } else {
        if (!ObjectId.isValid(String(instructorId))) {
          return NextResponse.json(
            { error: "Invalid instructorId" },
            { status: 400 }
          );
        }

        const instructor = await (
          await instructorsCollection()
        ).findOne({
          _id: new ObjectId(String(instructorId)),
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

        // optional: auto-confirm
        updateData.status = "confirmed";
        updateData.confirmedAt = purchase.confirmedAt || new Date();
      }
    }

    const nextStatus = updateData.status || currentStatus;
    const amount = Number(purchase.balanceAmount ?? purchase.amount ?? 0);

    // ------------------------
    // 3. BALANCE REVERSAL ONLY ON CANCEL
    // ------------------------
    const shouldRemoveBalance =
      nextStatus === "cancelled" &&
      purchase.balanceApplied &&
      amount > 0;

    if (shouldRemoveBalance) {
      if (Number(purchase.usedBalance || 0) > 0) {
        return NextResponse.json(
          {
            error:
              "Cannot cancel because balance already used in bookings",
          },
          { status: 400 }
        );
      }

      const client = await findClientForPurchase(purchase);

      if (!client) {
        return NextResponse.json(
          { error: "Client not found for balance reversal" },
          { status: 404 }
        );
      }

      const currentBalance = Number(client.accountBalance || 0);

      if (currentBalance < amount) {
        return NextResponse.json(
          {
            error: "Client balance too low to reverse",
          },
          { status: 400 }
        );
      }

      await (await clientsCollection()).updateOne(
        { _id: client._id },
        {
          $inc: { accountBalance: -amount },
          $set: { updatedAt: new Date() },
          $push: {
            balanceLedger: {
              type: "purchase-credit-reversal",
              purchaseId: purchaseObjectId.toString(),
              amount: -amount,
              note: "Package purchase cancelled",
              createdAt: new Date(),
            },
          },
        }
      );

      updateData.balanceApplied = false;
      updateData.balanceRemovedAt = new Date();
      updateData.balanceStatus = "cancelled";
    }

    // ------------------------
    // FINAL UPDATE
    // ------------------------
    await purchaseCol.updateOne(
      { _id: purchaseObjectId },
      { $set: updateData }
    );

    return NextResponse.json({
      ok: true,
      status: updateData.status || currentStatus,
    });
  } catch (e) {
    console.error("PATCH purchase error:", e);

    return NextResponse.json(
      {
        error: "Failed to update purchase",
        details: e?.message,
      },
      { status: 500 }
    );
  }
}