import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function safe(v) {
  return v ?? "";
}

function formatAUDate(dateLike) {
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

export function generateInvoicePdfBuffer(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ===== Load font (required for Next.js) =====
   const regularFont = path.join(
  process.cwd(),
  "public",
  "fonts",
  "OpenSans-Regular.ttf"
);
const boldFont = path.join(
  process.cwd(),
  "public",
  "fonts",
  "OpenSans-Bold.ttf"
);

doc.registerFont("Regular", fs.readFileSync(regularFont));
doc.registerFont("Bold", fs.readFileSync(boldFont));

// default font
doc.font("Regular");

    // ===== Constants =====
    const pageLeft = doc.page.margins.left; // 50
    const pageRight = doc.page.width - doc.page.margins.right; // 545
    const contentWidth = pageRight - pageLeft;

    // ===== Logo (TOP-RIGHT FIXED POSITION) =====
    // Put your logo here: /public/images/logo.png
   const logoPath = path.join(
  process.cwd(),
  "public",
  "test-route-driving-school-logo.png"
);
    const logoWidth = 100;
    const logoX = doc.page.width - doc.page.margins.right - logoWidth;
    const logoY = doc.page.margins.top; // fixed top-right

    try {
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, logoX, logoY, { width: logoWidth });
      }
    } catch (e) {
      // ignore logo errors
    }

    // ===== Company Info (LEFT) =====
    const topY = doc.page.margins.top; // fixed top
    doc.font("Bold").fontSize(12).text(
  "TEST ROUTE DRIVING SCHOOL",
  pageLeft,
  topY
);

// switch back to regular for rest
doc.font("Regular");
    
    doc.moveDown(0.4);
    doc.fontSize(10).text("67 Warialda St, Kogarah NSW 2217, Australia", {
      lineGap: 2,
    });
    doc.text("Phone: 61 412 018 593");
    doc.text("https://testroutedrivingschool.com.au");
    doc.text("ABN: 60 328 717 194");

    // ✅ Make sure next section starts below logo area
    doc.y = topY + 110;
doc.moveDown(0.4);
    // ===== Right side title + invoice number =====
    doc.font("Bold").fontSize(14).text("Invoice / Receipt", pageLeft, doc.y, {
  align: "right",
  width: contentWidth,
});
doc.font("Regular");

    doc.moveDown(0.3);
    doc.fontSize(10).text(`Invoice # ${safe(data.invoiceNo)}`, {
      align: "right",
      width: contentWidth,
    });

    // Date left
    doc.moveDown(0.6);
    doc.fontSize(10).text(formatAUDate(new Date()), pageLeft);

    // Invoiced To
    doc.moveDown(1.4);
    doc.fontSize(10).text("Invoiced To:", pageLeft, doc.y, { continued: true });
    doc.fontSize(10).text(`   ${String(safe(data.userName)).toUpperCase()}`);

    doc.moveDown(1.2);

    // ===== Table Header =====
    const tableX = pageLeft;
    const tableW = contentWidth;
    const rowH = 24;

    const colItemW = Math.floor(tableW * 0.68);
    const colGSTW = Math.floor(tableW * 0.12);
    const colCostW = tableW - colItemW - colGSTW;

    const headerY = doc.y;

    // Grey header background
    doc.save();
    doc.rect(tableX, headerY, tableW, rowH).fill("#D9D9D9");
    doc.restore();

    doc.fontSize(10).fillColor("#000");
doc.font("Bold").fontSize(10);
doc.text("Item", tableX + 8, headerY + 7);
doc.text("GST", tableX + colItemW, headerY + 7, { align: "center" });
doc.text("Cost", tableX + colItemW + colGSTW, headerY + 7, { align: "right" });
doc.font("Regular");

  

    // ===== Table Row =====
    const rowY = headerY + rowH;
    doc
      .moveTo(tableX, rowY + rowH)
      .lineTo(tableX + tableW, rowY + rowH)
      .strokeColor("#E5E5E5")
      .stroke();

    const bookingDateText = formatAUDate(data.bookingDate);
    const bookingTimeText = safe(data.bookingTime);

    const itemText = `${safe(data.serviceName)} - ${safe(
      data.duration
    )} on ${bookingDateText} at ${bookingTimeText}`;

    doc.fontSize(10).fillColor("#000");
    doc.text(itemText, tableX + 8, rowY + 6, { width: colItemW - 16 });

    // GST column
    doc.text("—", tableX + colItemW, rowY + 6, {
      width: colGSTW,
      align: "center",
    });

    // Cost column: Voucher or price
    const isVoucher = String(safe(data.paymentStatus))
      .toLowerCase()
      .includes("voucher");
    const costText = isVoucher
      ? "Voucher"
      : `$${Number(data.price || 0).toFixed(2)}`;

    doc.text(costText, tableX + colItemW + colGSTW, rowY + 6, {
      width: colCostW - 8,
      align: "right",
    });

    // Instructor line under table
    doc.moveDown(3);
    doc
      .strokeColor("#CFCFCF")
      .moveTo(tableX, doc.y)
      .lineTo(tableX + tableW, doc.y)
      .stroke();
    doc.moveDown(0.8);

    if (data.instructorName) {
      doc.fontSize(10).text(`Instructor: ${safe(data.instructorName)}`, tableX);
    }

    // ===== Payment status / method =====
    doc.moveDown(1.6);

    const ps = String(safe(data.paymentStatus)).toLowerCase();
    const isPaid = ps === "paid" || ps.includes("voucher");

    let paidLabel = "UNPAID";
    if (ps === "paid") paidLabel = "PAID";
    if (ps.includes("voucher")) paidLabel = "PAID";

    doc.font("Bold").fontSize(16).text(paidLabel, tableX, doc.y, {
  width: tableW,
  align: "right",
});
doc.font("Regular");

    // If paid, show card details ONLY (no bank details ever)
    if (isPaid && data.paymentMethod === "card") {
      doc.moveDown(0.8);

      const brand = data.cardBrand
        ? String(data.cardBrand).toUpperCase()
        : "CARD";
      const last4 = data.cardLast4 ? String(data.cardLast4) : "----";

      doc.fontSize(10).text(`Paid by Card (${brand} •••• ${last4})`, tableX);
    }

    if (!isPaid) {
      doc.moveDown(0.8);
      doc.fontSize(10).text("Payment pending.", tableX);
    }

    // ===== Terms =====
    doc.moveDown(3.0);
    doc.fontSize(9).text(
      "Terms & Conditions: https://testroutedrivingschool.com.au/terms",
      tableX
    );

    doc.end();
  });
}
