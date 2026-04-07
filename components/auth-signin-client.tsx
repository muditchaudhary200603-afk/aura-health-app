"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import { Toast } from "@/components/toast";
import { completeGoogleSignIn, signIn, supabase } from "@/lib/supabase";
import { Ripple } from "@/components/ui/material-design-3-ripple";

export function AuthSigninClient({ code }: { code?: string }) {
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

  useEffect(() => {
    if (!code) {
      return;
    }

    let active = true;
    const oauthCode = code;

    async function finishOAuth() {
      setLoading(true);
      const result = await completeGoogleSignIn(oauthCode);
      if (!active) return;

      setLoading(false);

      if (!result.success) {
        setToast({ message: result.error || "Google sign-in failed.", tone: "error" });
        return;
      }

      router.replace("/dashboard");
    }

    void finishOAuth();

    return () => {
      active = false;
    };
  }, [code, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const result = await signIn(form.email, form.password);
    setLoading(false);

    if (!result.success) {
      setToast({ message: result.error || "Invalid credentials.", tone: "error" });
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
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
        <div className="glass-card w-full max-w-lg rounded-[2rem] px-6 py-8 text-white sm:px-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F5F0E8] text-xl font-bold text-[#1B4332]">AH</div>
            <h1 className="mt-4 text-4xl font-semibold">Sign in to Aura Health</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#F5F0E8]/75">Clinical Sanctuary</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="signin-email">
              <span className="field-label text-white">Email</span>
              <input
                id="signin-email"
                className="light-input"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label htmlFor="signin-password">
              <span className="field-label text-white">Password</span>
              <input
                id="signin-password"
                className="light-input"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </label>

            <button type="submit" className="relative overflow-hidden primary-button w-full transition hover:scale-[1.02]" disabled={loading}>
              <Ripple color="text-white" opacity={0.15} />
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? <Spinner /> : null}
                <span>{loading ? "Signing in..." : "Sign In"}</span>
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
              {/* Google official SVG logo */}
              <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Continue with Google</span>
            </div>
          </button>

          <div className="mt-6 text-center text-sm text-[#F5F0E8]/82">
            <Link href="/auth/signup" className="font-semibold text-white underline underline-offset-4">
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
