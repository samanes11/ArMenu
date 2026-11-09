import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "dishar_session";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-only-insecure-secret-change-me");
const PROTECTED = ["/dashboard", "/onboarding"];
const AUTH_PAGES = ["/login", "/register"];

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  if (!isProtected && !isAuthPage) return NextResponse.next();

  const authed = await hasValidSession(req);
  const url = req.nextUrl.clone();
  if (isProtected && !authed) {
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isAuthPage && authed) {
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/register"] };
