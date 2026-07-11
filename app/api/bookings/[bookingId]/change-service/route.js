export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {after, NextResponse} from "next/server";
import {ObjectId} from "mongodb";

import {
  bookingsCollection,
  instructorsCollection,
  invoicesCollection,
  emailsCollection,
} from "@/app/libs/mongodb/db";

import {generateInvoicePdfBuffer} from "@/app/libs/invoice/invoicePdf";
import {uploadPdfToS3} from "@/app/libs/storage/uploadPdfToS3";
import {sendMailWithPdf} from "@/app/libs/mail/mailer";

const DURATIONS = [
  {label: "1 Hour", minutes: 60},
  {label: "1hr 30m", minutes: 90},
  {label: "2 Hours", minutes: 120},
  {label: "2hr 30m", minutes: 150},
  {label: "3 Hours", minutes: 180},
  {label: "3hr 30m", minutes: 210},
  {label: "4 Hours", minutes: 240},
];

function money(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function stringId(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (typeof value === "object" && value.$oid) {
    return value.$oid;
  }

  return String(value);
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function zeroOrMissing(field) {
  return {
    $or: [
      {[field]: 0},
      {[field]: null},
      {[field]: {$exists: false}},
    ],
  };
}

function getUpdatedDocument(result) {
  if (!result) return null;

  if (
    typeof result === "object" &&
    Object.prototype.hasOwnProperty.call(result, "value")
  ) {
    return result.value;
  }

  return result;
}

function formatBookingDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function sendAndLogEmail({
  booking,
  invoiceNo,
  actorType,
  to,
  subject,
  html,
  text,
  pdfBuffer,
  filename,
  invoiceKey,
}) {
  if (!to) {
    return {
      to: null,
      ok: false,
      skipped: true,
      error: "Email address is missing",
    };
  }

  let status = "SENT";
  let errorMessage = null;

  try {
    await sendMailWithPdf({
      to,
      subject,
      html,
      text,
      pdfBuffer,
      filename,
    });
  } catch (error) {
    status = "FAILED";
    errorMessage = String(
      error?.message || "Unable to send email",
    );
  }

  try {
    await (
      await emailsCollection()
    ).insertOne({
      bookingId: booking._id,
      invoiceNo,

      actorType,
      type: "BOOKING_SERVICE_CHANGED",

      to,
      subject,
      text,
      html,
      preview: text.slice(0, 200),

      status,
      error: errorMessage,

      hasAttachment: true,
      attachmentName: filename,
      attachmentKey: invoiceKey,

      sentAt: new Date(),
      createdAt: new Date(),
    });
  } catch (logError) {
    console.error(
      "Failed to save service-change email log:",
      logError,
    );
  }

  return {
    to,
    ok: status === "SENT",
    skipped: false,
    error: errorMessage,
  };
}

export async function PATCH(req, context) {
  try {
    const {bookingId} = await context.params;

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        {error: "Invalid booking ID"},
        {status: 400},
      );
    }

    const body = await req.json();

    const requestedServiceName = String(
      body?.serviceName || "",
    ).trim();

    const requestedMinutes = Number(
      body?.minutes || 0,
    );

    if (
      !requestedServiceName ||
      !Number.isFinite(requestedMinutes) ||
      requestedMinutes <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Service name and valid duration are required",
        },
        {status: 400},
      );
    }

    const bookings = await bookingsCollection();

    const bookingObjectId = new ObjectId(bookingId);

    const booking = await bookings.findOne({
      _id: bookingObjectId,
    });

    if (!booking) {
      return NextResponse.json(
        {error: "Booking not found"},
        {status: 404},
      );
    }

    /*
     * Only completely unpaid bookings can change service.
     */
    const paymentStatus = normalizeText(
      booking.paymentStatus,
    );

    const paidAmount = money(
      booking.paidAmount ??
        booking.totalPaidAmount ??
        0,
    );

    const cardAmount = money(
      booking.cardAmount,
    );

    const cashAmount = money(
      booking.cashAmount,
    );

    const creditUsed = money(
      booking.creditUsed ??
        booking.creditToUse ??
        0,
    );

    if (
      paymentStatus !== "unpaid" ||
      paidAmount > 0 ||
      cardAmount > 0 ||
      cashAmount > 0 ||
      creditUsed > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Service cannot be changed because payment or credit has already been recorded",
        },
        {status: 409},
      );
    }

    /*
     * Find selected duration index.
     */
    const durationIndex = DURATIONS.findIndex(
      (duration) =>
        duration.minutes === requestedMinutes,
    );

    if (durationIndex === -1) {
      return NextResponse.json(
        {error: "Invalid service duration"},
        {status: 400},
      );
    }

    /*
     * Find booking instructor.
     */
    const instructorFilters = [];

    const instructorId = stringId(
      booking.instructorId,
    );

    if (
      instructorId &&
      ObjectId.isValid(instructorId)
    ) {
      instructorFilters.push({
        _id: new ObjectId(instructorId),
      });
    }

    if (booking.instructorEmail) {
      instructorFilters.push({
        email: booking.instructorEmail,
      });
    }

    if (instructorFilters.length === 0) {
      return NextResponse.json(
        {
          error:
            "Instructor information is missing from this booking",
        },
        {status: 400},
      );
    }

    const instructor = await (
      await instructorsCollection()
    ).findOne({
      $or: instructorFilters,
    });

    if (!instructor) {
      return NextResponse.json(
        {error: "Instructor not found"},
        {status: 404},
      );
    }

    /*
     * Never trust the price sent by the browser.
     * Find the service and price from the instructor document.
     */
    const service = (
      instructor.services || []
    ).find(
      (item) =>
        normalizeText(item?.name) ===
        normalizeText(requestedServiceName),
    );

    if (!service) {
      return NextResponse.json(
        {
          error:
            "Selected service is not available for this instructor",
        },
        {status: 404},
      );
    }

    const servicePrice =
      service?.prices?.[durationIndex];

    const isGloballyActive =
      Boolean(
        service?.activeDurations?.[
          durationIndex
        ],
      ) && servicePrice != null;

    if (!isGloballyActive) {
      return NextResponse.json(
        {
          error:
            "Selected service duration is not currently available",
        },
        {status: 409},
      );
    }

    /*
     * Validate suburb availability exactly like booking-confirm.
     */
    const selectedSuburb =
      booking.suburb ||
      booking.location ||
      "";

    const suburbConfig = (
      instructor.suburbs || []
    ).find(
      (item) =>
        normalizeText(item?.name) ===
        normalizeText(selectedSuburb),
    );

    const suburbPackage =
      suburbConfig?.packages?.find(
        (item) =>
          normalizeText(
            item?.serviceName,
          ) === normalizeText(service.name),
      );

    if (
      suburbPackage &&
      !suburbPackage?.activeDurations?.[
        durationIndex
      ]
    ) {
      return NextResponse.json(
        {
          error:
            "Selected service duration is unavailable for this suburb",
        },
        {status: 409},
      );
    }

    const newDuration =
      DURATIONS[durationIndex].label;

    const newPrice = money(servicePrice);

    if (newPrice <= 0) {
      return NextResponse.json(
        {
          error:
            "Selected service has an invalid price",
        },
        {status: 422},
      );
    }

    /*
     * Do not allow selecting the current service again.
     */
    const sameService =
      normalizeText(booking.serviceName) ===
        normalizeText(service.name) &&
      Number(booking.minutes) ===
        requestedMinutes;

    if (sameService) {
      return NextResponse.json(
        {
          error:
            "This is already the current service. Please select another service.",
        },
        {status: 409},
      );
    }

    const invoiceNo = Number(
      booking.invoiceNo,
    );

    if (!invoiceNo) {
      return NextResponse.json(
        {
          error:
            "This booking does not have an invoice number",
        },
        {status: 409},
      );
    }

    const updatedAt = new Date();

    const filename =
      booking.invoiceFilename ||
      `invoice-${invoiceNo}.pdf`;

