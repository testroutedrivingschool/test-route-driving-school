export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";

import { sendMailWithPdf } from "@/app/libs/mail/mailer";
import { uploadPdfToS3 } from "@/app/libs/storage/uploadPdfToS3";
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

// ---- PDF mapper (purchase -> invoice generator shape)
async function generatePurchaseInvoicePdfBuffer(purchaseDoc, reqUrl) {
  const first = purchaseDoc.packages?.[0];

  const mapped = {
    invoiceNo: purchaseDoc.invoiceNo,
    bookingId: purchaseDoc._id?.toString() || "", // ✅ use purchase _id
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
source: "purchase",
    packages: purchaseDoc.packages || [],
    paymentStatus: purchaseDoc.paymentStatus || "paid",
    paymentMethod: purchaseDoc.paymentMethod || "card",
    createdAt: purchaseDoc.createdAt || new Date(),
  };

  return generateInvoicePdfBuffer(mapped, reqUrl);
}

async function runPurchaseInvoiceAndEmails({ purchaseDoc, purchaseId, invoiceNo, reqUrl }) {
  // 1) PDF
  const pdfBuffer = await generatePurchaseInvoicePdfBuffer(
    { ...purchaseDoc, _id: purchaseId, invoiceNo },
    reqUrl
  );

  // 2) Upload
  const filename = `invoice-${invoiceNo}.pdf`;
  const invoiceKey = `invoices/${filename}`;
  await uploadPdfToS3({ key: invoiceKey, buffer: pdfBuffer });

  // 3) Email body
  const userSubject = `Payment Confirmed - Invoice #${invoiceNo}`;
  const instructorSubject = `New Package Purchase - Invoice #${invoiceNo}`;

  const packagesText = (purchaseDoc.packages || [])
    .map((p) => `• ${p.packageName} x${p.quantity} ($${p.unitPrice})`)
    .join("\n");

  const packagesHtml = (purchaseDoc.packages || [])
    .map((p) => `<li><b>${p.packageName}</b> x${p.quantity} ($${p.unitPrice})</li>`)
    .join("");

  const userText = `Hi ${purchaseDoc.userName || "there"},

Your package purchase is confirmed.

Instructor: ${purchaseDoc.instructorName || ""}
Total: $${purchaseDoc.amount || 0}

Packages:
${packagesText}

Invoice attached.

Thanks,
Test Route Driving School
`;

  const userHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Payment Confirmed 🎉</h2>
      <p>Hi ${purchaseDoc.userName || "there"},</p>
      <p>Your package purchase is confirmed. Invoice attached (PDF).</p>
      <p><b>Instructor:</b> ${purchaseDoc.instructorName || ""}</p>
      <p><b>Total:</b> $${purchaseDoc.amount || 0}</p>
      <p><b>Packages:</b></p>
      <ul>${packagesHtml}</ul>
      <p>Thanks,<br/>Test Route Driving School</p>
    </div>
  `;

  const instructorText = `Hi ${purchaseDoc.instructorName || "Instructor"},

You have a new package purchase:

User: ${purchaseDoc.userName} (${purchaseDoc.userEmail})
Total: $${purchaseDoc.amount || 0}

Packages:
${packagesText}

Invoice attached.
`;

  const instructorHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${purchaseDoc.instructorName || "Instructor"},</p>
      <p><b>You have a new package purchase:</b></p>
      <p><b>User:</b> ${purchaseDoc.userName} (${purchaseDoc.userEmail})</p>
      <p><b>Total:</b> $${purchaseDoc.amount || 0}</p>
      <p><b>Packages:</b></p>
      <ul>${packagesHtml}</ul>
      <p>Invoice attached.</p>
    </div>
  `;

  // 4) Send emails + log
  const mailLog = {
    user: { to: purchaseDoc.userEmail, ok: false, error: null },
    instructor: { to: purchaseDoc.instructorEmail || null, ok: false, error: null },
    sentAt: new Date(),
  };

  const sendUser = async () => {
    if (!purchaseDoc.userEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: purchaseDoc.userEmail,
        subject: userSubject,
        html: userHtml,
        text: userText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    mailLog.user.ok = status === "SENT";
    mailLog.user.error = errorMsg;

    await (await emailsCollection()).insertOne({
      purchaseId,
      invoiceNo,
      actorType: "USER",
      type: "PURCHASE_CONFIRM",
      to: purchaseDoc.userEmail,
      subject: userSubject,
      text: userText,
      html: userHtml,
      preview: userText.slice(0, 200),
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
      sentAt: new Date(),
      createdAt: new Date(),
    });
  };

  const sendInstructor = async () => {
    if (!purchaseDoc.instructorEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: purchaseDoc.instructorEmail,
        subject: instructorSubject,
        html: instructorHtml,
        text: instructorText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    mailLog.instructor.ok = status === "SENT";
    mailLog.instructor.error = errorMsg;

    await (await emailsCollection()).insertOne({
      purchaseId,
      invoiceNo,
      actorType: "INSTRUCTOR",
      type: "PURCHASE_CONFIRM",
      to: purchaseDoc.instructorEmail,
      subject: instructorSubject,
      text: instructorText,
      html: instructorHtml,
      preview: instructorText.slice(0, 200),
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
      sentAt: new Date(),
      createdAt: new Date(),
    });
  };

  await Promise.all([sendUser(), sendInstructor()]);

  // 5) Save invoice doc
  await (await invoicesCollection()).insertOne({
    invoiceNo,
    purchaseId,
    createdAt: new Date(),
    paymentStatus: purchaseDoc.paymentStatus || "paid",
    paymentMethod: purchaseDoc.paymentMethod || "card",
    cardBrand: purchaseDoc.cardBrand || null,
    cardLast4: purchaseDoc.cardLast4 || null,
    invoiceKey,
    filename,
    userEmail: purchaseDoc.userEmail,
    instructorEmail: purchaseDoc.instructorEmail || null,
    mailLog,
    total: purchaseDoc.amount || 0,
    source: "purchase",
  });

  // 6) update purchase with invoice
  await (await purchasesCollection()).updateOne(
    { _id: purchaseId },
    {
      $set: {
        invoiceNo,
        invoiceKey,
        invoiceFilename: filename,
        invoiceCreatedAt: new Date(),
        updatedAt: new Date(),
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

    const amount = packages.reduce((sum, p) => sum + Number(p.lineTotal || 0), 0);

    // stripe card details
    let cardBrand = null;
    let cardLast4 = null;
    try {
      const stripe = new Stripe(process.env.NEXT_PUBLIC_Stripe_Secret_key);
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["charges.data.payment_method_details"],
      });
      const charge = intent?.charges?.data?.[0];
      const card = charge?.payment_method_details?.card;
      cardBrand = card?.brand || null;
      cardLast4 = card?.last4 || null;
    } catch (err) {
      console.error("Stripe retrieve failed:", err);
    }

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
