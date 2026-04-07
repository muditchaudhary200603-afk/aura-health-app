import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1B4332]/12 bg-white py-14 dark:border-white/10 dark:bg-[#10211a]">
      <div className="section-shell grid gap-10 lg:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Aura Health</p>
          <h2 className="mt-3 text-4xl font-semibold text-[#1B4332] dark:text-[#F5F0E8]">Clinical Sanctuary</h2>
          <p className="mt-4 max-w-md text-[#1B4332]/68 dark:text-[#F5F0E8]/68">
            Precision care, calm patient experience, and responsive specialist coordination.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Visit</p>
          <div className="mt-4 space-y-2 text-[#1B4332]/72 dark:text-[#F5F0E8]/72">
            <p>1200 Wellness Blvd</p>
            <p>Aura Heights, SC 90210</p>
            <p>care@aurahealth.clinical</p>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Access</p>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/auth/signin" className="font-semibold text-[#1B4332] dark:text-[#F5F0E8]">
              Patient Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
