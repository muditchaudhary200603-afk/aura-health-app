import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function createServerSupabase() {
  return supabase;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  created_at: string;
}

export interface SessionRecord {
  loggedIn: boolean;
  userEmail: string;
  userName: string;
  userId: string;
}

export interface AppointmentRecord {
  id?: string;
  patient_id?: string | null;
  patient_name: string;
  patient_email: string;
  phone: string;
  department: string;
  specialist: string;
  preferred_date: string;
  preferred_time: string;
  queue_number: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  booked_at?: string;
}

type Result<T> = {
  data?: T;
  error?: string;
};

const SESSION_KEY = "aura-session";
const ADMIN_KEY = "aura-admin-session";
const SESSION_COOKIE = "aura_patient_session";
const ADMIN_COOKIE = "aura_admin_session";

function setBrowserCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function clearBrowserCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function persistSession(session: SessionRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  setBrowserCookie(SESSION_COOKIE, "1");
}

function buildSessionFromAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): SessionRecord {
  const rawName = user.user_metadata?.name || user.user_metadata?.full_name;
  const fallbackName = user.email?.split("@")[0] || "Aura Patient";

  return {
    loggedIn: true,
    userEmail: user.email || "",
    userName: typeof rawName === "string" && rawName.trim() ? rawName : fallbackName,
    userId: user.id
  };
}

function persistAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_KEY, JSON.stringify({ adminLoggedIn: true }));
  setBrowserCookie(ADMIN_COOKIE, "1");
}

async function syncSessionFromSupabase() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user?.email) {
      return null;
    }

    const session = buildSessionFromAuthUser(data.session.user);
    persistSession(session);
    return session;
  } catch (error) {
    return null;
  }
}

export async function signUp(name: string, email: string, phone: string, password: string): Promise<Result<UserRecord>> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          full_name: name.trim(),
          phone: phone.trim()
        }
      }
    });

    if (error) {
      return { error: error.message || "Unable to create your account." };
    }

    if (data.session?.user) {
      persistSession(buildSessionFromAuthUser(data.session.user));
    } else {
      const signInResult = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (signInResult.error || !signInResult.data.user) {
        return { error: signInResult.error?.message || "Account created, but sign-in could not finish." };
      }

      persistSession(buildSessionFromAuthUser(signInResult.data.user));
    }

    return {
      data: {
        id: data.user?.id || "",
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password_hash: "",
        created_at: new Date().toISOString()
      }
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create your account." };
  }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error || !data.user) {
      return { success: false, error: "Invalid credentials." };
    }

    persistSession(buildSessionFromAuthUser(data.user));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to sign in right now."
    };
  }
}

export async function getSession(): Promise<SessionRecord | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return await syncSessionFromSupabase();
    }

    return JSON.parse(raw) as SessionRecord;
  } catch {
    return await syncSessionFromSupabase();
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }

  clearBrowserCookie(SESSION_COOKIE);
}

export async function saveAppointment(appointment: AppointmentRecord): Promise<Result<AppointmentRecord>> {
  try {
    const { error } = await supabase
      .from("appointments")
      .insert(appointment);

    if (error) {
      return { error: error.message || "Unable to save appointment." };
    }

    return { data: appointment };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save appointment." };
  }
}

export async function getAppointmentsByEmail(email: string): Promise<AppointmentRecord[]> {
  try {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_email", email)
      .order("booked_at", { ascending: false });

    return (data as AppointmentRecord[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getAllAppointments(): Promise<AppointmentRecord[]> {
  try {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("queue_number", { ascending: true });

    return (data as AppointmentRecord[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function updateAppointmentStatus(id: string, status: AppointmentRecord["status"]) {
  try {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    return { success: !error, error: error?.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update appointment."
    };
  }
}

export async function updateAppointmentPhone(id: string, phone: string) {
  try {
    const { error } = await supabase.from("appointments").update({ phone }).eq("id", id);
    return { success: !error, error: error?.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update phone number."
    };
  }
}

export async function getQueueNumber(date: string, department: string) {
  try {
    const { count, error } = await supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("preferred_date", date)
      .eq("department", department);

    if (error) {
      return "Q-001";
    }

    const nextNumber = (count ?? 0) + 1;
    return `Q-${String(nextNumber).padStart(3, "0")}`;
  } catch {
    return "Q-001";
  }
}

export async function adminSignIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      return { success: false, error: payload?.error || "Invalid staff credentials." };
    }

    persistAdminSession();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to sign in."
    };
  }
}

export async function adminSignOut() {
  try {
    await fetch("/api/admin/session", {
      method: "DELETE"
    });
  } catch {
    // ignore
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_KEY);
  }

  clearBrowserCookie(ADMIN_COOKIE);
}

export async function getAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as { adminLoggedIn: boolean };
  } catch {
    return null;
  }
}

export async function completeGoogleSignIn(code: string) {
  if (typeof window === "undefined") {
    return { success: false, error: "Google sign-in must finish in the browser." };
  }

  try {
    const exchange = await supabase.auth.exchangeCodeForSession(code);
    if (exchange.error) {
      return { success: false, error: exchange.error.message };
    }

    if (!exchange.data.user?.email) {
      return { success: false, error: "Google sign-in did not return a valid account." };
    }

    persistSession(buildSessionFromAuthUser(exchange.data.user));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to finish Google sign-in."
    };
  }
}
