"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import { signUp, supabase } from "@/lib/supabase";
import { Ripple } from "@/components/ui/material-design-3-ripple";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-5
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-500"];

export function AuthSignupClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setToast({ message: "Please complete every field.", tone: "error" });
      return;
    }

    if (form.password.length < 6) {
      setToast({ message: "Password must be at least 6 characters.", tone: "error" });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setToast({ message: "Passwords do not match.", tone: "error" });
      return;
    }

    setLoading(true);
    const result = await signUp(form.name, form.email, form.phone, form.password);
    setLoading(false);

    if (result.error) {
      setToast({ message: result.error, tone: "error" });
      return;
    }

    setToast({ message: "Account created successfully.", tone: "success" });
    window.setTimeout(() => router.push("/dashboard"), 900);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://aura-health-at5hvlysu-muditchaudhary200603-1727s-projects.vercel.app/"
      }
    });

    if (error) {
      setLoading(false);
      setToast({ message: error.message, tone: "error" });
    }
  }

  return (
    <>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <section className="auth-shell">
        <div className="glass-card w-full max-w-xl rounded-[2rem] px-6 py-8 text-white sm:px-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F5F0E8] text-xl font-bold text-[#1B4332]">AH</div>
            <h1 className="mt-4 text-4xl font-semibold">Create your patient account</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#F5F0E8]/75">Clinical Sanctuary</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="signup-name">
              <span className="field-label text-white">Full Name</span>
              <input id="signup-name" className="light-input" required autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label htmlFor="signup-email">
              <span className="field-label text-white">Email</span>
              <input id="signup-email" className="light-input" type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label htmlFor="signup-phone">
              <span className="field-label text-white">Phone</span>
              <input id="signup-phone" className="light-input" required autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </label>
            <label htmlFor="signup-password">
              <span className="field-label text-white">Password</span>
              <input id="signup-password" className="light-input" type="password" required minLength={6} autoComplete="new-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition ${i < passwordStrength ? strengthColors[passwordStrength] : "bg-white/20"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[#F5F0E8]/70">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
            </label>
            <label htmlFor="signup-confirm">
              <span className="field-label text-white">Confirm Password</span>
              <input id="signup-confirm" className="light-input" type="password" required minLength={6} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} />
            </label>

            <button type="submit" className="relative overflow-hidden primary-button w-full transition hover:scale-[1.02]" disabled={loading}>
              <Ripple color="text-white" opacity={0.15} />
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? <Spinner /> : null}
                <span>{loading ? "Creating..." : "Create Account"}</span>
              </div>
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="relative overflow-hidden mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white px-6 py-3 font-semibold text-[#1B4332] transition hover:scale-[1.02]"
          >
            <Ripple color="text-[#1B4332]" opacity={0.1} />
            <div className="relative z-10 flex items-center gap-3 pointer-events-none">
              <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Continue with Google</span>
            </div>
          </button>

          <p className="mt-6 text-center text-sm text-[#F5F0E8]/82">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-white underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
