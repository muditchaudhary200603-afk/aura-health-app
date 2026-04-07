"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

type Specialist = {
  slug: string;
  name: string;
  specialty: string;
  role: string;
  experienceLabel: string;
  bio: string;
  image: string;
  featured: boolean;
};

export function SpecialistBrowser({ initialSpecialists }: { initialSpecialists: Specialist[] }) {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [items, setItems] = useState(initialSpecialists);
  const [loading, setLoading] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const specialties = useMemo(
    () => ["All", ...Array.from(new Set(initialSpecialists.map((item) => item.specialty)))],
    [initialSpecialists]
  );

  useEffect(() => {
    const trimmedSearch = deferredSearch.trim();

    if (!trimmedSearch && specialty === "All") {
      setItems(initialSpecialists);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      const query = new URLSearchParams();
      if (trimmedSearch) {
        query.set("search", trimmedSearch);
      }
      if (specialty !== "All") {
        query.set("specialty", specialty);
      }

      try {
        const response = await fetch(`/api/specialists?${query.toString()}`, {
          signal: controller.signal
        });

        if (response.ok) {
          const data = (await response.json()) as { specialists: Specialist[] };
          setItems(data.specialists);
        }
      } catch {
        // aborted
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [deferredSearch, initialSpecialists, specialty]);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label htmlFor="specialist-search" className="premium-card rounded-[1.8rem] border border-slate-200/80 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <span className="eyebrow">Search</span>
          <input
            id="specialist-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by specialist, focus, or specialty"
            className="mt-3 w-full bg-transparent text-lg outline-none placeholder:text-slate-400"
            aria-label="Search specialists"
          />
        </label>
        <div className="premium-card rounded-[1.8rem] border border-slate-200/80 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="eyebrow">Filter</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {specialties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSpecialty(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#95D5B2] focus-visible:ring-offset-2 ${
                  specialty === item
                    ? "bg-pine text-mist ring-2 ring-[#95D5B2]/40"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {loading ? "Refreshing specialists" : `${items.length} specialists available`}
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          /* Skeleton loading cards */
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="skeleton aspect-[4/5] rounded-[1.5rem]" />
              <div className="flex flex-col justify-between gap-6 p-1">
                <div className="space-y-4">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-8 w-64 rounded" />
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-20 w-full rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <div className="skeleton h-12 w-44 rounded-full" />
                  <div className="skeleton h-12 w-40 rounded-full" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="premium-card rounded-[2rem] border border-slate-200/80 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="font-display text-2xl font-semibold">No specialists found</h3>
            <p className="mt-2 text-slate-500">Try a different search term or filter.</p>
          </div>
        ) : items.map((item, index) => (
          <article
            key={item.slug}
            className="premium-card grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[0.7fr_1.3fr]"
          >
            <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.5rem] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
            <div className={`flex flex-col justify-between gap-6 p-1 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="space-y-4">
                <div className="eyebrow">{item.specialty}</div>
                <div>
                  <h3 className="font-display text-4xl font-semibold leading-none">{item.name}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{item.bio}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">Experience</p>
                    <p className="mt-2 text-lg">{item.experienceLabel}</p>
                  </div>
                  <div>
                    <p className="eyebrow">Specialty</p>
                    <p className="mt-2 text-lg">{item.specialty}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/contact?specialist=${item.slug}&service=${encodeURIComponent(item.specialty)}`}
                  className="inline-flex items-center justify-center rounded-full bg-pine px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-mist transition hover:bg-sage"
                >
                  Book consultation
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Speak with support
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
