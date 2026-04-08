import { AppointmentForm } from "@/components/appointment-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getServices, getSpecialists } from "@/lib/db";
import { slugToLabel } from "@/lib/utils";

export default async function BookPage({
  searchParams
}: {
  searchParams?: { service?: string; specialist?: string };
}) {
  const services = await getServices();
  const specialists = await getSpecialists();
  const serviceSlug = searchParams?.service ?? "";
  const specialistSlug = searchParams?.specialist ?? "";
  const serviceLabel =
    services.find((s) => s.slug === serviceSlug)?.name || slugToLabel(serviceSlug) || "Aura Health";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
      <ScrollReveal>
        <section className="premium-card rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-soft dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-aura-pine/70 dark:text-aura-aqua/70">Booking</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-aura-ink sm:text-5xl dark:text-white">
            Start a guided appointment request
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-aura-ink/72 dark:text-white/72">
            You are booking for <span className="font-semibold text-aura-ink dark:text-white">{serviceLabel}</span>.
            Share a few details and Aura Health will route you to the right clinician and next step.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <AppointmentForm
          services={services}
          specialists={specialists}
          initialService={serviceLabel === "Aura Health" ? "" : serviceLabel}
          initialSpecialist={specialistSlug}
          ctaLabel="Book Appointment"
        />
      </ScrollReveal>
    </div>
  );
}
