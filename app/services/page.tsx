import Image from "next/image";
import Link from "next/link";

import { Reveal } from "../../components/reveal";
import { getServices } from "../../lib/db";

export const metadata = {
  title: "Services — Aura Health Clinical Sanctuary",
  description: "Explore our full range of medical services: cardiology, orthopedics, neurology, pediatrics, dermatology, preventive care, and advanced diagnostics."
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="pt-28">
      <section className="section-shell py-14 sm:py-20">
        <Reveal className="max-w-4xl">
          <div className="eyebrow">Services</div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.94] sm:text-6xl">Medical expertise that stays legible.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Aura Health is built around specialist pathways that can move from consult to diagnostic clarity without turning into a maze.
          </p>
        </Reveal>
      </section>

      <section className="section-shell space-y-8 pb-20 sm:pb-24">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.06}>
            <article className="premium-card grid gap-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[0.9fr_1.1fr]">
              <div className={`relative min-h-[320px] overflow-hidden rounded-[1.5rem] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image src={service.image} alt={service.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
              <div className={`flex flex-col justify-between gap-6 p-1 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-4">
                  <div className="eyebrow">{service.category}</div>
                  <h2 className="font-display text-5xl font-semibold leading-none">{service.name}</h2>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="eyebrow">Designed for</p>
                      <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{service.summary}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Category</p>
                      <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{service.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}`}
                    className="inline-flex items-center justify-center rounded-full bg-pine px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-mist transition hover:bg-sage"
                  >
                    Request {service.name}
                  </Link>
                  <Link
                    href="/specialists"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    View specialists
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
