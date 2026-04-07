"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import { AppointmentRecord, getAppointmentsByEmail, getSession, signOut, updateAppointmentStatus } from "@/lib/supabase";
import { Ripple } from "@/components/ui/material-design-3-ripple";

type SessionRecord = Awaited<ReturnType<typeof getSession>>;

export function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<SessionRecord>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      const currentSession = await getSession();
      if (!currentSession) {
        router.replace("/auth/signin");
        return;
      }

      const rows = await getAppointmentsByEmail(currentSession.userEmail);
      if (!active) return;

      setSession(currentSession);
      setAppointments(rows);
      setLoading(false);
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, [router]);

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((item) => item.status === "Pending").length,
    confirmed: appointments.filter((item) => item.status === "Confirmed").length,
    cancelled: appointments.filter((item) => item.status === "Cancelled").length
  }), [appointments]);

  async function handleLogout() {
    await signOut();
    router.push("/auth/signin");
  }

  async function handleCancel(id?: string) {
    if (!id) return;

    const result = await updateAppointmentStatus(id, "Cancelled");
    if (!result.success) {
      setToast({ message: result.error || "Unable to cancel appointment.", tone: "error" });
      return;
    }

    setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item)));
    setToast({ message: "Appointment cancelled.", tone: "success" });
  }

  if (loading) {
    return (
      <section className="section-shell py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="skeleton h-3 w-28 rounded" />
            <div className="skeleton mt-3 h-10 w-64 rounded-xl" />
          </div>
          <div className="skeleton h-12 w-24 rounded-full" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[1.5rem] bg-white px-5 py-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton mt-4 h-8 w-12 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-[1.8rem] bg-white p-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-start gap-5">
                <div className="skeleton h-20 w-20 rounded-[1.4rem]" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-6 w-40 rounded" />
                  <div className="skeleton h-4 w-28 rounded" />
                  <div className="skeleton h-3 w-36 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <section className="section-shell py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Patient Dashboard</p>
            <h1 className="mt-2 text-5xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">Welcome back, {session?.userName}</h1>
          </div>
          <button type="button" onClick={handleLogout} className="relative overflow-hidden outline-button">
            <Ripple color="text-current" opacity={0.1} />
            <span className="relative z-10 pointer-events-none">Logout</span>
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total", stats.total, "text-[#1B4332]"],
            ["Pending", stats.pending, "text-[#8A6A16]"],
            ["Confirmed", stats.confirmed, "text-[#2D6A4F]"],
            ["Cancelled", stats.cancelled, "text-[#9B3B3B]"]
          ].map(([label, value, accent]) => (
            <article key={label} className="premium-card rounded-[1.5rem] bg-white px-5 py-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-sm uppercase tracking-[0.18em] text-[#1B4332]/55 dark:text-[#F5F0E8]/60">{label}</p>
              <p className={`mt-3 text-4xl font-semibold ${accent}`}>{value}</p>
            </article>
          ))}
        </div>

        {appointments.length ? (
          <div className="mt-10 grid gap-5">
            {appointments.map((appointment) => (
              <article key={appointment.id} className="premium-card rounded-[1.8rem] bg-white p-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="rounded-[1.4rem] bg-[#F5F0E8] px-5 py-4 text-center dark:bg-white/[0.06]">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#2D6A4F]/70 dark:text-[#95D5B2]/82">Queue</p>
                      <p className="mt-2 text-4xl font-bold text-[#1B4332] dark:text-[#F5F0E8]">{appointment.queue_number}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">{appointment.department}</h2>
                      <p className="text-[#1B4332]/72 dark:text-[#F5F0E8]/60">{appointment.specialist}</p>
                      <p className="text-sm text-[#1B4332]/62 dark:text-[#F5F0E8]/60">
                        {appointment.preferred_date} at {appointment.preferred_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <span className={`status-badge ${appointment.status === "Pending" ? "status-pending" : appointment.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}`}>
                      {appointment.status}
                    </span>
                    {appointment.status === "Pending" ? (
                      <button type="button" onClick={() => handleCancel(appointment.id)} className="relative overflow-hidden rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-400/30 dark:text-red-300">
                        <Ripple color="text-red-500" opacity={0.1} />
                        <span className="relative z-10 pointer-events-none">Cancel</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="premium-card mt-10 rounded-[1.8rem] bg-white px-6 py-10 text-center shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="text-3xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">No appointments yet.</h2>
            <p className="mt-3 text-[#1B4332]/68 dark:text-[#F5F0E8]/60">Book your first visit.</p>
            <Link href="/contact" className="relative overflow-hidden primary-button mt-6">
              <Ripple color="text-white" opacity={0.15} />
              <span className="relative z-10 pointer-events-none">Book Visit</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

