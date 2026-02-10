export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import { getBrowser } from "@/app/libs/puppeteer/browser";
import { uploadPdfToS3 } from "@/app/libs/storage/uploadPdfToS3";
import { invoicesCollection } from "@/app/libs/mongodb/db";
import fs from "fs";
import path from "path";
import {ObjectId} from "mongodb";
import {
  clientsChecklistsCollection,
  clientsCollection,
  emailsCollection
} from "@/app/libs/mongodb/db";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";
import {emailSignatureHtml} from "@/app/libs/mail/signature"
import { getNextInvoiceNo } from "@/app/libs/invoice/getNextInvoiceNo";
function safe(v) {
  return v === null || v === undefined ? "" : String(v);
}
function isValidEmailList(value) {
  if (!value) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return value.split(",").map(s => s.trim()).every(e => emailRegex.test(e));
}

function formatAUDateLong(dateLike = new Date()) {
  try {
    return new Date(dateLike).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function toDataUri(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

// ✅ same HTML you already have
function checklistHtml({
  schoolName,
  reportTitle,
  reportDateLine,
  clientName,
  addressRight,
  logoDataUri,
  categoryLabel,
  rows,
}) {
  const bodyRows = rows
    .map((r, idx) => {
      const ratingTxt =
        r.rating === null || r.rating === undefined || r.rating === ""
          ? ""
          : `${safe(r.rating)} / 10`;

      const comment = safe(r.comment || "");

      const categoryCell =
        idx === 0
          ? `<td class="category" rowspan="${rows.length}">${safe(
              categoryLabel,
            )}</td>`
          : "";

      return `
        <tr>
          ${categoryCell}
          <td class="item">${safe(r.name)}</td>
          <td class="comment">${comment.replace(/\n/g, "<br/>")}</td>
          <td class="rating">${ratingTxt}</td>
        </tr>
      `;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; color: #111; }
    .page { padding: 34px 36px; }

    .top { display:flex; justify-content:space-between; align-items:flex-start; }
    .left h1 { margin:0; font-size:28px; font-weight:500; }
    .left h2 { margin:12px 0 0 0; font-size:20px; font-weight:700; }
    .left .date { margin-top:14px; font-size:14px; }
    .left .name { margin-top:22px; font-size:16px; }

    .right { text-align:right; }
    .logo { width: 190px; height:auto; display:block; margin-left:auto; }
    .addr { margin-top:14px; font-size:14px; line-height:1.3; font-weight:600; }

    table { width:100%; border-collapse:collapse; margin-top:20px; table-layout:fixed; }
    thead th {
      background: #cfcfcf;
      border: 2px solid #cfcfcf;
      color: #000;
      text-align: left;
      padding: 8px 8px;
      font-size: 16px;
      font-weight: 800;
    }

    tbody td {
      border: 1px solid #d7d7d7;
      padding: 6px 8px;
      font-size: 14px;
      vertical-align: top;
    }

    .category { width: 120px; }
    .item { width: 280px; }
    .comment { width: auto; }
    .rating { width: 120px; text-align:center; font-weight:700; }
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="left">
        <h1>${safe(schoolName)}</h1>
        <h2>${safe(reportTitle)}</h2>
        <div class="date">${safe(reportDateLine)}</div>
        <div class="name">Name: ${safe(clientName)}</div>
      </div>

      <div class="right">
        ${logoDataUri ? `<img class="logo" src="${logoDataUri}" />` : ""}
        <div class="addr">${safe(addressRight).replace(/\n/g, "<br/>")}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:120px;">Category</th>
          <th style="width:280px;">Item</th>
          <th>Comment</th>
          <th style="width:120px; text-align:center;">Rating</th>
        </tr>
      </thead>
      <tbody>
        ${
          rows.length
            ? bodyRows
            : `<tr><td colspan="4">No checklist items found.</td></tr>`
        }
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

async function generateChecklistPdfBuffer({
  clientId,
  checklistId,
  checklistTitle,
  instructorName,
}) {
  const clientsCol = await clientsCollection();
  const checklistsCol = await clientsChecklistsCollection();

  const client = await clientsCol.findOne({_id: new ObjectId(clientId)});
  if (!client) throw new Error("Client not found");

  const doc = await checklistsCol.findOne({
    clientId: new ObjectId(clientId),
    checklistId,
  });

  const items = Array.isArray(doc?.items) ? doc.items : [];
  const rows = items.map((it) => ({
    name: it?.name,
    comment: it?.comment,
    rating: it?.rating,
  }));

  const logoPath = path.join(
    process.cwd(),
    "public",
    "test-route-driving-school-logo.png",
  );
  const logoDataUri = toDataUri(logoPath);

  const reportDateLine = `${formatAUDateLong(new Date())}${
    instructorName ? ` by ${instructorName}` : ""
  }`;

  const html = checklistHtml({
    schoolName: "Test Route Driving School",
    reportTitle: `${checklistTitle} Progress Report`,
    reportDateLine,
    clientName: safe(
      client?.firstName
        ? `${client.firstName} ${client.lastName || ""}`
        : client?.userName || "Client",
    ).trim(),
    addressRight: "67 Warialda St, Kogarah NSW 2217, Australia",
    logoDataUri,
    categoryLabel: checklistTitle,
    rows,
  });

  const browser = await getBrowser();
const page = await browser.newPage();

try {
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  });

  return Buffer.from(pdf);
} finally {
  await page.close();
}

}

export async function POST(req, {params}) {
  try {
    const {clientId} = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({error: "Invalid clientId"}, {status: 400});
    }

    const body = await req.json();

    const to = safe(body.to).trim();
    const cc = safe(body.cc).trim() || null;
    const bcc = safe(body.bcc).trim() || null;


 const checklistId = safe(body.checklistId || "performance").trim();
    const checklistTitle = safe(
      body.checklistTitle || "Performance Evaluation",
    ).trim();
    const subject = safe(
      body.subject || `${checklistTitle} Progress Report`,
    ).trim();


   
    const instructorName = safe(body.instructorName || "").trim();

    if (!to) return NextResponse.json({error: "To is required"}, {status: 400});
    if (!subject)
      return NextResponse.json({error: "Subject is required"}, {status: 400});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({error: "Invalid To email"}, {status: 400});
    }
       if (cc && !isValidEmailList(cc)) return NextResponse.json({error:"Invalid CC email"}, {status:400});
if (bcc && !isValidEmailList(bcc)) return NextResponse.json({error:"Invalid BCC email"}, {status:400});
    const pdfBuffer = await generateChecklistPdfBuffer({
      clientId,
      checklistId,
      checklistTitle,
      instructorName,
    });
const clientDoc = await (await clientsCollection()).findOne({ _id: new ObjectId(clientId) });

const userEmail = String(clientDoc?.email || "").trim().toLowerCase();
const instructorEmail = String(body?.instructorEmail || "").trim().toLowerCase(); // or from auth user

const safeTitleSlug = checklistTitle
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const filename = `checklist-${safeTitleSlug}-${clientId}.pdf`;
const invoiceKey = `checklists/${clientId}/${Date.now()}-${filename}`;

// ✅ Upload pdfBuffer to S3/Minio
await uploadPdfToS3({
  key: invoiceKey,
  buffer: pdfBuffer,
  contentType: "application/pdf",
});
const invoiceNo = await getNextInvoiceNo();
const invCol = await invoicesCollection();
const insertRes = await invCol.insertOne({
  invoiceNo: invoiceNo, 
  bookingId: null,

  clientId: new ObjectId(clientId),
  checklistId,
  checklistTitle,

  createdAt: new Date(),


  invoiceKey,
  filename,

  userEmail,
  instructorEmail,

  total: 0,

  meta: {
    kind: "CHECKLIST_REPORT",
  },
});

const rawHtml = safe(body.html).trim() || `<p>Here are your latest results.</p>`;
const signature = emailSignatureHtml({ instructorName });

const emailHtml = rawHtml + signature; 
const webHtml = emailHtml.replace(
  /src="cid:companylogo"/g,
  `src="https://testroutedrivingschool.com.au/test-route-driving-school-logo.png"`
);
const logoPath = path.join(process.cwd(), "public", "test-route-driving-school-logo.png");

const mailInfo = await sendMailWithPdf({
  to,
  cc: cc || undefined,
  bcc: bcc || undefined,
  subject,
  html: emailHtml,
  text: safe(body.text).trim() || "Please find your report attached.",
  pdfBuffer,
  filename: `${checklistTitle}-progress-report.pdf`,
  inlineLogoPath: logoPath,
});

// ✅ Save to DB
const emailsCol = await emailsCollection();

const now = new Date();

await emailsCol.insertOne({
  type: "CHECKLIST_REPORT",
  actorType: "USER", 

  clientId: new ObjectId(clientId),
  checklistId,
  checklistTitle,

  to: to.toLowerCase(),
  cc: cc ? cc.toLowerCase() : null,
  bcc: bcc ? bcc.toLowerCase() : null,

  subject,
  html: webHtml,       
  text: safe(body.text).trim() || "",

  // ✅ Attachment fields like your old email records
  hasAttachment: true,
  attachmentName: filename,      // e.g. checklist-performance-xxxx.pdf
  attachmentKey: invoiceKey,     // ✅ the S3/Minio key you uploaded
  sentAt: now,
  createdAt: now,

  // (optional keep your old structure too)
  attachment: {
    filename,
    mime: "application/pdf",
    size: pdfBuffer?.length || 0,
  },

  mailer: {
    messageId: mailInfo?.messageId || null,
    accepted: mailInfo?.accepted || [],
    rejected: mailInfo?.rejected || [],
    response: mailInfo?.response || null,
  },
});


return NextResponse.json({ok: true, messageId: mailInfo?.messageId || null});
  } catch (err) {
    console.error("POST /clients/:clientId/checklists-email error:", err);
    return NextResponse.json({error: "Failed to send email"}, {status: 500});
  }
}
