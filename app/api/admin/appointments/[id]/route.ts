import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { updateAppointmentStatus } from "@/lib/db";

export const runtime = "nodejs";

const allowedStatuses = new Set(["new", "contacted", "scheduled", "closed"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get("aura_admin_session")?.value;

  if (!verifyAdminSession(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { status?: string };
  const status = payload.status?.trim() ?? "";
  const id = Number(params.id);

  if (!Number.isFinite(id) || !allowedStatuses.has(status)) {
    return NextResponse.json({ message: "Invalid update request." }, { status: 400 });
  }

  await updateAppointmentStatus(id, status);

  return NextResponse.json({ message: "Appointment updated." });
}
