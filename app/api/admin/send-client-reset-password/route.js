import { admin } from "@/app/libs/firebase/firebase.admin";
import { sendMail } from "@/app/libs/mail/mailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name = "", email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Client email required" },
        { status: 400 }
      );
    }

    // Make sure firebase user exists (optional but useful)
    try {
      await admin.auth().getUserByEmail(email);
    } catch {
      return NextResponse.json(
        { error: "No account found for this email. Send Login Email first." },
        { status: 404 }
      );
    }

    const resetLink = await admin.auth().generatePasswordResetLink(email);

    await sendMail({
      to: email,
      subject: "Reset your password – Test Route Driving School",
      html: `
        <div style="font-family:Arial,sans-serif; line-height:1.6">
          <h2>Hello ${name || ""},</h2>
          <p>We received a request to reset your password.</p>
          <p>Click below to reset it:</p>

          <p style="margin:20px 0">
            <a href="${resetLink}"
               style="background:#f97316;color:#fff;padding:12px 20px;
                      text-decoration:none;border-radius:6px;display:inline-block"
               target="_blank">
              Reset Password
            </a>
          </p>

          <p>If the button doesn’t work, copy and paste this link:</p>
          <p style="font-size:12px;color:#555">${resetLink}</p>

          <p>If you didn’t request this, you can ignore this email.</p>
          <br/>
          <p>— Test Route Driving School</p>
        </div>
      `,
      text: `Reset your password using this link: ${resetLink}`,
    });

    return NextResponse.json({ message: "Reset link sent" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
