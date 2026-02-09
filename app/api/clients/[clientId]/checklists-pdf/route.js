export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clientsCollection, clientsChecklistsCollection } from "@/app/libs/mongodb/db";

function safe(v) {
  return v === null || v === undefined ? "" : String(v);
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
          ? `<td class="category" rowspan="${rows.length}">${safe(categoryLabel)}</td>`
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

export async function GET(req, { params }) {
  try {
    const { clientId } = await params;

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
    }
const templateRows = [
  { name: "Prepare to drive", comment: "", rating: null },
  { name: "Vehicle Control", comment: "", rating: null },
  { name: "Moving off and Stopping", comment: "", rating: null },
  { name: "Steering", comment: "", rating: null },
  { name: "Observation Check", comment: "", rating: null },
  { name: "Reverse Parking", comment: "", rating: null },
  { name: "Speed Management", comment: "", rating: null },
  { name: "Road Positioning", comment: "", rating: null },
  { name: "Decision Making", comment: "", rating: null },
  { name: "Hazard and Response", comment: "", rating: null },
  { name: "Lane changing", comment: "", rating: null },
  { name: "3 Point Turn", comment: "", rating: null },
  { name: "Scanning", comment: "", rating: null },
  { name: "Simple Traffic", comment: "", rating: null },
  { name: "Complex Traffic", comment: "", rating: null },
  { name: "Driving at Night", comment: "", rating: null },
  { name: "Driving in adverse condition", comment: "", rating: null },
];

    const url = new URL(req.url);
    const checklistId = safe(url.searchParams.get("checklistId") || "performance").trim();
    const checklistTitle = safe(url.searchParams.get("checklistTitle") || "Performance Evaluation").trim();
    const instructorName = safe(url.searchParams.get("instructorName") || "").trim();

    const clientsCol = await clientsCollection();
    const checklistsCol = await clientsChecklistsCollection();

    const client = await clientsCol.findOne({ _id: new ObjectId(clientId) });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

const doc = await checklistsCol.findOne({
  clientId: new ObjectId(clientId),
  checklistId,
});

// ✅ Map DB items by name
const items = Array.isArray(doc?.items) ? doc.items : [];
const dbMap = new Map();
for (const it of items) {
  if (!it?.name) continue;
  dbMap.set(it.name, {
    comment: it.comment ?? "",
    rating:
      it.rating === null || it.rating === undefined || it.rating === ""
        ? null
        : Number(it.rating),
  });
}

// ✅ Merge DB into template (so you ALWAYS get full list)
const rows = templateRows.map((r) => {
  const saved = dbMap.get(r.name);
  if (!saved) return r;

  return {
    ...r,
    comment: saved.comment,
    rating: saved.rating,
  };
});

    const logoPath = path.join(process.cwd(), "public", "test-route-driving-school-logo.png");
    const logoDataUri = toDataUri(logoPath);

    const reportDateLine = `${formatAUDateLong(new Date())}${instructorName ? ` by ${instructorName}` : ""}`;

    const html = checklistHtml({
      schoolName: "Test Route Driving School",
      reportTitle: `${checklistTitle} Progress Report`,
      reportDateLine,
      clientName: safe(client?.firstName ? `${client.firstName} ${client.lastName || ""}` : client?.userName || "Client").trim(),
      addressRight: "67 Warialda St, Kogarah NSW 2217, Australia",
      logoDataUri,
      categoryLabel: checklistTitle,
      rows,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      });

      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="checklist-${checklistId}-${clientId}.pdf"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("GET /clients/:clientId/checklists-pdf error:", err);
    return NextResponse.json({ error: "Failed to generate checklist pdf" }, { status: 500 });
  }
}
