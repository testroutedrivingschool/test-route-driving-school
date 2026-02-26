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
    paymentStatus: booking?.paymentStatus ?? null,
    paymentMethod: booking?.paymentMethod ?? null,

    invoiceNo: booking?.invoiceNo ?? invoice?.invoiceNo ?? null,
    invoiceKey: booking?.invoiceKey ?? invoice?.invoiceKey ?? null,
    invoiceFilename: booking?.invoiceFilename ?? invoice?.filename ?? null,

    total: invoice?.total ?? booking?.price ?? 0,
    createdAt: invoice?.createdAt ?? booking?.createdAt ?? null,

    status: booking?.status ?? null,

    bookingId: invoice?.bookingId ?? booking?._id ?? null,
  };
}

function pickPurchaseRow(purchase) {
  const firstPkg = purchase?.packages?.[0];
  const pkgLabel = purchase?.packages?.length
    ? purchase.packages.map((p) => p.packageName).filter(Boolean).join(", ")
    : null;

  return {
    source: "purchase",

    bookingType: "purchase", // so UI can label it as Purchase
    bookingDate: null,
    bookingTime: null,

    instructorName: purchase?.instructorName ?? null,
    instructorEmail: purchase?.instructorEmail ?? null,

    userName: purchase?.userName ?? purchase?.billing?.name ?? null,
    userPhone: purchase?.billing?.mobile ?? null,
    userEmail: purchase?.userEmail ?? purchase?.billing?.email ?? null,

    // show something meaningful in Services column
    serviceName: "Package Purchase",
    duration: pkgLabel ? `(${pkgLabel})` : firstPkg?.packageName ? `(${firstPkg.packageName})` : null,
    suburb: purchase?.billing?.suburb ?? null,
    address: purchase?.billing?.address ?? null,

    paymentIntentId: purchase?.paymentIntentId ?? null,
    paymentStatus: purchase?.paymentStatus ?? null,
    paymentMethod: purchase?.paymentMethod ?? null,

    invoiceNo: purchase?.invoiceNo ?? null,
    invoiceKey: purchase?.invoiceKey ?? null,
    invoiceFilename: purchase?.invoiceFilename ?? null,

    total: Number(purchase?.amount ?? 0),
    createdAt: purchase?.createdAt ?? null,

    status: purchase?.status ?? null,

    // keep id for linking if needed later
    purchaseId: purchase?._id ?? null,
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = safe(searchParams.get("q")).trim();
    if (!qRaw) return NextResponse.json({ error: "q is required" }, { status: 400 });

    const invCol = await invoicesCollection();
    const bookCol = await bookingsCollection();
    const purCol = await purchasesCollection();

    // =========================
    // 1) Transaction ID search
    // =========================
    if (looksLikeTransactionId(qRaw)) {
      // try bookings first
      const booking = await bookCol.findOne({ paymentIntentId: qRaw });

      if (booking) {
        const invoice =
          (booking?._id ? await invCol.findOne({ bookingId: booking._id }) : null) ||
          (booking?.invoiceNo ? await invCol.findOne({ invoiceNo: Number(booking.invoiceNo) }) : null);

        return NextResponse.json({
          found: true,
          searchType: "transaction",
          transactionId: qRaw,
          ...pickBookingRow(booking, invoice),
        });
      }

      // fallback purchases
      const purchase = await purCol.findOne({ paymentIntentId: qRaw });
      if (!purchase) return NextResponse.json({ found: false, q: qRaw }, { status: 404 });

      return NextResponse.json({
        found: true,
        searchType: "transaction",
        transactionId: qRaw,
        ...pickPurchaseRow(purchase),
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

      // preload invoices for bookings
      const invoiceNos = bookings.map((b) => Number(b.invoiceNo)).filter(Boolean);
      const invoices = invoiceNos.length
        ? await invCol
            .find({ invoiceNo: { $in: invoiceNos } })
            .project({ invoiceNo: 1, invoiceKey: 1, filename: 1, total: 1, paymentStatus: 1, createdAt: 1, bookingId: 1 })
            .toArray()
        : [];

      const invMap = new Map(invoices.map((i) => [Number(i.invoiceNo), i]));

      const bookingRows = bookings.map((b) => {
        const inv = b.invoiceNo ? invMap.get(Number(b.invoiceNo)) : null;
        return pickBookingRow(b, inv);
      });

      const purchaseRows = purchases.map((p) => pickPurchaseRow(p));

      // merge and sort by createdAt desc
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

    // try invoices -> booking
    const inv = await invCol.findOne({ invoiceNo });
    if (inv) {
      const bookingId =
        typeof inv.bookingId === "string" ? new ObjectId(inv.bookingId) : inv.bookingId;

      const booking = bookingId ? await bookCol.findOne({ _id: bookingId }) : null;

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
        invoiceNo: inv.invoiceNo,
        invoiceKey: inv.invoiceKey,
        invoiceFilename: inv.filename,
        total: inv.total ?? 0,
        createdAt: inv.createdAt ?? null,
      });
    }

    // fallback purchase by invoiceNo
    const purchase = await purCol.findOne({ invoiceNo });
    if (purchase) {
      return NextResponse.json({
        found: true,
        searchType: "invoice",
        ...pickPurchaseRow(purchase),
      });
    }

    return NextResponse.json({ found: false, invoiceNo }, { status: 404 });
  } catch (err) {
    console.error("GET /api/sales/search-invoice error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}