const invoiceKey = `invoices/${filename}`;
   

  const updateFields = {
  serviceName: service.name,
  duration: newDuration,
  minutes: requestedMinutes,

  price: newPrice,
  originalPrice: newPrice,
  overridePrice: null,
  isPriceOverridden: false,

  payableAmount: newPrice,
  outstanding: newPrice,

  paymentStatus: "unpaid",
  paymentMethod: booking.paymentMethod || "bank",

  paidAmount: 0,
  totalPaidAmount: 0,
  cardAmount: 0,
  cashAmount: 0,

  creditToUse: 0,
  creditUsed: 0,
  useClientBalance: false,

  processingFee: 0,
  paymentIntentId: null,
  cardBrand: null,
  cardLast4: null,

  invoiceFilename: filename,
  invoiceKey,
  invoiceUpdatedAt: updatedAt,

  updatedAt,
};

    /*
     * Future booking is used to generate the updated PDF.
     */
    const futureBooking = {
      ...booking,
      ...updateFields,

      bookingId: String(booking._id),
      type: "BOOKINGS_CONFIRM",
    };

    const reqUrl =
      process.env.APP_URL || req.url;

    /*
     * Generate the PDF before modifying MongoDB.
     *
     * If PDF generation fails, the original booking
     * remains unchanged.
     */
    const pdfBuffer =
      await generateInvoicePdfBuffer(
        futureBooking,
        reqUrl,
      );

    /*
     * Upload the new PDF before updating MongoDB.
     *
     * Because this uses a new key, a failed database
     * update cannot replace the booking's old PDF.
     */
    await uploadPdfToS3({
  key: invoiceKey,
  buffer: pdfBuffer,
  originalName: filename,
  folder: "invoices",
  ownerEmail:
    booking.userEmail ||
    booking.clientEmail ||
    "",
  status: "active",
});

    /*
     * Atomic update:
     * booking must still be completely unpaid.
     */
    const updateResult =
      await bookings.findOneAndUpdate(
        {
          _id: bookingObjectId,

          paymentStatus: /^unpaid$/i,

          $and: [
            zeroOrMissing("paidAmount"),
            zeroOrMissing("totalPaidAmount"),
            zeroOrMissing("cardAmount"),
            zeroOrMissing("cashAmount"),
            zeroOrMissing("creditUsed"),
            zeroOrMissing("creditToUse"),
          ],
        },
        {
          $set: updateFields,

          $push: {
            serviceChangeHistory: {
              previousServiceName:
                booking.serviceName || "",
              previousDuration:
                booking.duration || "",
              previousMinutes: Number(
                booking.minutes || 0,
              ),
              previousPrice: money(
                booking.price,
              ),

              newServiceName:
                service.name,
              newDuration,
              newMinutes:
                requestedMinutes,
              newPrice,

              changedAt: updatedAt,
            },
          },
        },
        {
          returnDocument: "after",
        },
      );

    const updatedBooking =
      getUpdatedDocument(updateResult);

    if (!updatedBooking) {
      return NextResponse.json(
        {
          error:
            "Booking payment status changed while updating. Please refresh and try again.",
        },
        {status: 409},
      );
    }

    /*
     * Build updated-service emails.
     */
    const bookingDateText =
      formatBookingDate(
        updatedBooking.bookingDate,
      );

    const bookingTimeText =
      updatedBooking.bookingTime || "";

    const customerName =
      updatedBooking.userName ||
      updatedBooking.clientName ||
      "Customer";

    const customerEmail =
      updatedBooking.userEmail ||
      updatedBooking.clientEmail ||
      "";

    const instructorName =
      updatedBooking.instructorName ||
      instructor.name ||
      "Instructor";

    const instructorEmail =
      updatedBooking.instructorEmail ||
      instructor.email ||
      "";

    const escapedCustomerName =
      escapeHtml(customerName);

    const escapedInstructorName =
      escapeHtml(instructorName);

    const escapedServiceName =
      escapeHtml(service.name);

    const escapedDuration =
      escapeHtml(newDuration);

    const escapedDate =
      escapeHtml(bookingDateText);

    const escapedTime =
      escapeHtml(bookingTimeText);

    const customerSubject =
      `Booking Service Updated - Invoice #${invoiceNo}`;

    const customerText = `Hi ${customerName},

Your booking service has been updated successfully.

Invoice: #${invoiceNo}
Service: ${service.name}
Duration: ${newDuration}
Date: ${bookingDateText}
Time: ${bookingTimeText}
Updated Total: $${newPrice.toFixed(2)}
Payment Status: Unpaid

The updated invoice is attached.

Thanks,
Test Route Driving School
`;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Booking Service Updated</h2>

        <p>Hi ${escapedCustomerName},</p>

        <p>
          Your booking service has been updated successfully.
          The updated invoice is attached.
        </p>

        <table
          cellpadding="8"
          cellspacing="0"
          style="border-collapse:collapse;width:100%;max-width:600px"
        >
          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Invoice
            </td>
            <td style="border:1px solid #ddd">
              #${invoiceNo}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Service
            </td>
            <td style="border:1px solid #ddd">
              ${escapedServiceName}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Duration
            </td>
            <td style="border:1px solid #ddd">
              ${escapedDuration}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Date
            </td>
            <td style="border:1px solid #ddd">
              ${escapedDate}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Time
            </td>
            <td style="border:1px solid #ddd">
              ${escapedTime}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Updated Total
            </td>
            <td style="border:1px solid #ddd">
              $${newPrice.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td style="border:1px solid #ddd;font-weight:bold">
              Payment
            </td>
            <td style="border:1px solid #ddd">
              Unpaid
            </td>
          </tr>
        </table>

        <p>
          Thanks,<br/>
          Test Route Driving School
        </p>
      </div>
    `;

    const instructorSubject =
      `Booking Service Changed - Invoice #${invoiceNo}`;

    const instructorText = `Hi ${instructorName},

A booking service has been changed.

Client: ${customerName}
Invoice: #${invoiceNo}
Previous Service: ${booking.serviceName || ""}
Previous Duration: ${booking.duration || ""}
New Service: ${service.name}
New Duration: ${newDuration}
Date: ${bookingDateText}
Time: ${bookingTimeText}
Updated Total: $${newPrice.toFixed(2)}

The updated invoice is attached.
`;

    const instructorHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <p>Hi ${escapedInstructorName},</p>

        <p>
          <strong>
            A booking service has been changed.
          </strong>
        </p>

        <p>
          <strong>Client:</strong>
          ${escapedCustomerName}
        </p>

        <p>
          <strong>Invoice:</strong>
          #${invoiceNo}
        </p>

        <p>
          <strong>Previous Service:</strong>
          ${escapeHtml(booking.serviceName || "")}
        </p>

        <p>
          <strong>Previous Duration:</strong>
          ${escapeHtml(booking.duration || "")}
        </p>

        <p>
          <strong>New Service:</strong>
          ${escapedServiceName}
        </p>

        <p>
          <strong>New Duration:</strong>
          ${escapedDuration}
        </p>

        <p>
          <strong>Date:</strong>
          ${escapedDate}
        </p>

        <p>
          <strong>Time:</strong>
          ${escapedTime}
        </p>

        <p>
          <strong>Updated Total:</strong>
          $${newPrice.toFixed(2)}
        </p>

        <p>
          The updated invoice is attached.
        </p>
      </div>
    `;

    /*
     * Send customer and instructor emails in parallel.
     */
    const [customerMail, instructorMail] =
      await Promise.all([
        sendAndLogEmail({
          booking: updatedBooking,
          invoiceNo,
          actorType: "USER",
          to: customerEmail,
          subject: customerSubject,
          html: customerHtml,
          text: customerText,
          pdfBuffer,
          filename,
          invoiceKey,
        }),

        sendAndLogEmail({
          booking: updatedBooking,
          invoiceNo,
          actorType: "INSTRUCTOR",
          to: instructorEmail,
          subject: instructorSubject,
          html: instructorHtml,
          text: instructorText,
          pdfBuffer,
          filename,
          invoiceKey,
        }),
      ]);

    const mailLog = {
      user: customerMail,
      instructor: instructorMail,
      sentAt: new Date(),
    };

    /*
     * Update the existing invoice record.
     *
     * Do not insert a second invoice with the same number.
     */
   await (
  await invoicesCollection()
).updateOne(
  {invoiceNo},
  {
    $set: {
      bookingId: updatedBooking._id,

      serviceName: service.name,
      duration: newDuration,
      minutes: requestedMinutes,

      total: newPrice,
      outstanding: newPrice,
      paymentStatus: "unpaid",

      filename,
      invoiceKey,

      updatedAt,
      invoiceUpdatedAt: updatedAt,
    },
  },
  {upsert: true},
);

    const emailWarnings = [];

    if (!customerMail.ok) {
      emailWarnings.push(
        customerMail.skipped
          ? "Customer email address is missing"
          : "Customer email could not be sent",
      );
    }

    if (!instructorMail.ok) {
      emailWarnings.push(
        instructorMail.skipped
          ? "Instructor email address is missing"
          : "Instructor email could not be sent",
      );
    }

    return NextResponse.json({
      ok: true,

      booking: updatedBooking,

      pdfUpdated: true,
      invoiceNo,
      invoiceKey,
      invoiceFilename: filename,

      emailSent: customerMail.ok,
      customerEmailSent: customerMail.ok,
      instructorEmailSent:
        instructorMail.ok,

      warning:
        emailWarnings.length > 0
          ? emailWarnings.join(". ")
          : undefined,

      message:
        emailWarnings.length > 0
          ? "Service and invoice updated, but one or more emails were not sent"
          : "Service, invoice and emails updated successfully",
    });
  } catch (error) {
    console.error(
      "Change booking service error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to change booking service",
      },
      {
        status: 500,
      },
    );
  }
}