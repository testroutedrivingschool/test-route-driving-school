export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  invoicesCollection,
  bookingsCollection,
  purchasesCollection,
} from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";

function safe(v) {
  return v === null || v === undefined ? "" : String(v);
}
function looksLikeTransactionId(q) {
  return /^pi_[A-Za-z0-9_]+$/i.test(q);
}
function looksLikeEmail(q) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);
}

function pickBookingRow(booking, invoice) {
  return {
    source: "booking",

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
    paymentStatus: booking?.paymentStatus ?? invoice?.paymentStatus ?? null,
    paymentMethod: booking?.paymentMethod ?? invoice?.paymentMethod ?? null,

    invoiceNo: booking?.invoiceNo ?? invoice?.invoiceNo ?? null,
    invoiceKey: booking?.invoiceKey ?? invoice?.invoiceKey ?? null,
    invoiceFilename: booking?.invoiceFilename ?? invoice?.filename ?? null,

    total: invoice?.total ?? booking?.price ?? 0,
    createdAt: invoice?.createdAt ?? booking?.createdAt ?? null,

    status: booking?.status ?? null,
    bookingId: booking?._id ?? null,
  };
}

function pickPurchaseRow(purchase, invoice) {
  const pkgLabel = purchase?.packages?.length
    ? purchase.packages.map((p) => p.packageName).filter(Boolean).join(", ")
    : null;

  return {
    source: "purchase",

    bookingType: "purchase",
    bookingDate: null,
    bookingTime: null,

    instructorName: purchase?.instructorName ?? null,
    instructorEmail: purchase?.instructorEmail ?? null,

    userName: purchase?.userName ?? purchase?.billing?.name ?? null,
    userPhone: purchase?.billing?.mobile ?? null,
    userEmail: purchase?.userEmail ?? purchase?.billing?.email ?? null,

    serviceName: "Package Purchase",
    duration: pkgLabel ? `(${pkgLabel})` : null,
    suburb: purchase?.billing?.suburb ?? null,
    address: purchase?.billing?.address ?? null,

    paymentIntentId: purchase?.paymentIntentId ?? null,
    paymentStatus: purchase?.paymentStatus ?? invoice?.paymentStatus ?? null,
    paymentMethod: purchase?.paymentMethod ?? invoice?.paymentMethod ?? null,

    invoiceNo: purchase?.invoiceNo ?? invoice?.invoiceNo ?? null,
    invoiceKey: purchase?.invoiceKey ?? invoice?.invoiceKey ?? null,
    invoiceFilename: purchase?.invoiceFilename ?? invoice?.filename ?? null,

    total: Number(purchase?.amount ?? invoice?.total ?? 0),
    createdAt: purchase?.createdAt ?? invoice?.createdAt ?? null,

    status: purchase?.status ?? null,
    purchaseId: purchase?._id ?? null,
  };
}

