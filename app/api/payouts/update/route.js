import { payoutsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

const VALID_COMPANY_SHARE_PERCENTAGES = [5, 10, 15, 20];
const VALID_PERIOD_TYPES = ["daily", "weekly", "fortnight", "monthly"];

function num(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function roundMoney(value) {
  return Math.round((num(value) + Number.EPSILON) * 100) / 100;
}

function normalizeCompanySharePercent(value) {
  const percentage = Number(value);

  return VALID_COMPANY_SHARE_PERCENTAGES.includes(percentage)
    ? percentage
    : 10;
}

function normalizePeriodType(value) {
  return VALID_PERIOD_TYPES.includes(value) ? value : "monthly";
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const {
      instructorId,
      instructorEmail,
      instructorName,

      periodType,
      periodKey,
      periodLabel,

      monthKey,
      monthLabel,

      totalRevenue,
      companySharePercent,
      cashTotal,
      cardTotal,
      bookingsCount,

      isPaid,
      paymentNote,
      paymentProofKey,
      paymentProofName,
      paymentProofSize,
    } = body;

    if (!instructorId || !monthKey) {
      return NextResponse.json(
        {
          error: "instructorId and monthKey are required",
        },
        {
          status: 400,
        },
      );
    }
if (Boolean(isPaid) && !paymentProofKey) {
  return NextResponse.json(
    {
      error: "Payment proof is required when marking payout as paid",
    },
    {
      status: 400,
    },
  );
}

if (Boolean(isPaid) && !String(paymentNote || "").trim()) {
  return NextResponse.json(
    {
      error: "Payment note is required when marking payout as paid",
    },
    {
      status: 400,
    },
  );
}
    const collection = await payoutsCollection();
    const now = new Date();

    const normalizedCompanySharePercent =
      normalizeCompanySharePercent(companySharePercent);

    const instructorSharePercent =
      100 - normalizedCompanySharePercent;

    const normalizedTotalRevenue = roundMoney(totalRevenue);
    const normalizedCashTotal = roundMoney(cashTotal);
    const normalizedCardTotal = roundMoney(cardTotal);

    /*
     * Calculation:
     *
     * Company share = total revenue × percentage
     * Instructor entitlement = total revenue − company share
     * Final payout = entitlement − cash already received
     */

    const calculatedCompanyCut = roundMoney(
      normalizedTotalRevenue *
        (normalizedCompanySharePercent / 100),
    );

    const calculatedInstructorEntitlement = roundMoney(
      normalizedTotalRevenue - calculatedCompanyCut,
    );

    const payoutBalance = roundMoney(
      calculatedInstructorEntitlement - normalizedCashTotal,
    );

    const calculatedInstructorPayout = Math.max(0, payoutBalance);

    const calculatedInstructorOwesCompany = Math.max(
      0,
      roundMoney(-payoutBalance),
    );

    const filter = {
      instructorId: String(instructorId),
      monthKey: String(monthKey),
    };

    const existingPayout = await collection.findOne(filter);

    const hasPaymentProof = Boolean(paymentProofKey);

    const proofWasChanged =
      hasPaymentProof &&
      paymentProofKey !== existingPayout?.paymentProofKey;

    const updateData = {
      instructorId: String(instructorId),
      instructorEmail: instructorEmail || "",
      instructorName: instructorName || "",

      periodType: normalizePeriodType(periodType),
      periodKey: periodKey || monthKey,
      periodLabel: periodLabel || monthLabel || "",

      // Backward-compatible fields
      monthKey: String(monthKey),
      monthLabel: monthLabel || periodLabel || "",

      bookingsCount: Math.max(
        0,
        Math.floor(num(bookingsCount)),
      ),

      totalRevenue: normalizedTotalRevenue,

      companySharePercent: normalizedCompanySharePercent,
      instructorSharePercent,
      companyCut: calculatedCompanyCut,
      instructorEntitlement: calculatedInstructorEntitlement,

      cashTotal: normalizedCashTotal,
      cardTotal: normalizedCardTotal,

      payoutBalance,
      instructorPayout: calculatedInstructorPayout,
      instructorOwesCompany: calculatedInstructorOwesCompany,

      isPaid: Boolean(isPaid),

      paymentNote: paymentNote || "",
      paymentProofKey: paymentProofKey || "",
      paymentProofName: paymentProofName || "",
      paymentProofSize: Math.max(0, num(paymentProofSize)),

      paymentProofUploadedAt: hasPaymentProof
        ? proofWasChanged
          ? now
          : existingPayout?.paymentProofUploadedAt || now
        : null,

      paidAt: isPaid
        ? existingPayout?.paidAt || now
        : null,

      updatedAt: now,
    };

    await collection.updateOne(
      filter,
      {
        $set: updateData,
        $setOnInsert: {
          createdAt: now,
        },
      },
      {
        upsert: true,
      },
    );

    return NextResponse.json({
      message: "Payout updated successfully",
      payout: {
        totalRevenue: normalizedTotalRevenue,
        companySharePercent: normalizedCompanySharePercent,
        instructorSharePercent,
        companyCut: calculatedCompanyCut,
        instructorEntitlement: calculatedInstructorEntitlement,
        cashTotal: normalizedCashTotal,
        cardTotal: normalizedCardTotal,
        payoutBalance,
        instructorPayout: calculatedInstructorPayout,
        instructorOwesCompany: calculatedInstructorOwesCompany,
      },
    });
  } catch (error) {
    console.error("PATCH /api/payouts/update error:", error);

    return NextResponse.json(
      {
        error: "Failed to update payout",
      },
      {
        status: 500,
      },
    );
  }
}