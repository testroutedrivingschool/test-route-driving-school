export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";

import {sendMailWithPdf} from "@/app/libs/mail/mailer";
import {getNextInvoiceNo} from "@/app/libs/invoice/getNextInvoiceNo";
import {generateInvoicePdfBuffer} from "@/app/libs/invoice/invoicePdf";

import {
  purchasesCollection,
  usersCollection,
  invoicesCollection,
  emailsCollection,
  packagesCollection,
  jobsCollection,
} from "@/app/libs/mongodb/db";
import {uploadPdfToS3} from "@/app/libs/storage/uploadPdfToS3";

// ---- PDF mapper (purchase -> invoice generator shape)
async function generatePurchaseInvoicePdfBuffer(purchaseDoc, reqUrl) {
  const first = purchaseDoc.packages?.[0];

  const mapped = {
    invoiceNo: purchaseDoc.invoiceNo,
    purchaseId: purchaseDoc._id?.toString() || "",
    userName: purchaseDoc.userName,
    userEmail: purchaseDoc.userEmail,
    userPhone: purchaseDoc.billing?.mobile || "",
    address: purchaseDoc.billing?.address || "",
    suburb: purchaseDoc.billing?.suburb || "",
    // instructorName: purchaseDoc.instructorName,
    // instructorEmail: purchaseDoc.instructorEmail,

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

export async function runPurchaseInvoiceAndEmails({
  purchaseDoc,
  purchaseId,
  invoiceNo,
  reqUrl,
}) {
  // 1) Generate PDF
  const pdfBuffer = await generatePurchaseInvoicePdfBuffer(
    {...purchaseDoc, purchaseId: String(purchaseId)},
    reqUrl,
  );

  const filename = `invoice-${invoiceNo}.pdf`;
  const invoiceKey = `invoices/${filename}`;

  // 2) Upload PDF to S3
  await uploadPdfToS3({
    key: invoiceKey,
    buffer: pdfBuffer,
    originalName: filename,
    folder: "invoices",
    ownerEmail: purchaseDoc.userEmail || purchaseDoc.clientEmail || "",
    status: "active",
  });

  // Prepare email contents

  const adminEmail = "testroutedrivingschool@gmail.com";

  const userSubject = `Package Purchase Confirmed - Invoice #${invoiceNo}`;
  const adminSubject = `New Package Purchase - Invoice #${invoiceNo}`;

  const userText = `Hi ${purchaseDoc.userName || "there"}, Your package purchase is confirmed. Invoice attached.`;
  const adminText = `A new package purchase has been made by ${purchaseDoc.userName || "Unknown User"}. Invoice attached.`;
  const baseUrl = "https://testroutedrivingschool.com.au";

  const userPurchasesUrl = `${baseUrl}/dashboard/user/purchases`;
  const adminPurchasesUrl = `${baseUrl}/dashboard/admin/purchases`;

  const userHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>Package Purchase Confirmed ✅</h2>
    <p>Hi ${purchaseDoc.userName || "there"},</p>
    <p>Your package purchase is confirmed. Your invoice is attached.</p>

    <p style="margin:20px 0;">
      <a
        href="${userPurchasesUrl}"
        style="
          display:inline-block;
          background:#0b57d0;
          color:#fff;
          text-decoration:none;
          padding:12px 20px;
          border-radius:8px;
          font-weight:600;
        "
      >
        View Purchases
      </a>
    </p>

    <p>Thanks,<br/>Test Route Driving School</p>
  </div>
`;

  const adminHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>New Package Purchase 📦</h2>
    <p>A new package purchase has been made by <b>${purchaseDoc.userName || "Unknown User"}</b>.</p>
    <p>The invoice is attached.</p>

    <p style="margin:20px 0;">
      <a
        href="${adminPurchasesUrl}"
        style="
          display:inline-block;
          background:#0b57d0;
          color:#fff;
          text-decoration:none;
          padding:12px 20px;
          border-radius:8px;
          font-weight:600;
        "
      >
        View Purchases
      </a>
    </p>

    <p>Test Route Driving School</p>
  </div>
`;
  // 3) Send emails
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

    await (
      await emailsCollection()
    ).insertOne({
      purchaseId,
      invoiceNo,
      actorType: "USER",
      type: "PURCHASE_CONFIRM",
      to: purchaseDoc.userEmail,
      subject: userSubject,
      text: userText,
      html: userHtml,
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
      createdAt: new Date(),
    });
  };

  const sendAdmin = async () => {
    if (!adminEmail) return;

    let status = "SENT";
    let errorMsg = null;

    try {
      await sendMailWithPdf({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
        text: adminText,
        pdfBuffer,
        filename,
      });
    } catch (e) {
      status = "FAILED";
      errorMsg = String(e?.message || e);
    }

    await (
      await emailsCollection()
    ).insertOne({
      purchaseId,
      invoiceNo,
      actorType: "ADMIN",
      type: "PURCHASE_CONFIRM",
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
      status,
      error: errorMsg,
      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,
      createdAt: new Date(),
    });
  };

  await Promise.all([sendUser(), sendAdmin()]);

  // Save invoice document
  await (
    await invoicesCollection()
  ).insertOne({
    invoiceNo,
    purchaseId,
    invoiceKey,
    filename,
    createdAt: new Date(),
  });

  // Update booking with invoiceKey
  await (
    await purchasesCollection()
  ).updateOne(
    {_id: new ObjectId(purchaseId)},
    {
      $set: {
        invoiceKey,
        invoiceFilename: filename,
        invoiceCreatedAt: new Date(),
      },
    },
  );
}

// --------------------
// GET purchases
// --------------------
export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const userEmail = searchParams.get("userEmail");
    const instructorEmail = searchParams.get("instructorEmail");

    let filter = {};

  if (id) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid purchase id" }, { status: 400 });
  }
  filter = { _id: new ObjectId(id) };

    } else if (email) {
      filter = {$or: [{userEmail: email}, {instructorEmail: email}]};
    } else if (userEmail) {
      filter = {userEmail};
    } else if (instructorEmail) {
      filter = {instructorEmail};
    }

    const purchases = await (await purchasesCollection())
      .find(filter)
      .sort({createdAt: -1})
      .toArray();

    return NextResponse.json(purchases);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error: "Failed to fetch purchases"},
      {status: 500},
    );
  }
}

