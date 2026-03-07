import { admin } from "@/app/libs/firebase/firebase.admin";
import { usersCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1]
      : null;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded?.email;

    if (!email) {
      return NextResponse.json({ error: "Token has no email" }, { status: 401 });
    }

    const col = await usersCollection();
    const dbUser = await col.findOne({ email });

    if (!dbUser) {
      return NextResponse.json(
        { error: `User not found in DB for email: ${email}` },
        { status: 404 }
      );
    }

    const cookieUser = {
      email: dbUser.email,
      role: dbUser.role,
      name: dbUser.name || "",
    };

    const res = NextResponse.json({ ok: true, user: cookieUser });

    res.cookies.set("user", encodeURIComponent(JSON.stringify(cookieUser)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("SESSION ROUTE ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create session" },
      { status: 500 }
    );
  }
}