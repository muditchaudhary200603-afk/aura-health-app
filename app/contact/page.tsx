import Image from "next/image";
import { AppointmentForm } from "@/components/appointment-form";
import { contactDetails, servicesSeed, siteCopy, specialistsSeed } from "@/lib/site-data";

export const metadata = {
  title: "Contact — Aura Health Clinical Sanctuary",
  description: "Get in touch with Aura Health and request an appointment. We provide clarity, responsiveness, and care your health journey deserves."
};

export default function ContactPage() {
  return (
    <section className="section-shell pb-20 sm:pb-24">
      <div className="max-w-4xl">
        <p className="eyebrow text-[#2D6A4F] dark:text-[#95D5B2]">Contact Aura</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.96] text-[#1B4332] dark:text-[#F5F0E8] sm:text-6xl">
          {siteCopy.contactTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#1B4332]/74 dark:text-[#F5F0E8]/74">
          {siteCopy.contactBody}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
        <div className="space-y-6">
          <article className="premium-card rounded-[2.5rem] bg-white/90 p-4 shadow-[0_18px_55px_rgba(27,67,50,0.12)] dark:bg-white/[0.05]">
            <div className="relative h-[380px] overflow-hidden rounded-[2rem] sm:h-[430px]">
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80"
                alt="Aura Health headquarters"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,14,0.06),rgba(9,16,14,0.48))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[2rem] border border-white/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))] p-6 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:p-7">
                <p className="text-sm uppercase tracking-[0.28em] text-[#95D5B2]">Headquarters</p>
                <h2 className="mt-4 font-display text-4xl font-semibold">{contactDetails.hqName}</h2>
                <p className="mt-3 text-lg text-white/82">{contactDetails.district}</p>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="premium-card rounded-[2rem] bg-white px-6 py-7 shadow-[0_16px_42px_rgba(27,67,50,0.08)] dark:bg-white/[0.05]">
              <p className="text-sm uppercase tracking-[0.28em] text-[#2D6A4F] dark:text-[#95D5B2]">Visit Us</p>
              <div className="mt-6 space-y-3 text-lg leading-8 text-[#1B4332]/84 dark:text-[#F5F0E8]/82">
                <p>{contactDetails.addressLine1}, {contactDetails.addressLine2}</p>
                <p>{contactDetails.city}, {contactDetails.state} {contactDetails.postalCode}</p>
              </div>
            </article>

            <article className="premium-card rounded-[2rem] bg-white px-6 py-7 shadow-[0_16px_42px_rgba(27,67,50,0.08)] dark:bg-white/[0.05]">
              <p className="text-sm uppercase tracking-[0.28em] text-[#2D6A4F] dark:text-[#95D5B2]">Reach Us</p>
              <div className="mt-6 space-y-4 text-[#1B4332] dark:text-[#F5F0E8]">
                <p className="font-display text-4xl leading-none">{contactDetails.phoneDisplay}</p>
                <p className="text-lg">{contactDetails.emailDisplay}</p>
                <p className="text-lg text-[#1B4332]/68 dark:text-[#F5F0E8]/68">{contactDetails.responseTime}</p>
                <p className="text-sm uppercase tracking-[0.2em] text-[#1B4332]/55 dark:text-[#F5F0E8]/55">
                  Mon-Fri: 8AM - 7PM
                  <br />
                  Sat: 9AM - 4PM
                  <br />
                  Sun: Closed
                </p>
              </div>
            </article>
          </div>
        </div>

        <AppointmentForm
          services={servicesSeed.map((service) => ({ slug: service.slug, name: service.name }))}
          specialists={specialistsSeed.map((specialist) => ({ slug: specialist.slug, name: specialist.name }))}
        />
      </div>
    </section>
  );
}
