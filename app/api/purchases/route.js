export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";

import { sendMailWithPdf } from "@/app/libs/mail/mailer";
import { getNextInvoiceNo } from "@/app/libs/invoice/getNextInvoiceNo";
import { generateInvoicePdfBuffer } from "@/app/libs/invoice/invoicePdf";

import {
  purchasesCollection,
  instructorsCollection,
  usersCollection,
  invoicesCollection,
  emailsCollection,
  packagesCollection,
} from "@/app/libs/mongodb/db";
import { uploadPdfToS3 } from "@/app/libs/storage/uploadPdfToS3";

// ---- PDF mapper (purchase -> invoice generator shape)
async function generatePurchaseInvoicePdfBuffer(purchaseDoc, reqUrl) {
  const first = purchaseDoc.packages?.[0];

  const mapped = {
    invoiceNo: purchaseDoc.invoiceNo,
    bookingId: purchaseDoc._id?.toString() || "", 
    userName: purchaseDoc.userName,
    userEmail: purchaseDoc.userEmail,
    userPhone: purchaseDoc.billing?.mobile || "",
    address: purchaseDoc.billing?.address || "",
    suburb: purchaseDoc.billing?.suburb || "",
    instructorName: purchaseDoc.instructorName,
    instructorEmail: purchaseDoc.instructorEmail,

    serviceName: "Package Purchase",
    duration: first?.packageName ? `(${first.packageName})` : "",
    price: purchaseDoc.amount || 0,
    discountAmount: purchaseDoc.discountAmount || 0, 
source: "purchase",
    packages: purchaseDoc.packages || [],
    paymentStatus: purchaseDoc.paymentStatus || "paid",
    paymentMethod: purchaseDoc.paymentMethod || "card",
    createdAt: purchaseDoc.createdAt || new Date(),
  };

  return generateInvoicePdfBuffer(mapped, reqUrl);
}

async function runInvoiceAndEmails({ bookingDoc, bookingId, invoiceNo, reqUrl }) {
  // 1) Generate PDF
  const pdfBuffer = await generateInvoicePdfBuffer(
    { ...bookingDoc, bookingId: String(bookingId) },
    reqUrl
  );

  const filename = `invoice-${invoiceNo}.pdf`;
  const invoiceKey = `invoices/${filename}`;

  // 2) Upload PDF to S3
  await uploadPdfToS3({ key: invoiceKey, buffer: pdfBuffer });

  // Prepare email contents
  const userSubject = `Booking Confirmed - Invoice #${invoiceNo}`;
  const instructorSubject = `New Booking - Invoice #${invoiceNo}`;

  const userText = `Hi ${bookingDoc.userName || "there"}, Your booking is confirmed. Invoice attached.`;
  const instructorText = `Hi ${bookingDoc.instructorName || "Instructor"}, You have a new booking. Invoice attached.`;

  // 3) Send emails
  const sendUser = async () => {
    if (!bookingDoc.userEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: bookingDoc.userEmail,
        subject: userSubject,
        html: userText,
        text: userText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    await emailsCollection().insertOne({
      bookingId,
      invoiceNo,
      actorType: "USER",
      type: "BOOKINGS_CONFIRM",
      to: bookingDoc.userEmail,
      subject: userSubject,
      text: userText,
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
    });
  };

  const sendInstructor = async () => {
    if (!bookingDoc.instructorEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: bookingDoc.instructorEmail,
        subject: instructorSubject,
        html: instructorText,
        text: instructorText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    await emailsCollection().insertOne({
      bookingId,
      invoiceNo,
      actorType: "INSTRUCTOR",
      type: "BOOKINGS_CONFIRM",
      to: bookingDoc.instructorEmail,
      subject: instructorSubject,
      text: instructorText,
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
    });
  };

  await Promise.all([sendUser(), sendInstructor()]);

  // Save invoice document
  await invoicesCollection().insertOne({
    invoiceNo,
    bookingId,
    invoiceKey,
    filename,
    createdAt: new Date(),
  });

  // Update booking with invoiceKey
  await bookingsCollection().updateOne(
    { _id: bookingId },
    {
      $set: {
        invoiceKey,
        invoiceFilename: filename,
        invoiceCreatedAt: new Date(),
      },
    }
  );
}

// --------------------
// GET purchases
// --------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const userEmail = searchParams.get("userEmail");
    const instructorEmail = searchParams.get("instructorEmail");

    let filter = {};

    if (id) {
      filter = { _id: new ObjectId(id) };
    } else if (email) {
      filter = { $or: [{ userEmail: email }, { instructorEmail: email }] };
    } else if (userEmail) {
      filter = { userEmail };
    } else if (instructorEmail) {
      filter = { instructorEmail };
    }

    const purchases = await (await purchasesCollection())
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(purchases);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

// --------------------
// PATCH purchase (status updates)
// --------------------
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body || {};

    const allowed = ["pending", "confirmed", "completed"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const col = await purchasesCollection();
    const purchaseId = new ObjectId(id);

    const purchase = await col.findOne({ _id: purchaseId });
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // simple rule: pending -> confirmed
    if (purchase.status !== "pending" && status === "confirmed") {
      return NextResponse.json(
        { error: `Cannot confirm when status=${purchase.status}` },
        { status: 400 }
      );
    }

    await col.updateOne(
      { _id: purchaseId },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 });
  }
}


