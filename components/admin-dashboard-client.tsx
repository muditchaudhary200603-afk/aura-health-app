"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import {
  adminSignOut,
  AppointmentRecord,
  getAdminSession,
  getAllAppointments,
  updateAppointmentPhone,
  updateAppointmentStatus
} from "@/lib/supabase";

export function AdminDashboardClient() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    status: "All",
    date: ""
  });
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const session = await getAdminSession();
      if (!session?.adminLoggedIn) {
        router.replace("/admin/login");
        return;
      }

      const rows = await getAllAppointments();
      if (!active) return;

      setAppointments(rows);
      setLoading(false);
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  const departments = useMemo(() => ["All", ...Array.from(new Set(appointments.map((item) => item.department)))], [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const departmentMatch = filters.department === "All" || item.department === filters.department;
      const statusMatch = filters.status === "All" || item.status === filters.status;
      const dateMatch = !filters.date || item.preferred_date === filters.date;
      return departmentMatch && statusMatch && dateMatch;
    });
  }, [appointments, filters]);

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((item) => item.status === "Pending").length,
    confirmed: appointments.filter((item) => item.status === "Confirmed").length,
    cancelled: appointments.filter((item) => item.status === "Cancelled").length
  }), [appointments]);

  async function handleStatusUpdate(id: string | undefined, status: AppointmentRecord["status"]) {
    if (!id) return;

    const result = await updateAppointmentStatus(id, status);
    if (!result.success) {
      setToast({ message: result.error || "Unable to update status.", tone: "error" });
      return;
    }

    setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    setToast({ message: `Appointment marked ${status}.`, tone: "success" });
  }

  async function handlePhoneSave(id: string | undefined) {
    if (!id) return;

    const result = await updateAppointmentPhone(id, phoneDraft);
    if (!result.success) {
      setToast({ message: result.error || "Unable to update phone.", tone: "error" });
      return;
    }

    setAppointments((current) => current.map((item) => (item.id === id ? { ...item, phone: phoneDraft } : item)));
    setEditingPhoneId(null);
    setPhoneDraft("");
    setToast({ message: "Phone updated.", tone: "success" });
  }

  async function handleLogout() {
    await adminSignOut();
    router.push("/admin/login");
  }

  function exportCsv() {
    const header = ["Queue#", "Name", "Email", "Phone", "Dept", "Specialist", "Date", "Time", "Status"];
    const rows = appointments.map((item) => [
      item.queue_number,
      item.patient_name,
      item.patient_email,
      item.phone,
      item.department,
      item.specialist,
      item.preferred_date,
      item.preferred_time,
      item.status
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aura-appointments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setToast({ message: "CSV exported.", tone: "success" });
  }

  if (loading) {
    return (
      <section className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton mt-3 h-10 w-72 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-12 w-32 rounded-full" />
            <div className="skeleton h-12 w-24 rounded-full" />
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[1.5rem] bg-white px-5 py-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
              <div className="skeleton h-3 w-28 rounded" />
              <div className="skeleton mt-4 h-8 w-16 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[1.8rem] bg-white p-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton mt-3 h-12 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <section className="section-shell py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Admin Portal</p>
            <h1 className="mt-2 text-5xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">Aura Health Admin Portal</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={exportCsv} className="primary-button">
              Export CSV
            </button>
            <button type="button" onClick={handleLogout} className="outline-button">
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Appointments", stats.total, "text-[#1B4332]"],
            ["Pending", stats.pending, "text-[#8A6A16]"],
            ["Confirmed", stats.confirmed, "text-[#2D6A4F]"],
            ["Cancelled", stats.cancelled, "text-[#9B3B3B]"]
          ].map(([label, value, accent]) => (
            <article key={label} className="premium-card rounded-[1.5rem] bg-white px-5 py-6 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-sm uppercase tracking-[0.18em] text-[#1B4332]/55 dark:text-[#F5F0E8]/55">{label}</p>
              <p className={`mt-3 text-4xl font-semibold ${accent}`}>{value}</p>
            </article>
          ))}
        </div>

        <div className="premium-card mt-8 flex flex-wrap gap-2 rounded-[1.5rem] bg-white p-4 shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05] md:gap-3">
          <select className="light-input min-w-[12rem] flex-1" value={filters.department} onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <select className="light-input min-w-[12rem] flex-1" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input className="light-input min-w-[12rem] flex-1" type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
          <button type="button" onClick={() => setFilters({ department: "All", status: "All", date: "" })} className="outline-button whitespace-nowrap">
            Clear
          </button>
        </div>

        <div className="premium-card mt-8 overflow-hidden rounded-[1.8rem] bg-white shadow-lg dark:border dark:border-white/10 dark:bg-white/[0.05]">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="min-w-[640px] md:min-w-full">
              <thead>
                <tr className="border-b border-[#1B4332]/10 text-left text-xs uppercase tracking-[0.18em] text-[#1B4332]/62 dark:border-white/10 dark:text-[#F5F0E8]/62">
                  {["Queue#", "Patient", "Email", "Phone", "Dept", "Specialist", "Date", "Time", "Status", "Actions"].map((label) => (
                    <th key={label} className="px-4 py-4">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((item) => (
                  <tr key={item.id} className="border-b border-[#1B4332]/8 align-top text-sm text-[#1B4332] dark:border-white/8 dark:text-[#F5F0E8]">
                    <td className="px-4 py-4 font-bold text-[#1B4332] dark:text-[#F5F0E8]">{item.queue_number}</td>
                    <td className="px-4 py-4">{item.patient_name}</td>
                    <td className="px-4 py-4">{item.patient_email}</td>
                    <td className="px-4 py-4">
                      {editingPhoneId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input className="light-input !rounded-xl !px-3 !py-2" value={phoneDraft} onChange={(event) => setPhoneDraft(event.target.value)} />
                          <button type="button" className="primary-button !px-4 !py-2" onClick={() => handlePhoneSave(item.id)}>
                            Save
                          </button>
                        </div>
                      ) : (
                        item.phone
                      )}
                    </td>
                    <td className="px-4 py-4">{item.department}</td>
                    <td className="px-4 py-4">{item.specialist}</td>
                    <td className="px-4 py-4">{item.preferred_date}</td>
                    <td className="px-4 py-4">{item.preferred_time}</td>
                    <td className="px-4 py-4">
                      <span className={`status-badge ${item.status === "Pending" ? "status-pending" : item.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-full bg-[#2D6A4F] px-3 py-2 text-xs font-semibold text-white" onClick={() => handleStatusUpdate(item.id, "Confirmed")}>
                          Confirm
                        </button>
                        <button type="button" className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white dark:bg-red-500" onClick={() => handleStatusUpdate(item.id, "Cancelled")}>
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[#1B4332]/15 px-3 py-2 text-xs font-semibold dark:border-white/12"
                          onClick={() => {
                            setEditingPhoneId(item.id ?? null);
                            setPhoneDraft(item.phone);
                          }}
                        >
                          Edit Phone
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
