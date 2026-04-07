import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPatientSession = request.cookies.get("aura_patient_session")?.value === "1";
  const hasAdminSession = Boolean(request.cookies.get("aura_admin_session")?.value);

  if (pathname.startsWith("/dashboard") && !hasPatientSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (pathname.startsWith("/admin/dashboard") && !hasAdminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/dashboard/:path*"]
};
