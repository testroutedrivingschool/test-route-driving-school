import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // port 587 => false (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMailWithPdf({ to, subject, html, text, pdfBuffer, filename }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
    attachments: pdfBuffer
      ? [
          {
            filename: filename || "invoice.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : [],
  });
}
