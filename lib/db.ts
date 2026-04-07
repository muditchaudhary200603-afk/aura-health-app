import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  clinicHours,
  contactDetails,
  servicesSeed,
  specialistsSeed,
  type ServiceRecord,
  type SpecialistRecord
} from "@/lib/site-data";
import { createServerSupabase } from "@/lib/supabase";

export type AppointmentRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  departmentOrService: string;
  message: string;
  specialistSlug: string | null;
  preferredDate: string | null;
  status: string;
  createdAt: string;
};

function getDataDir() {
  return join(process.cwd(), "data");
}

function getFallbackAppointmentsPath() {
  return join(getDataDir(), "appointments.json");
}

function normalizeService(row: Partial<ServiceRecord>): ServiceRecord | null {
  if (!row.slug || !row.name || !row.category || !row.summary || !row.description || !row.accent || !row.image) {
    return null;
  }

  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    summary: row.summary,
    description: row.description,
    accent: row.accent,
    image: row.image,
    featured: Boolean(row.featured)
  };
}

function normalizeSpecialist(row: Partial<SpecialistRecord>): SpecialistRecord | null {
  if (!row.slug || !row.name || !row.role || !row.specialty || !row.experienceLabel || !row.bio || !row.image) {
    return null;
  }

  return {
    slug: row.slug,
    name: row.name,
    role: row.role,
    specialty: row.specialty,
    experienceLabel: row.experienceLabel,
    bio: row.bio,
    image: row.image,
    featured: Boolean(row.featured)
  };
}

function normalizeAppointment(row: Partial<AppointmentRecord>): AppointmentRecord | null {
  if (!row.name || !row.email || !row.phone || !row.departmentOrService || !row.message) {
    return null;
  }

  return {
    id: Number(row.id ?? Date.now()),
    name: row.name,
    email: row.email,
    phone: row.phone,
    departmentOrService: row.departmentOrService,
    message: row.message,
    specialistSlug: row.specialistSlug ?? null,
    preferredDate: row.preferredDate ?? null,
    status: row.status ?? "new",
    createdAt: row.createdAt ?? new Date().toISOString()
  };
}

async function ensureDataDir() {
  await mkdir(getDataDir(), { recursive: true });
}

async function readFallbackAppointments() {
  await ensureDataDir();

  try {
    const raw = await readFile(getFallbackAppointmentsPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<AppointmentRecord>[];
    return parsed
      .map(normalizeAppointment)
      .filter((item): item is AppointmentRecord => Boolean(item))
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  } catch {
    await writeFile(getFallbackAppointmentsPath(), "[]", "utf8");
    return [];
  }
}

async function writeFallbackAppointments(appointments: AppointmentRecord[]) {
  await ensureDataDir();
  await writeFile(getFallbackAppointmentsPath(), JSON.stringify(appointments, null, 2), "utf8");
}

function sortByFeaturedAndName<T extends { featured: boolean; name: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return left.name.localeCompare(right.name);
  });
}

async function getSupabaseServices() {
  const supabase = createServerSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("services").select("*");

  if (error || !data?.length) {
    return null;
  }

  const normalized = data
    .map((item) => normalizeService(item as Partial<ServiceRecord>))
    .filter((item): item is ServiceRecord => Boolean(item));

  return normalized.length ? sortByFeaturedAndName(normalized) : null;
}

async function getSupabaseSpecialists() {
  const supabase = createServerSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("specialists").select("*");

  if (error || !data?.length) {
    return null;
  }

  const normalized = data
    .map((item) => normalizeSpecialist(item as Partial<SpecialistRecord>))
    .filter((item): item is SpecialistRecord => Boolean(item));

  return normalized.length ? sortByFeaturedAndName(normalized) : null;
}

async function getSupabaseAppointments() {
  const supabase = createServerSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("appointments").select("*");

  if (error || !data) {
    return null;
  }

  return data
    .map((item) => normalizeAppointment(item as Partial<AppointmentRecord>))
    .filter((item): item is AppointmentRecord => Boolean(item))
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export async function getServices() {
  return (await getSupabaseServices()) ?? sortByFeaturedAndName(servicesSeed);
}

export async function getFeaturedServices(limit = 4) {
  return (await getServices()).slice(0, limit);
}

export async function getSpecialists(filters?: { search?: string; specialty?: string }) {
  const source = (await getSupabaseSpecialists()) ?? sortByFeaturedAndName(specialistsSeed);
  const searchTerm = filters?.search?.trim().toLowerCase();

  return source.filter((item) => {
    const matchesSearch = !searchTerm
      || [item.name, item.role, item.specialty, item.bio].some((value) => value.toLowerCase().includes(searchTerm));
    const matchesSpecialty = !filters?.specialty || filters.specialty === "All" || item.specialty === filters.specialty;

    return matchesSearch && matchesSpecialty;
  });
}

export async function getFeaturedSpecialists(limit = 3) {
  return (await getSpecialists()).slice(0, limit);
}

export async function createAppointment(input: {
  name: string;
  email: string;
  phone: string;
  departmentOrService: string;
  message: string;
  specialistSlug?: string | null;
  preferredDate?: string | null;
  status?: string;
}) {
  const appointment: Omit<AppointmentRecord, "id"> = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    departmentOrService: input.departmentOrService,
    message: input.message,
    specialistSlug: input.specialistSlug ?? null,
    preferredDate: input.preferredDate ?? null,
    status: input.status ?? "new",
    createdAt: new Date().toISOString()
  };

  const supabase = createServerSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointment)
      .select("id")
      .single();

    if (!error && data?.id) {
      return { id: Number(data.id) };
    }
  }

  const current = await readFallbackAppointments();
  const id = current[0]?.id ? current[0].id + 1 : 1;
  current.unshift({ id, ...appointment });
  await writeFallbackAppointments(current);

  return { id };
}

export async function getAppointments(filters?: { status?: string }) {
  const items = (await getSupabaseAppointments()) ?? (await readFallbackAppointments());

  if (!filters?.status || filters.status === "all") {
    return items;
  }

  return items.filter((item) => item.status === filters.status);
}

export async function getAppointmentSummary() {
  const appointments = await getAppointments();

  return appointments.reduce(
    (summary, item) => {
      summary.total += 1;

      if (item.status === "new") summary.newCount += 1;
      if (item.status === "contacted") summary.contactedCount += 1;
      if (item.status === "scheduled") summary.scheduledCount += 1;

      return summary;
    },
    {
      total: 0,
      newCount: 0,
      contactedCount: 0,
      scheduledCount: 0
    }
  );
}

export async function updateAppointmentStatus(id: number, status: string) {
  const supabase = createServerSupabase();
  if (supabase) {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);

    if (!error) {
      return;
    }
  }

  const current = await readFallbackAppointments();
  const next = current.map((item) => (item.id === id ? { ...item, status } : item));
  await writeFallbackAppointments(next);
}

export async function getSiteSettings() {
  return {
    contactPhone: contactDetails.phoneDisplay,
    contactEmail: contactDetails.emailDisplay,
    hours: clinicHours
  };
}
