import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const appointment = (await request.json()) as {
      patient_name: string;
      patient_email: string;
      department: string;
      specialist: string;
      preferred_date: string;
      preferred_time: string;
      queue_number: string;
      status: string;
    };

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: appointment.patient_email,
      subject: `Aura Health - Queue #${appointment.queue_number} Confirmed`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#F5F0E8; padding:32px; color:#1B4332;">
          <div style="max-width:640px; margin:0 auto; background:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow:0 16px 48px rgba(27,67,50,0.12);">
            <div style="background:#1B4332; color:#F5F0E8; padding:24px 28px;">
              <div style="font-size:28px; font-family: 'Playfair Display', Georgia, serif;">Aura Health</div>
              <div style="letter-spacing:0.24em; text-transform:uppercase; font-size:12px; opacity:0.8;">Clinical Sanctuary</div>
            </div>
            <div style="padding:28px;">
              <p>Dear ${appointment.patient_name},</p>
              <p>Your appointment request has been received.</p>
              <p style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#2D6A4F;">Your Queue Number</p>
              <div style="display:inline-block; margin:10px 0 20px; padding:14px 22px; border-radius:16px; background:#95D5B2; color:#1B4332; font-size:34px; font-weight:800;">
                ${appointment.queue_number}
              </div>
              <table style="width:100%; border-collapse:collapse; margin-top:8px;">
                <tr><td style="padding:6px 0; color:#2D6A4F;">Department:</td><td style="padding:6px 0;">${appointment.department}</td></tr>
                <tr><td style="padding:6px 0; color:#2D6A4F;">Specialist:</td><td style="padding:6px 0;">${appointment.specialist}</td></tr>
                <tr><td style="padding:6px 0; color:#2D6A4F;">Date:</td><td style="padding:6px 0;">${appointment.preferred_date}</td></tr>
                <tr><td style="padding:6px 0; color:#2D6A4F;">Time:</td><td style="padding:6px 0;">${appointment.preferred_time}</td></tr>
                <tr><td style="padding:6px 0; color:#2D6A4F;">Status:</td><td style="padding:6px 0;">${appointment.status}</td></tr>
              </table>
              <p style="margin-top:18px;">Please arrive 15 minutes before your appointment.</p>
              <p>Questions? Call us: +1 (800) AURA</p>
            </div>
            <div style="border-top:1px solid rgba(27,67,50,0.1); padding:20px 28px; color:#1B4332; background:#F5F0E8;">
              <div>1200 Wellness Blvd, Aura Heights, SC 90210</div>
              <div>care@aurahealth.clinical</div>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, queueNumber: appointment.queue_number });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to send confirmation email." },
      { status: 500 }
    );
  }
}
