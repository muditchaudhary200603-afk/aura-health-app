import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { getAppointments, getAppointmentSummary } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("aura_admin_session")?.value;

  if (!verifyAdminSession(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? "all";

  return NextResponse.json({
    appointments: await getAppointments({ status }),
    summary: await getAppointmentSummary()
  });
}
