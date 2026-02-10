export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getBrowser } from "@/app/libs/puppeteer/browser";

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { bookingsCollection, clientsCollection } from "@/app/libs/mongodb/db";

function safe(v) {
  return v ?? "";
}

function formatAUDateTime(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatAUDate(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-AU");
}

function durationToMinutes(b) {
  const direct = Number(b.minutes);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const s = String(b.duration || "").toLowerCase();
  const m1 = s.match(/(\d+(\.\d+)?)\s*(min|mins|minute|minutes)/);
  if (m1) return Math.round(Number(m1[1]));
  const m2 = s.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
  if (m2) return Math.round(Number(m2[1]) * 60);

  return 0;
}

function toDataUri(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      "application/octet-stream";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

function historyHtml({ client, bookings, logoDataUri }) {
  const totalPaid = bookings.reduce((sum, b) => {
    const paid = String(b.paymentStatus || "").toLowerCase() === "paid";
    return sum + (paid ? Number(b.price || 0) : 0);
  }, 0);

  const rows = bookings
    .map((b) => {
      const status = safe(b.paymentStatus || "unpaid");
      const payRef = safe(b.paymentIntentId || "—");
      return `
        <tr>
          <td class="date">${formatAUDateTime(b.bookingDate)}<br/></td>
          <td>${safe(b.bookingType || "booking")}</td>
          <td>${safe(b.suburb || b.location || "—")}</td>
          <td>${safe(b.instructorName || "—")}</td>
          <td>${safe(b.serviceName || "—")} ${b.duration ? `(${safe(b.duration)})` : ""}</td>
          <td>${String(status).toLowerCase() === "paid" ? formatAUDate(b.createdAt || b.bookingDate) : "—"}</td>
      
          <td class="wrap">${payRef}</td>
          <td>${b.invoiceNo ? `#${b.invoiceNo}` : "—"}</td>
          <td class="right">$${Number(b.price || 0).toFixed(2)}</td>
          <td>${status}</td>
        </tr>
      `;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing:border-box; }
    body { font-family: Arial, sans-serif; margin:0; color:#111; }
    .page { padding: 26px 28px; }

    .top { display:flex; justify-content:space-between; align-items:flex-start; }
    .left h1 { margin:0; font-size:18px; font-weight:700; }
    .left .muted { margin-top:6px; line-height:1.3; font-size:12px; }
    .right { text-align:right; font-size:12px; line-height:1.3; }
    .logo { width: 120px; height:auto; display:block; margin-left:auto; }
    .spacer { height: 18px; }

    table { width:100%; border-collapse:collapse; margin-top:14px; font-size:12px; }
    thead th {
      background:#000; color:#fff; padding:8px 6px; font-weight:700;
      border:1px solid #333;
    }
    tbody td { border:1px solid #333; padding:8px 6px; vertical-align:top; }
    .right { text-align:right; }
    .date { width: 140px; }
    .wrap { word-break:break-all; max-width: 170px; }
    .total { margin-top:10px; text-align:right; font-weight:700; }
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="left">
        <h1>History: ${safe(client?.firstName + " "+ client?.lastName || client?.userName || "Client")}</h1>
        <div class="muted">
          ${client?.phone ? `Phone: ${safe(client.phone)}<br/>` : ""}
          ${client?.address ? `${safe(client.address)}<br/>` : ""}
          ${client?.suburb ? `${safe(client.suburb)}<br/>` : ""}
        </div>
      </div>

      <div class="right">
        ${logoDataUri ? `<img class="logo" src="${logoDataUri}" />` : ""}
        <div style="margin-top:6px;">
          67 Warialda St, Kogarah NSW 2217<br/>
          Phone: 61 412 018 593
        </div>
      </div>
    </div>

    <div class="spacer"></div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Location</th>
          <th>Instructor</th>
          <th>Services</th>
          <th>Paid</th>
        
          <th>Pay Ref</th>
          <th>Invoice#</th>
          <th>Cost</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="11">No bookings found.</td></tr>`}
      </tbody>
    </table>

    <div class="total">Total Paid: $${totalPaid.toFixed(2)}</div>
  </div>
</body>
</html>`;
}

export async function GET(_req, { params }) {
  const { clientId } = await params;
  const clientsCol = await clientsCollection();
  const bookingsCol = await bookingsCollection();

  const client = await clientsCol.findOne({ _id: new ObjectId(clientId) });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // bookings by client email (your logic)
  const email = String(client.email || "").trim();
  const bookings = await bookingsCol
    .find(email ? { userEmail: email } : {})
    .sort({ bookingDate: -1, createdAt: -1 })
    .toArray();

  // logo from /public
  const logoPath = path.join(process.cwd(), "public", "test-route-driving-school-logo.png");
  const logoDataUri = toDataUri(logoPath);

  const html = historyHtml({ client, bookings, logoDataUri });

  const browser = await getBrowser();
const page = await browser.newPage();

try {
  await page.setContent(html, { waitUntil: "load" });
await page.emulateMediaType("screen");
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="client-history-${clientId}.pdf"`,
    },
  });
} finally {
  await page.close(); 
}

}
