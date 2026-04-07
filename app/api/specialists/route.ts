import { NextRequest, NextResponse } from "next/server";
import { getSpecialists } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const specialty = request.nextUrl.searchParams.get("specialty") ?? undefined;

  return NextResponse.json({
    specialists: await getSpecialists({
      search,
      specialty
    })
  });
}
