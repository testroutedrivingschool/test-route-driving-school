
import {getBrowser} from "@/app/libs/puppeteer/browser";
function safe(v) {
  return v ?? "";
}

function formatAUDate(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toPublicFileUrl(reqUrl, filePathInPublic) {

  const base = new URL(reqUrl).origin;
  return `${base}/${filePathInPublic.replace(/^\/+/, "")}`;
}

function invoiceHtml(data, logoUrl) {
  const bookingDateText = formatAUDate(data.bookingDate);
  const today = formatAUDate(new Date());

  const ps = String(safe(data.paymentStatus)).toLowerCase();
  const isPaid = ps === "paid" || ps.includes("voucher");

  const paidLabel = isPaid ? "PAID IN FULL" : "UNPAID";

  // safer number parse
  const total = Number(String(data.price ?? 0).replace(/[^\d.-]/g, "")) || 0;

  const method = String(safe(data.paymentMethod)).toLowerCase(); // "card" or ""
  const brand = data.cardBrand ? String(data.cardBrand).toUpperCase() : "";
  const last4 = data.cardLast4 ? String(data.cardLast4) : "";

  const paidByCardLine =
    isPaid && method === "card"
      ? `Paid by Card (${brand || "CARD"} •••• ${last4 || "----"})`
      : "";

  const pendingLine = !isPaid ? "Payment pending." : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color:#111; margin:0; }
    .page { padding: 40px; font-size: 12px; }
    .top { display:flex; justify-content:space-between; align-items:flex-start; }
    .brand h1 { margin:0; font-size:14px; font-weight:700; }
    .brand p { margin:3px 0; line-height:1.35; }

    .logo { width: 150px; height:auto; display:block; margin-left:auto; }
    .rightTitle { margin-top: 10px; text-align:right; }
    .rightTitle .title { font-weight:700; font-size:13px; }
    .rightTitle .sub { margin-top:4px; font-size:11px; }

    .dateRow { margin-top: 18px; }

    .section { margin-top: 18px; }
    .label { font-weight:700; }

    table { width:100%; border-collapse:collapse; margin-top:10px; }
    thead th { background:#d9d9d9; padding:8px; font-weight:700; font-size:11px; text-align:left; }
    tbody td { padding:10px 8px; border-bottom:1px solid #e5e5e5; vertical-align:top; }
    .t-right { text-align:right; }
    .t-center { text-align:center; }

    .split { display:flex; gap:18px; margin-top: 14px; }
    .box { flex:1; }
    .muted { color:#444; }

    .totals { text-align:right; }
    .grand { font-weight:700; border-top:1px solid #bbb; padding-top:8px; margin-top:10px; }

    .paid { margin-top: 18px; text-align:right; font-weight:800; font-size:14px; }
    .paid small { display:block; margin-top:4px; font-weight:400; font-size:11px; }

    .footer { margin-top: 28px; font-size:10px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="brand">
        <h1>TEST ROUTE DRIVING SCHOOL</h1>
        <p>67 Warialda St, Kogarah NSW 2217, Australia</p>
        <p>Phone: 61 412 018 593</p>
        <p>https://testroutedrivingschool.com.au</p>
        <p>ABN: 60 328 717 194</p>
      </div>

      <div>
        ${logoUrl ? `<img class="logo" src="${logoUrl}" />` : ""}
        <div class="rightTitle">
          <div class="title">Invoice / Receipt</div>
          <div class="sub">Invoice # ${safe(data.invoiceNo)}</div>
        </div>
      </div>
    </div>

    <div class="dateRow">${today}</div>

    <div class="section">
      <span class="label">Invoiced To:</span>
      <b>${String(safe(data.userName)).toUpperCase()}</b>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:68%;">Item</th>
          <th style="width:12%;" class="t-center">GST</th>
          <th style="width:20%;" class="t-right">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b>${safe(data.serviceName)}</b> - ${safe(data.duration)}<br/>
            <span class="muted">${bookingDateText} at ${safe(data.bookingTime)}</span>
          </td>
          <td class="t-center">—</td>
          <td class="t-right">$${total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="split">
      <div class="box">
        <div><b>Instructor:</b> ${safe(data.instructorName) || "—"}</div>

        ${paidByCardLine ? `<div class="section">${paidByCardLine}</div>` : ""}
        ${pendingLine ? `<div class="section">${pendingLine}</div>` : ""}
      </div>

      <div class="box totals">
        <div class="grand">TOTAL&nbsp;&nbsp;&nbsp;&nbsp;$${total.toFixed(2)}</div>

        <div class="paid">
          ${paidLabel}
          <small>on ${today}</small>
        </div>
      </div>
    </div>

    <div class="footer">
      Terms & Conditions: https://testroutedrivingschool.com.au/terms
    </div>
  </div>
</body>
</html>`;
}

export async function generateInvoicePdfBuffer(data, reqUrlForAssets) {
 
  const logoUrl = reqUrlForAssets
    ? toPublicFileUrl(reqUrlForAssets, "test-route-driving-school-logo.png")
    : null;

  const html = invoiceHtml(data, logoUrl);

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {waitUntil: "load"});

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {top: "14mm", right: "14mm", bottom: "14mm", left: "14mm"},
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
