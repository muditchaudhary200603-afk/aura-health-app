import Image from "next/image";
import Link from "next/link";

import { HeroSurface } from "../components/hero-surface";
import { Reveal } from "../components/reveal";
import { getFeaturedServices, getFeaturedSpecialists } from "../lib/db";

export default async function HomePage() {
  const services = await getFeaturedServices(4);
  const specialists = await getFeaturedSpecialists(3);
  const leadSpecialist = specialists[0];

  return (
    <>
      <HeroSurface
        eyebrow="Premium clinic care"
        title="Precision medicine, staged like hospitality."
        copy="Aura Health pairs deep clinical review with quieter spaces, faster specialist coordination, and treatment plans that read clearly on the first pass."
        imageUrl="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1800&q=80"
        primaryHref="/contact"
        primaryLabel="Start your recovery"
        secondaryHref="/specialists"
        secondaryLabel="Meet specialists"
      />

      <section className="section-shell py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <div className="space-y-6">
              <div className="eyebrow">What changes here</div>
              <h2 className="section-title">The clinic stops feeling like a queue and starts feeling coherent.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-6 text-base leading-7 text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <p>Each patient path is designed to reduce handoff friction between diagnostics, specialist consults, and follow-up decisions.</p>
              <p>That means fewer repeat explanations, cleaner transitions, and more confidence in what happens next.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="relative min-h-[360px] overflow-hidden rounded-[2rem] lg:min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
              alt="Aura Health consultation suite"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </Reveal>
          <div className="space-y-10">
            {services.slice(0, 3).map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.08}>
                <article className="border-b border-slate-200/80 pb-8 dark:border-slate-800">
                  <div className="eyebrow">{service.category}</div>
                  <h3 className="mt-3 font-display text-4xl font-semibold leading-none">{service.name}</h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
                  <div className="mt-4 flex flex-col gap-3 text-sm uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 sm:flex-row sm:items-end sm:justify-between">
                    <span className="sm:max-w-[60%]">{service.summary}</span>
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.name)}`}
                      className="link-line whitespace-nowrap font-semibold text-pine dark:text-glow"
                    >
                      Book consultation
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101c18] py-20 text-mist sm:py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <Reveal>
            <div className="space-y-5">
              <div className="eyebrow text-glow">Clinical leadership</div>
              <h2 className="section-title text-mist">One visible lead. A wider specialist bench behind them.</h2>
              <p className="max-w-md text-base leading-7 text-white/72">
                Complex cases need one accountable voice and a specialist network that can move in sequence instead of in silos.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="md:col-span-2">
              <article className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl lg:grid-cols-[0.72fr_1.28fr]">
                <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem]">
                  <Image src={leadSpecialist.image} alt={leadSpecialist.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 30vw" />
                </div>
                <div className="space-y-4 p-1">
                  <div className="eyebrow text-glow">{leadSpecialist.role}</div>
                  <h3 className="font-display text-5xl font-semibold leading-none">{leadSpecialist.name}</h3>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/60">{leadSpecialist.specialty}</p>
                  <p className="max-w-xl text-base leading-7 text-white/74">{leadSpecialist.bio}</p>
                  <blockquote className="border-l-2 border-white/20 pl-4 text-sm italic text-white/65">&ldquo;{leadSpecialist.experienceLabel}&rdquo;</blockquote>
                  <Link href={`/contact?specialist=${leadSpecialist.slug}`} className="inline-flex rounded-full bg-mist px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink">
                    Book with {leadSpecialist.name.split(" ")[1]}
                  </Link>
                </div>
              </article>
            </Reveal>

            {specialists.slice(1, 3).map((specialist, index) => (
              <Reveal key={specialist.slug} delay={index * 0.08}>
                <article className="space-y-4 rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                  <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem]">
                    <Image src={specialist.image} alt={specialist.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                  </div>
                  <div>
                    <p className="eyebrow text-glow">{specialist.specialty}</p>
                    <h3 className="mt-3 font-display text-3xl font-semibold leading-none">{specialist.name}</h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/58">{specialist.role}</p>
                  </div>
                  <p className="text-sm leading-7 text-white/70">{specialist.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 sm:py-24">
        <div className="grid gap-6 border-y border-slate-200 py-10 dark:border-slate-800 md:grid-cols-3">
          {[
            ["Arrive with context", "Requests are routed with service and specialist intent already attached."],
            ["Diagnose without drift", "Longer first consults and clearer coordination reduce repeat explanations."],
            ["Recover with continuity", "The same team tracks what happens after the consult, not just during it."]
          ].map(([title, body], index) => (
            <Reveal key={title} delay={index * 0.08}>
              <article className="space-y-3">
                <div className="eyebrow">{`0${index + 1}`}</div>
                <h3 className="font-display text-3xl font-semibold leading-none">{title}</h3>
                <p className="max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-24">
        <Reveal className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#16352f,#335e56)] px-6 py-12 text-mist shadow-aura sm:px-10 sm:py-14 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="eyebrow text-glow">Final step</div>
              <h2 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">Schedule the first conversation.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
                Tell the team what is happening, who you want to meet, and what timing works. The intake flow now routes into a real backend and staff queue.
              </p>
            </div>
            <Link href="/contact" className="inline-flex rounded-full bg-mist px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink">
              Request appointment
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
