export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  jobsCollection,
  bookingsCollection,
} from "@/app/libs/mongodb/db";
import { runInvoiceAndEmails } from "@/app/api/bookings/route";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 5;

function normalizeServiceName(serviceName) {
  return String(serviceName || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isDrivingTestPackage(serviceName) {
  return (
    normalizeServiceName(serviceName) ===
    "driving test package"
  );
}

export async function POST(req) {
  try {
    const secret = req.headers.get("x-cron-secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobsCol = await jobsCollection();
    const bookingsCol = await bookingsCollection();

    const jobs = await jobsCol
      .find({
        type: "BOOKING_CONFIRMATION",
        $or: [
          { status: "pending" },
          {
            status: "failed",
            attempts: { $lt: MAX_ATTEMPTS },
          },
        ],
      })
      .sort({ createdAt: 1 })
      .limit(BATCH_SIZE)
      .toArray();

    let processed = 0;
    let failed = 0;
    let skipped = 0;

    const results = [];

    for (const job of jobs) {
      try {
        const lockResult = await jobsCol.updateOne(
          {
            _id: job._id,
            $or: [
              { status: "pending" },
              {
                status: "failed",
                attempts: { $lt: MAX_ATTEMPTS },
              },
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

          results.push({
            jobId: String(job._id),
            status: "skipped",
            reason: "Job already locked or processed",
          });

          continue;
        }

        if (
          !job.bookingId ||
          !ObjectId.isValid(String(job.bookingId))
        ) {
          throw new Error("Invalid bookingId in job");
        }

        const bookingObjectId = new ObjectId(
          String(job.bookingId)
        );

        const bookingDoc = await bookingsCol.findOne({
          _id: bookingObjectId,
        });

        if (!bookingDoc) {
          throw new Error("Booking not found");
        }

        const testPackage = isDrivingTestPackage(
          bookingDoc.serviceName
        );

        console.log("BOOKING CONFIRMATION JOB DATA:", {
          jobId: String(job._id),
          bookingId: String(bookingDoc._id),
          invoiceNo:
            bookingDoc.invoiceNo || job.invoiceNo,
          serviceName: bookingDoc.serviceName,
          isDrivingTestPackage: testPackage,
          testLocation: bookingDoc.testLocation,
          testTime: bookingDoc.testTime,
          bookingRefNo: bookingDoc.bookingRefNo,
        });

        /*
         * Prevent sending an incomplete Driving Test Package
         * email or PDF.
         */
        if (testPackage) {
          const missingFields = [];

          if (
            !String(
              bookingDoc.testLocation || ""
            ).trim()
          ) {
            missingFields.push("testLocation");
          }

          if (
            !String(
              bookingDoc.testTime || ""
            ).trim()
          ) {
            missingFields.push("testTime");
          }

          if (
            !String(
              bookingDoc.bookingRefNo || ""
            ).trim()
          ) {
            missingFields.push("bookingRefNo");
          }

          if (missingFields.length > 0) {
            throw new Error(
              `Driving Test Package is missing: ${missingFields.join(
                ", "
              )}`
            );
          }
        }

        const resolvedInvoiceNo =
          bookingDoc.invoiceNo || job.invoiceNo;

        if (!resolvedInvoiceNo) {
          throw new Error(
            "Invoice number is missing"
          );
        }

        await runInvoiceAndEmails({
          bookingDoc,
          bookingId: bookingDoc._id,
          invoiceNo: resolvedInvoiceNo,
          reqUrl:
            job.reqUrl ||
            process.env.APP_URL ||
            req.url,
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

        results.push({
          jobId: String(job._id),
          bookingId: String(bookingDoc._id),
          invoiceNo: resolvedInvoiceNo,
          status: "done",
        });
      } catch (error) {
        const errorMessage = String(
          error?.message || error
        );

        console.error(
          "BOOKING CONFIRMATION JOB FAILED:",
          {
            jobId: String(job._id),
            bookingId: job.bookingId || null,
            error: errorMessage,
          }
        );

        await jobsCol.updateOne(
          { _id: job._id },
          {
            $set: {
              status: "failed",
              error: errorMessage,
              finishedAt: new Date(),
            },
            $inc: {
              attempts: 1,
            },
          }
        );

        failed++;

        results.push({
          jobId: String(job._id),
          bookingId: job.bookingId || null,
          status: "failed",
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      found: jobs.length,
      processed,
      failed,
      skipped,
      maxAttempts: MAX_ATTEMPTS,
      results,
    });
  } catch (error) {
    console.error(
      "CRON PROCESS BOOKINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to process booking jobs",
      },
      { status: 500 }
    );
  }
}