// Post APi
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      userEmail,
      instructorId,
      items,                 
      currency = "aud",
      paymentIntentId,
      billing,
      discountAmount,
      amount,
      cardBrand =null,
      cardLast4 =null,
    } = body || {};

    if (!userEmail) return NextResponse.json({ error: "userEmail required" }, { status: 400 });
    if (!instructorId) return NextResponse.json({ error: "instructorId required" }, { status: 400 });
    if (!paymentIntentId) return NextResponse.json({ error: "paymentIntentId required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items required" }, { status: 400 });

    const purchaseCol = await purchasesCollection();

    // prevent duplicates
    const existing = await purchaseCol.findOne({ paymentIntentId });
    if (existing) return NextResponse.json({ ok: true, purchaseId: existing._id });

    // fetch user/instructor docs
    const userCol = await usersCollection();
    const instCol = await instructorsCollection();
    const pkgCol = await packagesCollection();

    const userDoc = await userCol.findOne({ email: userEmail });
    const instructorDoc = await instCol.findOne({ _id: new ObjectId(instructorId) });

    // ✅ build packages from DB
    const pkgIds = items
      .map((i) => i?.packageId)
      .filter(Boolean)
      .map((id) => new ObjectId(String(id)));

    const pkgDocs = await pkgCol.find({ _id: { $in: pkgIds } }).toArray();
    const pkgMap = new Map(pkgDocs.map((p) => [p._id.toString(), p]));

    const packages = items.map((i) => {
      const pkg = pkgMap.get(String(i.packageId));
      const qty = Number(i.quantity || 1);

      const totalLessons = Number(pkg?.lessons || 0);
      const unitPrice = Number(pkg?.price || 0);

      return {
        packageId: String(i.packageId || ""),
        packageName: pkg?.name || "",
        totalLessons,
        remainingLessons: totalLessons * qty,
        unitPrice,
        quantity: qty,
        lineTotal: unitPrice * qty,
        duration: pkg?.duration || "",
        category: pkg?.category || "",
      };
    });

    // invoiceNo now
    const invoiceNo = await getNextInvoiceNo();

    const doc = {
      userId: userId || userDoc?._id?.toString() || "",
      userName: userDoc?.name || billing?.name || "",
      userEmail,

      instructorId,
      instructorName: instructorDoc?.name || "",
      instructorEmail: instructorDoc?.email || "",

      packages,
      amount,
      discountAmount,
      currency,
      paymentIntentId,

      paymentStatus: "paid",
      status: "pending",          
      paymentMethod: "card",
      cardBrand,
      cardLast4,

      invoiceNo,
      invoiceKey: null,
      invoiceFilename: null,
      invoiceCreatedAt: null,

      billing: {
        name: billing?.name || "",
        email: billing?.email || userEmail,
        mobile: billing?.mobile || "",
        address: billing?.address || "",
        suburb: billing?.suburb || "",
        state: billing?.state || "",
        postCode: billing?.postCode || "",
      },

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertRes = await purchaseCol.insertOne(doc);
    const purchaseId = insertRes.insertedId;

    const res = NextResponse.json(
      { ok: true, purchaseId: String(purchaseId), invoiceNo },
      { status: 201 }
    );

    // ✅ background invoice/email
    setTimeout(() => {
      runPurchaseInvoiceAndEmails({
        purchaseDoc: { ...doc, _id: purchaseId }, 
        purchaseId,
        invoiceNo,
        reqUrl: req.url,
      }).catch((e) => console.error("PURCHASE INVOICE/EMAIL ERROR:", e));
    }, 0);

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