// --------------------
// PATCH purchase (status updates)
// --------------------
export async function PATCH(req) {
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({error: "id required"}, {status: 400});
    }

    const body = await req.json();
    const {status} = body || {};

    const allowed = ["pending", "confirmed", "completed"];
    if (!allowed.includes(status)) {
      return NextResponse.json({error: "Invalid status"}, {status: 400});
    }

    const col = await purchasesCollection();
    if (!ObjectId.isValid(id)) {
  return NextResponse.json({ error: "Invalid purchase id" }, { status: 400 });
}

const purchaseId = new ObjectId(id);

    const purchase = await col.findOne({_id: purchaseId});
    if (!purchase) {
      return NextResponse.json({error: "Purchase not found"}, {status: 404});
    }

    // simple rule: pending -> confirmed
    if (purchase.status !== "pending" && status === "confirmed") {
      return NextResponse.json(
        {error: `Cannot confirm when status=${purchase.status}`},
        {status: 400},
      );
    }

    await col.updateOne(
      {_id: purchaseId},
      {$set: {status, updatedAt: new Date()}},
    );

    return NextResponse.json({ok: true});
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error: "Failed to update purchase"},
      {status: 500},
    );
  }
}

// Post APi
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      userEmail,

      items,
      currency = "aud",
      paymentIntentId,
      billing,
      discountAmount,
      amount,
      cardBrand = null,
      cardLast4 = null,
    } = body || {};

    if (!userEmail)
      return NextResponse.json({error: "userEmail required"}, {status: 400});

    if (!paymentIntentId)
      return NextResponse.json(
        {error: "paymentIntentId required"},
        {status: 400},
      );
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({error: "items required"}, {status: 400});

    const purchaseCol = await purchasesCollection();

    // prevent duplicates
    const existing = await purchaseCol.findOne({paymentIntentId});
    if (existing) {
  return NextResponse.json({
    ok: true,
    purchaseId: String(existing._id),
    invoiceNo: existing.invoiceNo || null,
  });
}

    // fetch user/instructor docs
    const userCol = await usersCollection();

    const pkgCol = await packagesCollection();

    const userDoc = await userCol.findOne({email: userEmail});

    // ✅ build packages from DB
 const pkgIds = items
  .map((i) => i?.packageId)
  .filter((id) => id && ObjectId.isValid(String(id)))
  .map((id) => new ObjectId(String(id)));

    const pkgDocs = await pkgCol.find({_id: {$in: pkgIds}}).toArray();
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
      invoiceKey: `invoices/invoice-${invoiceNo}.pdf`,
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

    await (
      await jobsCollection()
    ).insertOne({
      type: "PURCHASE_CONFIRMATION",
      purchaseId: String(purchaseId),
      invoiceNo,
      reqUrl: process.env.APP_URL || req.url,
      status: "pending",
      attempts: 0,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {ok: true, purchaseId: String(purchaseId), invoiceNo},
      {status: 201},
    );
  } catch (e) {
  console.error("POST /api/purchases error:", e);
return NextResponse.json(
  { error: e?.message || "Something went wrong" },
  { status: 500 }
);
  }
}
