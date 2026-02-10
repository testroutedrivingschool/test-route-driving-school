export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { invoicesCollection, bookingsCollection } from "@/app/libs/mongodb/db";

function safe(v) {
  return v === null || v === undefined ? "" : String(v);
}

function looksLikeTransactionId(q) {
  return /^pi_[A-Za-z0-9_]+$/i.test(q);
}

function looksLikeEmail(q) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);
}

function pickBookingFields(booking) {
  return {
    bookingType: booking?.bookingType ?? null,
    bookingDate: booking?.bookingDate ?? null,
    bookingTime: booking?.bookingTime ?? null,

    instructorName: booking?.instructorName ?? null,
    instructorEmail: booking?.instructorEmail ?? null,

    userName: booking?.userName ?? booking?.clientName ?? null,
    userPhone: booking?.userPhone ?? booking?.clientPhone ?? null,
    userEmail: booking?.userEmail ?? booking?.clientEmail ?? null,

    serviceName: booking?.serviceName ?? null,
    duration: booking?.duration ?? null,
    suburb: booking?.suburb ?? null,
    address: booking?.address ?? null,

    paymentIntentId: booking?.paymentIntentId ?? null,
    paymentStatus: booking?.paymentStatus ?? null,
    paymentMethod: booking?.paymentMethod ?? null,

    invoiceNo: booking?.invoiceNo ?? null,
    price: booking?.price ?? 0,

   
    status: booking?.status ?? null,
  };
}


function pickInvoiceFields(invoice) {
  return {
    invoiceNo: invoice?.invoiceNo ?? null,
    invoiceKey: invoice?.invoiceKey ?? null,
    filename: invoice?.filename ?? null,
    bookingId: invoice?.bookingId ?? null,

    paymentStatus: invoice?.paymentStatus ?? null,
    paymentMethod: invoice?.paymentMethod ?? null,
    total: invoice?.total ?? 0,
    createdAt: invoice?.createdAt ?? null,

    userEmail: invoice?.userEmail ?? null,
    instructorEmail: invoice?.instructorEmail ?? null,
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = safe(searchParams.get("q")).trim();

    if (!qRaw) {
      return NextResponse.json({ error: "q is required" }, { status: 400 });
    }

    const invCol = await invoicesCollection();
    const bookCol = await bookingsCollection();

    // =========================
    // 1) Transaction ID search
    // =========================
    if (looksLikeTransactionId(qRaw)) {
      const booking = await bookCol.findOne({ paymentIntentId: qRaw });

      if (!booking) {
        return NextResponse.json({ found: false, q: qRaw }, { status: 404 });
      }

      const invoice =
        (booking?._id ? await invCol.findOne({ bookingId: booking._id }) : null) ||
        (booking?.invoiceNo ? await invCol.findOne({ invoiceNo: Number(booking.invoiceNo) }) : null);

      return NextResponse.json({
        found: true,
        searchType: "transaction",
        transactionId: qRaw,
        ...pickInvoiceFields(invoice),
        ...pickBookingFields(booking),
        // fallback totals if invoice missing
        total: invoice?.total ?? booking?.price ?? 0,
        createdAt: invoice?.createdAt ?? booking?.createdAt ?? null,
        bookingId: invoice?.bookingId ?? booking?._id ?? null,
      });
    }

    // =========================
    // 2) Email search
    // =========================
    if (looksLikeEmail(qRaw)) {
      const email = qRaw.toLowerCase();

      const bookings = await bookCol
        .find({
          $or: [{ userEmail: email }, { clientEmail: email }],
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();

      if (!bookings.length) {
        return NextResponse.json({ found: false, q: email }, { status: 404 });
      }

      // attach invoice info for each booking (optional)
      const invoiceNos = bookings.map((b) => Number(b.invoiceNo)).filter(Boolean);

      const invoices = invoiceNos.length
        ? await invCol
            .find({ invoiceNo: { $in: invoiceNos } })
            .project({ invoiceNo: 1, invoiceKey: 1, filename: 1, total: 1, paymentStatus: 1, createdAt: 1 })
            .toArray()
        : [];

      const invMap = new Map(invoices.map((i) => [Number(i.invoiceNo), i]));

      const rows = bookings.map((b) => {
        const inv = b.invoiceNo ? invMap.get(Number(b.invoiceNo)) : null;
        return {
          ...pickBookingFields(b),
          invoice: inv
            ? {
                invoiceNo: inv.invoiceNo,
                invoiceKey: inv.invoiceKey,
                filename: inv.filename,
                total: inv.total,
                paymentStatus: inv.paymentStatus,
                createdAt: inv.createdAt,
              }
            : null,
        };
      });

      return NextResponse.json({
        found: true,
        searchType: "email",
        email,
        rows,
      });
    }

    // =========================
    // 3) Invoice number search
    // =========================
    const match = qRaw.match(/(\d+)/);
    if (!match) {
      return NextResponse.json(
        { error: "Enter invoice number (e.g. 58), transaction id (pi_...), or email" },
        { status: 400 }
      );
    }

    const invoiceNo = Number(match[1]);
    if (!Number.isFinite(invoiceNo)) {
      return NextResponse.json({ error: "Invalid invoice number" }, { status: 400 });
    }

    const rows = await invCol
      .aggregate([
        { $match: { invoiceNo } },
        {
          $addFields: {
            bookingObjId: {
              $cond: [
                { $eq: [{ $type: "$bookingId" }, "string"] },
                { $toObjectId: "$bookingId" },
                "$bookingId",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "bookings",
            localField: "bookingObjId",
            foreignField: "_id",
            as: "booking",
          },
        },
        { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            found: { $literal: true },
            searchType: { $literal: "invoice" },

            invoiceNo: 1,
            invoiceKey: 1,
            filename: 1,
            bookingId: 1,
            userEmail: 1,
            instructorEmail: 1,
            paymentStatus: 1,
            paymentMethod: 1,
            total: 1,
            createdAt: 1,

            bookingType: "$booking.bookingType",
            bookingDate: "$booking.bookingDate",
            bookingTime: "$booking.bookingTime",
            instructorName: "$booking.instructorName",
            userName: "$booking.userName",
            userPhone: "$booking.userPhone",
            serviceName: "$booking.serviceName",
            duration: "$booking.duration",
            suburb: "$booking.suburb",
            address: "$booking.address",
            paymentIntentId: "$booking.paymentIntentId",
            status:"$booking.status",
          },
        },
      ])
      .toArray();

    if (!rows.length) {
      return NextResponse.json({ found: false, invoiceNo }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET /api/sales/search-invoice error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
