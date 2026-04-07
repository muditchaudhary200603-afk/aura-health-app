"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import { AppointmentRecord, getQueueNumber, getSession, saveAppointment } from "@/lib/supabase";
import { Ripple } from "@/components/ui/material-design-3-ripple";

type ServiceOption = {
  slug: string;
  name: string;
};

type SpecialistOption = {
  slug: string;
  name: string;
};

type ConfirmationState = {
  queueNumber: string;
  department: string;
  preferredDate: string;
  preferredTime: string;
};

export function AppointmentForm({
  services,
  specialists,
  initialService,
  initialSpecialist,
  ctaLabel
}: {
  services: ServiceOption[];
  specialists: SpecialistOption[];
  initialService?: string;
  initialSpecialist?: string;
  ctaLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
  const [form, setForm] = useState({
    patientName: "",
    patientEmail: "",
    phone: "",
    department: initialService || services[0]?.name || "",
    specialist: initialSpecialist || specialists[0]?.name || "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.patientName || !form.patientEmail || !form.phone || !form.department || !form.specialist || !form.preferredDate || !form.preferredTime) {
      setToast({ message: "Please complete all required fields.", tone: "error" });
      return;
    }

    setLoading(true);
    const currentSession = await getSession();
    const queueNumber = await getQueueNumber(form.preferredDate, form.department);

    const appointment: AppointmentRecord = {
      patient_id: currentSession?.userId ?? null,
      patient_name: form.patientName,
      patient_email: form.patientEmail,
      phone: form.phone,
      department: form.department,
      specialist: form.specialist,
      preferred_date: form.preferredDate,
      preferred_time: form.preferredTime,
      queue_number: queueNumber,
      status: "Pending"
    };

    const saveResult = await saveAppointment(appointment);
    if (saveResult.error) {
      setLoading(false);
      setToast({ message: saveResult.error, tone: "error" });
      return;
    }


    setLoading(false);
    setConfirmation({
      queueNumber,
      department: form.department,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime
    });
    setToast({ message: "Appointment requested successfully.", tone: "success" });
  }

  function resetForm() {
    setForm({
      patientName: "",
      patientEmail: "",
      phone: "",
      department: initialService || services[0]?.name || "",
      specialist: initialSpecialist || specialists[0]?.name || "",
      preferredDate: "",
      preferredTime: "",
      message: ""
    });
    setConfirmation(null);
  }

  return (
    <>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}

      <form onSubmit={handleSubmit} className="premium-card rounded-[2rem] bg-white p-6 shadow-xl dark:border dark:border-white/10 dark:bg-[rgba(15,35,27,0.88)] sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Book Your Visit</p>
          <h2 className="mt-3 text-4xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">Request an appointment</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label htmlFor="apt-name">
            <span className="light-label">Full Name</span>
            <input id="apt-name" className="light-input" required value={form.patientName} onChange={(event) => update("patientName", event.target.value)} />
          </label>
          <label htmlFor="apt-email">
            <span className="light-label">Email</span>
            <input id="apt-email" className="light-input" type="email" required value={form.patientEmail} onChange={(event) => update("patientEmail", event.target.value)} />
          </label>
          <label htmlFor="apt-phone">
            <span className="light-label">Phone</span>
            <input id="apt-phone" className="light-input" required value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label htmlFor="apt-dept">
            <span className="light-label">Department</span>
            <select id="apt-dept" className="light-input" value={form.department} onChange={(event) => update("department", event.target.value)}>
              {services.map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="apt-specialist">
            <span className="light-label">Specialist</span>
            <select id="apt-specialist" className="light-input" value={form.specialist} onChange={(event) => update("specialist", event.target.value)}>
              {specialists.map((specialist) => (
                <option key={specialist.slug} value={specialist.name}>
                  {specialist.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="apt-date">
            <span className="light-label">Preferred Date</span>
            <input id="apt-date" className="light-input" type="date" required min={minDate} value={form.preferredDate} onChange={(event) => update("preferredDate", event.target.value)} />
          </label>
          <label htmlFor="apt-time">
            <span className="light-label">Preferred Time</span>
            <input id="apt-time" className="light-input" type="time" required value={form.preferredTime} onChange={(event) => update("preferredTime", event.target.value)} />
          </label>
          <label htmlFor="apt-notes" className="md:col-span-2">
            <span className="light-label">Notes</span>
            <textarea id="apt-notes" className="light-input min-h-[120px]" value={form.message} onChange={(event) => update("message", event.target.value)} />
          </label>
        </div>

        <button type="submit" className="relative overflow-hidden primary-button mt-6 w-full" disabled={loading}>
          <Ripple color="text-white" opacity={0.15} />
          <div className="relative z-10 flex items-center justify-center space-x-2">
            {loading ? <Spinner /> : null}
            <span>{loading ? "Submitting..." : ctaLabel || "Submit Request"}</span>
          </div>
        </button>
      </form>

      {confirmation ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="premium-card w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#95D5B2] text-xl font-bold text-[#1B4332]">OK</div>
            <h3 className="mt-5 text-4xl font-semibold text-[#1B4332]">Appointment Requested</h3>
            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#1B4332]/55">Your Queue Number</p>
            <p className="mt-2 text-[4rem] font-bold leading-none text-[#1B4332]">{confirmation.queueNumber}</p>

            <div className="mt-6 space-y-3 text-left text-[#1B4332]/82">
              <p>Department: {confirmation.department}</p>
              <p>Date: {confirmation.preferredDate}</p>
              <p>Time: {confirmation.preferredTime}</p>
            </div>

            <p className="mt-5 text-sm text-[#1B4332]/55">Confirmation email sent.</p>

            <div className="mt-6 grid gap-3">
              <button type="button" className="relative overflow-hidden primary-button w-full" onClick={() => router.push("/dashboard")}>
                <Ripple color="text-white" opacity={0.15} />
                <span className="relative z-10 pointer-events-none">View My Appointments</span>
              </button>
              <button type="button" className="relative overflow-hidden outline-button w-full !text-[#1B4332] !border-[#1B4332]/10" onClick={resetForm}>
                <Ripple color="text-current" opacity={0.1} />
                <span className="relative z-10 pointer-events-none">Book Another</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

