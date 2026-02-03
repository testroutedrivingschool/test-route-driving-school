import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  /* ================= PROTECTED ROUTES ================= */
  const protectedPaths = [
    "/dashboard",
    "/instructor",
    "/instructor-bookings",
    "/instructor-reports",
    "/clients",
  ];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  /* ================= AUTH CHECK ================= */
  const userCookie = req.cookies.get("user");
  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let user;
  try {
    user = JSON.parse(decodeURIComponent(userCookie.value));
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = user?.role;

  if (!["user", "admin", "instructor"].includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  /* ================= ROOT DASHBOARD REDIRECT ================= */
  if (pathname === "/dashboard") {
    const redirectTo =
      role === "admin"
        ? "/dashboard/admin"
        : role === "instructor"
        ? "/dashboard/instructor"
        : "/dashboard/user";

    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  /* ================= USER ================= */
  if (role === "user") {
    if (!pathname.startsWith("/dashboard/user")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  /* ================= INSTRUCTOR ================= */
  if (role === "instructor") {
    const allowedInstructorPaths = [
      "/dashboard/instructor",
      "/instructor",
      "/instructor-bookings",
      "/instructor-reports",
      "/clients",
    ];

    const allowed = allowedInstructorPaths.some((p) =>
      pathname.startsWith(p)
    );

    if (!allowed) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  /* ================= ADMIN ================= */
  if (role === "admin") {
    if (!pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/instructor/:path*",
    "/instructor-bookings",
    "/instructor-reports",
    "/clients",
  ],
};