function toObjectIdMaybe(v) {
  try {
    if (!v) return null;
    if (typeof v === "object" && v instanceof ObjectId) return v;
    const s = String(v);
    if (!ObjectId.isValid(s)) return null;
    return new ObjectId(s);
  } catch {
    return null;
  }
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
    const purCol = await purchasesCollection();

    // =========================
    // 1) Transaction ID (pi_...)
    // =========================
    if (looksLikeTransactionId(qRaw)) {
      const booking = await bookCol.findOne({ paymentIntentId: qRaw });
      if (booking) {
        const inv =
          (booking?._id ? await invCol.findOne({ bookingId: booking._id }) : null) ||
          (booking?.invoiceNo ? await invCol.findOne({ invoiceNo: Number(booking.invoiceNo) }) : null);

        return NextResponse.json({
          found: true,
          searchType: "transaction",
          transactionId: qRaw,
          ...pickBookingRow(booking, inv),
        });
      }

      const purchase = await purCol.findOne({ paymentIntentId: qRaw });
      if (!purchase) {
        return NextResponse.json({ found: false, q: qRaw }, { status: 404 });
      }

      const inv = purchase?.invoiceNo
        ? await invCol.findOne({ invoiceNo: Number(purchase.invoiceNo) })
        : null;

      return NextResponse.json({
        found: true,
        searchType: "transaction",
        transactionId: qRaw,
        ...pickPurchaseRow(purchase, inv),
      });
    }

    // =========================
    // 2) Email search
    // =========================
    if (looksLikeEmail(qRaw)) {
      const email = qRaw.toLowerCase();

      const [bookings, purchases] = await Promise.all([
        bookCol
          .find({ $or: [{ userEmail: email }, { clientEmail: email }] })
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray(),
        purCol
          .find({ userEmail: email })
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray(),
      ]);

      if (!bookings.length && !purchases.length) {
        return NextResponse.json({ found: false, q: email }, { status: 404 });
      }

      // preload invoices by invoiceNo for both
      const invoiceNos = [
        ...bookings.map((b) => Number(b.invoiceNo)).filter(Boolean),
        ...purchases.map((p) => Number(p.invoiceNo)).filter(Boolean),
      ];

      const invoices = invoiceNos.length
        ? await invCol
            .find({ invoiceNo: { $in: invoiceNos } })
            .project({
              invoiceNo: 1,
              invoiceKey: 1,
              filename: 1,
              total: 1,
              paymentStatus: 1,
              paymentMethod: 1,
              createdAt: 1,
              bookingId: 1,
              purchaseId: 1,
              source: 1,
            })
            .toArray()
        : [];

      const invMap = new Map(invoices.map((i) => [Number(i.invoiceNo), i]));

      const bookingRows = bookings.map((b) => {
        const inv = b.invoiceNo ? invMap.get(Number(b.invoiceNo)) : null;
        return pickBookingRow(b, inv);
      });

      const purchaseRows = purchases.map((p) => {
        const inv = p.invoiceNo ? invMap.get(Number(p.invoiceNo)) : null;
        return pickPurchaseRow(p, inv);
      });

      const rows = [...bookingRows, ...purchaseRows].sort((a, b) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
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

    const inv = await invCol.findOne({ invoiceNo });
    if (!inv) {
      // fallback: purchase might exist even if invoice doc missing
      const purchase = await purCol.findOne({ invoiceNo });
      if (purchase) {
        return NextResponse.json({
          found: true,
          searchType: "invoice",
          ...pickPurchaseRow(purchase, null),
        });
      }
      return NextResponse.json({ found: false, invoiceNo }, { status: 404 });
    }

    // ✅ if purchase invoice
    if (inv.source === "purchase" || inv.purchaseId) {
      const purchaseId = toObjectIdMaybe(inv.purchaseId);
      const purchase =
        (purchaseId ? await purCol.findOne({ _id: purchaseId }) : null) ||
        (await purCol.findOne({ invoiceNo }));

      if (purchase) {
        return NextResponse.json({
          found: true,
          searchType: "invoice",
          ...pickPurchaseRow(purchase, inv),
        });
      }

      // invoice exists but purchase missing
      return NextResponse.json({
        found: true,
        searchType: "invoice",
        source: "purchase",
        invoiceNo: inv.invoiceNo,
        invoiceKey: inv.invoiceKey,
        invoiceFilename: inv.filename,
        total: inv.total ?? 0,
        createdAt: inv.createdAt ?? null,
      });
    }

    // ✅ booking invoice (default)
    const bookingId = toObjectIdMaybe(inv.bookingId);
    const booking =
      (bookingId ? await bookCol.findOne({ _id: bookingId }) : null) ||
      (await bookCol.findOne({ invoiceNo }));

    if (booking) {
      return NextResponse.json({
        found: true,
        searchType: "invoice",
        ...pickBookingRow(booking, inv),
      });
    }

    // invoice exists but booking missing
    return NextResponse.json({
      found: true,
      searchType: "invoice",
      source: inv.source || "booking",
      invoiceNo: inv.invoiceNo,
      invoiceKey: inv.invoiceKey,
      invoiceFilename: inv.filename,
      total: inv.total ?? 0,
      createdAt: inv.createdAt ?? null,
    });
  } catch (err) {
    console.error("GET /api/sales/search-invoice error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}