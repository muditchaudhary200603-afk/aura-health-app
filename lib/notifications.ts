import { Resend } from "resend";

type AppointmentNotification = {
  id: number;
  name: string;
  email: string;
  phone: string;
  departmentOrService: string;
  message: string;
  specialistSlug: string | null;
  preferredDate: string | null;
  triageSummary?: string | null;
};

export async function sendAppointmentNotification(payload: AppointmentNotification) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const adminEmail = process.env.AURA_ADMIN_EMAIL?.trim();

  if (!apiKey || !adminEmail) {
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const preferredDateLabel = payload.preferredDate
      ? new Date(payload.preferredDate).toLocaleString()
      : "Flexible";

    const triageBlock = payload.triageSummary ? `\n\nAI triage\n${payload.triageSummary}` : "";

    await resend.emails.send({
      from: "Aura Health <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Aura appointment request #${payload.id}`,
      text: [
        `Patient: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Service: ${payload.departmentOrService}`,
        `Specialist: ${payload.specialistSlug || "No preference"}`,
        `Preferred time: ${preferredDateLabel}`,
        "",
        "Message",
        payload.message,
        triageBlock
      ]
        .filter(Boolean)
        .join("\n")
    });
  } catch {
    // Email delivery is best-effort and should not block booking.
  }
}
