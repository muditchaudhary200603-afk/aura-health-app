"use client";

import { useMemo, useState } from "react";
import type { AppointmentRecord } from "@/lib/db";
import { formatPreferredDate } from "@/lib/utils";

const statusOptions = ["new", "contacted", "scheduled", "closed"] as const;
type AppointmentStatus = (typeof statusOptions)[number];
type Appointment = AppointmentRecord & { status: AppointmentStatus };

export function AdminDashboard({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState<"all" | Appointment["status"]>("all");

  const visibleItems = useMemo(
    () => appointments.filter((item) => filter === "all" || item.status === filter),
    [appointments, filter]
  );

  const counts = useMemo(
    () =>
      appointments.reduce<Record<string, number>>(
        (accumulator, item) => {
          accumulator[item.status] += 1;
          return accumulator;
        },
        { new: 0, contacted: 0, scheduled: 0, closed: 0 }
      ),
    [appointments]
  );

  async function updateStatus(id: number, status: Appointment["status"]) {
    const response = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-[1.6rem] border px-5 py-5 text-left transition ${
              filter === status
                ? "border-pine bg-pine text-mist"
                : "border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            }`}
          >
            <div className="eyebrow text-current">{status}</div>
            <div className="mt-4 text-4xl font-semibold">{counts[status]}</div>
          </button>
        ))}
      </div>

      <div className="premium-card overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="eyebrow">Queue</div>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Show all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Request</th>
                <th>Timing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="space-y-1">
                      <div className="font-semibold">{item.name}</div>
                      <div>{item.email}</div>
                      <div>{item.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-2">
                      <div className="font-medium">{item.departmentOrService}</div>
                      <div>{item.specialistSlug ? `Prefers: ${item.specialistSlug}` : "No specialist preference"}</div>
                      <p className="max-w-md text-slate-500 dark:text-slate-400">{item.message}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div>{new Date(item.createdAt).toLocaleString()}</div>
                      <div>{formatPreferredDate(item.preferredDate)}</div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(event) => updateStatus(item.id, event.target.value as Appointment["status"])}
                      className="rounded-full border border-slate-300 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] dark:border-slate-700"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
