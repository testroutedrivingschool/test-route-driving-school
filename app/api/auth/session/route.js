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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ verify firebase idToken
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ get user from Mongo (where role is stored)
    const col = await usersCollection();
    const dbUser = await col.findOne({ email });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ store minimal safe data in cookie
    const cookieUser = {
      email: dbUser.email,
      role: dbUser.role,
      name: dbUser.name || "",
    };

    const res = NextResponse.json({ ok: true });

    // HttpOnly cookie (middleware can read)
    res.cookies.set("user", encodeURIComponent(JSON.stringify(cookieUser)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
