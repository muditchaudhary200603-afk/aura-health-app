import { NextResponse } from "next/server";
import { getServices } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    services: await getServices()
  });
}
