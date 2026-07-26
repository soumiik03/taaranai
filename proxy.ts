import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PATH = "/dashboard";
const SIGN_IN_PATH = "/sign-in";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (pathname.startsWith(DASHBOARD_PATH) && !sessionCookie) {
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("callbackURL", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === SIGN_IN_PATH && sessionCookie) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};