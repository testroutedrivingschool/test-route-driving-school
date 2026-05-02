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
  clientsCollection,
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

  const adminEmail = "info@testroutedrivingschool.com.au";

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
        return NextResponse.json({error: "Invalid purchase id"}, {status: 400});
      }
      filter = {_id: new ObjectId(id)};
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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({error: "Invalid purchase id"}, {status: 400});
    }

    const body = await req.json();

    const {
      status,
      instructorId,
      instructorName,
      instructorEmail,
    } = body || {};

    const allowedStatuses = ["pending", "confirmed", "cancelled"];

    const purchaseCol = await purchasesCollection();
    const clientCol = await clientsCollection();

    const purchaseId = new ObjectId(id);

    const purchase = await purchaseCol.findOne({_id: purchaseId});

    if (!purchase) {
      return NextResponse.json({error: "Purchase not found"}, {status: 404});
    }

    const currentStatus = String(purchase.status || "pending").toLowerCase();

    // Do not allow instructor changes after cancellation
    if (
      currentStatus === "cancelled" &&
      instructorId !== undefined
    ) {
      return NextResponse.json(
        {error: "Cancelled purchase cannot be assigned to an instructor"},
        {status: 400},
      );
    }

    const updateDoc = {
      updatedAt: new Date(),
    };

    // Instructor update
    if (instructorId !== undefined) {
      updateDoc.instructorId = instructorId || "";
      updateDoc.instructorName = instructorId ? instructorName || "" : "";
      updateDoc.instructorEmail = instructorId ? instructorEmail || "" : "";

      // If instructor selected, auto-confirm.
      // If instructor cleared, return to pending unless already cancelled.
      if (instructorId) {
        updateDoc.status = "confirmed";
        updateDoc.confirmedAt = new Date();
      } else {
        updateDoc.status = "pending";
      }
    }

    // Manual status update
    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({error: "Invalid status"}, {status: 400});
      }

      updateDoc.status = status;

      if (status === "confirmed") {
        updateDoc.confirmedAt = new Date();
      }

      if (status === "cancelled") {
        updateDoc.cancelledAt = new Date();
      }
    }

    /**
     * Balance handling:
     * - If purchase becomes confirmed, apply balance once.
     * - If purchase becomes cancelled and balance was applied, remove it if still available.
     */
    const nextStatus = updateDoc.status || currentStatus;
    const amount = Number(purchase.amount || 0);

    if (nextStatus === "confirmed" && !purchase.balanceApplied && amount > 0) {
      const client = await clientCol.findOne({
        email: String(purchase.userEmail || "").toLowerCase(),
      });

      if (client) {
        await clientCol.updateOne(
          {_id: client._id},
          {
            $inc: {
              accountBalance: amount,
            },
            $set: {
              updatedAt: new Date(),
            },
          },
        );

        updateDoc.balanceApplied = true;
        updateDoc.balanceAppliedAt = new Date();
      }
    }

    if (nextStatus === "cancelled" && purchase.balanceApplied && amount > 0) {
      const client = await clientCol.findOne({
        email: String(purchase.userEmail || "").toLowerCase(),
      });

      if (client) {
        const currentBalance = Number(client.accountBalance || 0);

        if (currentBalance < amount) {
          return NextResponse.json(
            {
              error:
                "Cannot cancel because this purchase balance appears to be already used",
            },
            {status: 400},
          );
        }

        await clientCol.updateOne(
          {_id: client._id},
          {
            $inc: {
              accountBalance: -amount,
            },
            $set: {
              updatedAt: new Date(),
            },
          },
        );

        updateDoc.balanceApplied = false;
        updateDoc.balanceRemovedAt = new Date();
      }
    }

    await purchaseCol.updateOne(
      {_id: purchaseId},
      {$set: updateDoc},
    );

    return NextResponse.json({ok: true});
  } catch (e) {
    console.error("PATCH /api/purchases error:", e);
    return NextResponse.json(
      {error: "Failed to update purchase", details: e?.message},
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
      clientId,
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
  const balanceAmount = Number(amount || 0);
    const doc = {
      userId: userId || userDoc?._id?.toString() || "",
      userName: userDoc?.name || billing?.name || "",
      userEmail,
clientId,
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
const clientCol = await clientsCollection();

const emailLower = String(userEmail || "").toLowerCase();

// find client
const client = await clientCol.findOne({
  $or: [
    { email: emailLower },
    { linkedUserEmail: emailLower },
  ],
});

if (client && balanceAmount > 0) {
  await clientCol.updateOne(
    { _id: client._id },
    {
      $inc: {
        accountBalance: balanceAmount,
      },
      $set: {
        updatedAt: new Date(),
      },
      $push: {
        balanceLedger: {
          type: "purchase-credit",
          purchaseId: String(purchaseId),
          amount: balanceAmount,
          note: "Package purchased (auto credit)",
          createdAt: new Date(),
        },
      },
    }
  );

  // IMPORTANT: mark as already applied
  await purchaseCol.updateOne(
    { _id: purchaseId },
    {
      $set: {
        clientId: client._id.toString(),
        balanceApplied: true,
        balanceAppliedAt: new Date(),
        balanceStatus: "available",
      },
    }
  );
}
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
      {error: e?.message || "Something went wrong"},
      {status: 500},
    );
  }
}
