import { bookingsCollection } from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getNextInvoiceNo } from "@/app/libs/invoice/getNextInvoiceNo";
import { generateInvoicePdfBuffer } from "@/app/libs/invoice/invoicePdf";
import { uploadPdfToS3 } from "@/app/libs/storage/uploadPdfToS3";

export async function PATCH(req, { params }) {
  try {
    const { bookingId } = await params;
    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    const body = await req.json();
    const { } = body; // Rename invoiceKey to avoid redeclaration

    const invoiceNo =await getNextInvoiceNo()
     const invoiceFilename= `invoice-${invoiceNo}.pdf`;
     const invoiceKey= `invoices/invoice-${invoiceNo}.pdf`;

    const updateData = {
      invoiceNo,
      invoiceKey: invoiceKey,  
      invoiceFilename,
      invoiceCreatedAt: new Date(),
    };

    const bookingsCol = await bookingsCollection();
    const result = await bookingsCol.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // After updating the booking, we generate and upload the invoice PDF
    const invoiceNumber = await getNextInvoiceNo(); // Generate the next invoice number
    const pdfBuffer = await generateInvoicePdfBuffer(
      { ...updateData, invoiceNumber, bookingId: String(bookingId), type: "BOOKINGS_CONFIRM" }
    );

    const newInvoiceFilename = `invoice-${invoiceNumber}.pdf`;
    const newInvoiceKey = `invoices/${newInvoiceFilename}`;  // Using a new variable to avoid redeclaration

    // Upload the invoice PDF to S3/MinIO
    await uploadPdfToS3({
      key: newInvoiceKey,
      buffer: pdfBuffer,
      originalName: newInvoiceFilename,
      folder: "invoices",
      status: "active",
    });

    // Update invoice details in the booking data
    await bookingsCol.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { invoiceKey: newInvoiceKey, invoiceFilename: newInvoiceFilename, invoiceCreatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Invoice details and PDF updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update invoice details and generate PDF" },
      { status: 500 }
    );
  }
}