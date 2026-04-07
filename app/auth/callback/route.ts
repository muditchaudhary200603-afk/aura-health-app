import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const target = new URL("/auth/signin", request.url);

  if (code) {
    target.searchParams.set("code", code);
  }

  return NextResponse.redirect(target);
}
