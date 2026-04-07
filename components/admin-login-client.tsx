"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import { adminSignIn } from "@/lib/supabase";

export function AdminLoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const result = await adminSignIn(form.email, form.password);
    setLoading(false);

    if (!result.success) {
      setToast({ message: result.error || "Invalid staff credentials.", tone: "error" });
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <section className="auth-shell">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#95D5B2]/22 bg-[linear-gradient(160deg,rgba(34,86,64,0.96),rgba(17,49,38,0.98))] px-6 py-8 text-white shadow-[0_35px_100px_rgba(149,213,178,0.16)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#95D5B2]">Staff Portal</p>
          <h1 className="mt-3 text-4xl font-semibold">Aura Health Admin</h1>
          <p className="mt-3 text-sm leading-6 text-white/72">
            Staff access supports both your configured admin email and the standard clinic admin login.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="admin-email">
              <span className="field-label text-white">Email</span>
              <input id="admin-email" className="auth-input" type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label htmlFor="admin-password">
              <span className="field-label text-white">Password</span>
              <input id="admin-password" className="auth-input" type="password" required autoComplete="current-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            </label>

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#95D5B2] px-6 py-3 font-semibold text-[#1B4332] transition hover:scale-[1.02]">
              {loading ? <Spinner className="h-4 w-4 text-[#1B4332]" /> : null}
              <span>{loading ? "Signing in..." : "Access Portal"}</span>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
