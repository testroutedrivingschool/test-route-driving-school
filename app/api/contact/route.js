// app/api/contact/route.js
import { sendMail } from "@/app/libs/mail/mailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      postcode,
      phone,
      email,
      lessonType,
      message,
      source,
      consent,
    } = body;



    const subject = `New Contact Form Submission - ${firstName} ${lastName}`;

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Postcode:</strong> ${postcode}</p>
      <p><strong>Lesson Type:</strong> ${lessonType}</p>
      <p><strong>How they found you:</strong> ${source || "-"}</p>
      <p><strong>Marketing consent:</strong> ${consent ? "Yes" : "No"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, "<br/>")}</p>
    `;

    await sendMail({
      to: "testroutedrivingschool@gmail.com",
      subject,
      html,
      text: `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Postcode: ${postcode}
Lesson Type: ${lessonType}
How they found you: ${source || "-"}
Marketing consent: ${consent ? "Yes" : "No"}

Message:
${message}
      `,
    });

    return NextResponse.json({ ok: true, message: "Sent successfully" });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Server error sending email." },
      { status: 500 }
    );
  }
}