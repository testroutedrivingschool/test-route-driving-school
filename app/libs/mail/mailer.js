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

export async function sendMailWithPdf({
  to,
  cc,
  bcc,
  subject,
  html,
  text,
  pdfBuffer,
  filename,
  inlineLogoPath, 
}) {
  const attachments = [];

  if (pdfBuffer) {
    attachments.push({
      filename: filename || "report.pdf",
      content: pdfBuffer,
      contentType: "application/pdf",
    });
  }

  // ✅ inline logo
  if (inlineLogoPath) {
    attachments.push({
      filename: "test-route-driving-school-logo.png",
      path: inlineLogoPath,
      cid: "companylogo",
    });
  }

  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    cc: cc || undefined,
    bcc: bcc || undefined,
    subject,
    html,
    text,
    attachments,
  });
}



export async function sendMail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
}
