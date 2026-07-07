import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_ONLY_PREFIXES = ["/vadeli", "/kasa", "/banka", "/dashboard", "/kullanicilar"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/cariler",
  "/islemler",
  "/vadeli",
  "/kasa",
  "/banka",
  "/kullanicilar",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const session = req.auth;
  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  if (isAdminOnly && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/islemler", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cariler/:path*",
    "/islemler/:path*",
    "/vadeli/:path*",
    "/kasa/:path*",
    "/banka/:path*",
    "/kullanicilar/:path*",
  ],
};
