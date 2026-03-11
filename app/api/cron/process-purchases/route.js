export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import {
  jobsCollection,
  purchasesCollection,
} from "@/app/libs/mongodb/db";
import { runPurchaseInvoiceAndEmails } from "@/app/api/purchases/route";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 5;

export async function POST(req) {
  try {
    const secret = req.headers.get("x-cron-secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobsCol = await jobsCollection();
    const purchasesCol = await purchasesCollection();

    const jobs = await jobsCol
      .find({
        type: "PURCHASE_CONFIRMATION",
        $or: [
          { status: "pending" },
          { status: "failed", attempts: { $lt: MAX_ATTEMPTS } },
        ],
      })
      .sort({ createdAt: 1 })
      .limit(BATCH_SIZE)
      .toArray();

    let processed = 0;
    let failed = 0;
    let skipped = 0;

    for (const job of jobs) {
      try {
        const lockResult = await jobsCol.updateOne(
          {
            _id: job._id,
            $or: [
              { status: "pending" },
              { status: "failed", attempts: { $lt: MAX_ATTEMPTS } },
            ],
          },
          {
            $set: {
              status: "processing",
              startedAt: new Date(),
              error: null,
            },
          }
        );

        if (lockResult.modifiedCount === 0) {
          skipped++;
          continue;
        }

        if (!job.purchaseId || !ObjectId.isValid(job.purchaseId)) {
          await jobsCol.updateOne(
            { _id: job._id },
            {
              $set: {
                status: "failed",
                error: "Invalid purchaseId",
                finishedAt: new Date(),
              },
              $inc: { attempts: 1 },
            }
          );
          failed++;
          continue;
        }

        const purchaseDoc = await purchasesCol.findOne({
          _id: new ObjectId(job.purchaseId),
        });

        if (!purchaseDoc) {
          await jobsCol.updateOne(
            { _id: job._id },
            {
              $set: {
                status: "failed",
                error: "Purchase not found",
                finishedAt: new Date(),
              },
              $inc: { attempts: 1 },
            }
          );
          failed++;
          continue;
        }

        await runPurchaseInvoiceAndEmails({
          purchaseDoc,
          purchaseId: purchaseDoc._id,
          invoiceNo: job.invoiceNo,
          reqUrl: job.reqUrl,
        });

        await jobsCol.updateOne(
          { _id: job._id },
          {
            $set: {
              status: "done",
              finishedAt: new Date(),
              error: null,
            },
          }
        );

        processed++;
      } catch (err) {
        await jobsCol.updateOne(
          { _id: job._id },
          {
            $set: {
              status: "failed",
              error: String(err?.message || err),
              finishedAt: new Date(),
            },
            $inc: { attempts: 1 },
          }
        );

        failed++;
      }
    }

    return NextResponse.json({
      ok: true,
      found: jobs.length,
      processed,
      failed,
      skipped,
      maxAttempts: MAX_ATTEMPTS,
    });
  } catch (error) {
    console.error("CRON PROCESS PURCHASES ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to process purchase jobs" },
      { status: 500 }
    );
  }
}