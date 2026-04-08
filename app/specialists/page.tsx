import Image from "next/image";
import Link from "next/link";
import { SpecialistBrowser } from "@/components/specialist-browser";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getFeaturedSpecialists, getSpecialists } from "@/lib/db";
import { siteCopy } from "@/lib/site-data";

export const metadata = {
  title: "Specialists — Aura Health Clinical Sanctuary",
  description: "Meet our world-class specialists chosen for both expertise and empathy. Filter by specialty and book a consultation directly."
};

export default async function SpecialistsPage() {
  const featured = await getFeaturedSpecialists(2);
  const allSpecialists = await getSpecialists();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-8 sm:px-6 lg:gap-20 lg:px-8 lg:pb-10">
      <ScrollReveal>
        <section className="premium-card grid gap-6 rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-soft dark:border-white/10 dark:bg-white/[0.04] lg:grid-cols-[1.1fr,0.9fr] lg:items-start sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-aura-pine/70 dark:text-aura-aqua/70">Specialists</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-aura-ink sm:text-5xl dark:text-white">
              {siteCopy.specialistsTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-aura-ink/72 dark:text-white/72">
              Find the right expert quickly, filter by specialty, and start a booking flow that already knows who you want to see.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((item) => (
              <div key={item.slug} className="premium-card overflow-hidden rounded-[1.75rem] border border-black/5 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                <div className="relative aspect-[4/5] w-full">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 25vw" />
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-aura-pine/70 dark:text-aura-aqua/70">{item.role}</p>
                  <h2 className="font-display text-2xl font-semibold text-aura-ink dark:text-white">{item.name}</h2>
                  <p className="text-sm leading-7 text-aura-ink/70 dark:text-white/70">{item.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="premium-card rounded-[2rem] border border-black/5 bg-gradient-to-br from-aura-ink to-aura-pine p-6 text-white shadow-[0_8px_22px_rgba(27,67,50,0.16)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.24)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-aura-aqua">Aura Executive Circle</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Access senior clinical leadership for complex case management.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Our executive care pathway is designed for patients who need rapid access, coordinated diagnostics, and a more elevated level of clinical continuity.
            </p>
            <Link href="/contact?service=Advanced%20Diagnostics" className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-aura-ink transition hover:-translate-y-0.5 hover:bg-aura-aqua">
              Request executive review
            </Link>
          </div>

          <div className="premium-card rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-soft dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-aura-pine/70 dark:text-aura-aqua/70">Search and filter</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-aura-ink dark:text-white">Clinical experts</h2>
            <p className="mt-4 text-sm leading-7 text-aura-ink/72 dark:text-white/72">
              Search by name, specialty, or clinical focus. Every result routes directly into the booking flow.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <SpecialistBrowser initialSpecialists={allSpecialists} />
      </ScrollReveal>
    </div>
  );
}
