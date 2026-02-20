import { NextResponse } from "next/server";
import { admin } from "@/app/libs/firebase/firebase.admin";
import { usersCollection, clientsCollection } from "@/app/libs/mongodb/db";
import { sendMail } from "@/app/libs/mail/mailer";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name = "", email, role = "user", clientId } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Client email required" },
        { status: 400 }
      );
    }

    // 1) Create Firebase user if not exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: name,
      });
    }

    // 2) Password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    await sendMail({
      to: email,
      subject: "Set up your account – Test Route Driving School",
      html: `
        <div style="font-family:Arial,sans-serif; line-height:1.6">
          <h2>Hello ${name || ""},</h2>
          <p>Your account has been created on <b>Test Route Driving School</b>.</p>
          <p>Please click the button below to set your password:</p>

          <p style="margin:20px 0">
            <a href="${resetLink}"
              style="background:#2563eb;color:#fff;padding:12px 20px;
                      text-decoration:none;border-radius:6px;display:inline-block"
              target="_blank">
              Set Password
            </a>
          </p>

          <p>If the button doesn’t work, copy and paste this link:</p>
          <p style="font-size:12px;color:#555">${resetLink}</p>

          <p>If you didn’t request this, you can ignore this email.</p>
          <br/>
          <p>— Test Route Driving School</p>
        </div>
      `,
      text: `Set your password using this link: ${resetLink}`,
    });

    // 3) Sync Mongo users collection
    const userCol = await usersCollection();
    await userCol.updateOne(
      { email },
      {
        $set: {
          uid: userRecord.uid,
          name,
          email,
          role,
          provider: "Credential",
          loginAccess: true,
          lastLogin: new Date(),
          emailScheduleTime:"00:00",
          clientId
        },
        $setOnInsert: { registeredAt: new Date() },
      },
      { upsert: true }
    );

    // 4) ✅ Sync Mongo clients collection too
    if (clientId && ObjectId.isValid(clientId)) {
      const clientCol = await clientsCollection();
      await clientCol.updateOne(
        { _id: new ObjectId(clientId) },
        { $set: { loginAccess: true, updatedAt: new Date() } }
      );
    }

    return NextResponse.json(
      { message: "Client login enabled and email sent" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to enable login" },
      { status: 500 }
    );
  }
}
