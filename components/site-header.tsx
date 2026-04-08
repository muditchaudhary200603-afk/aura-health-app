"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getSession, supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme-toggle";
import { Ripple } from "@/components/ui/material-design-3-ripple";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/specialists", label: "Specialists" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const session = await getSession();
      if (!active) return;
      setLoggedIn(Boolean(session?.loggedIn));
    }

    void loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async () => {
      const session = await getSession();
      if (!active) return;
      setLoggedIn(Boolean(session?.loggedIn));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  /* ---------- scroll-condensed header ---------- */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- close mobile menu on route change ---------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ---------- lock body scroll when mobile menu open ---------- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Skip-to-content link for accessibility */}
      <a
        href="#main-content"
        className="fixed left-2 top-2 z-[100] -translate-y-20 rounded-full bg-[#1B4332] px-5 py-3 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="floating-header-shell overflow-hidden">
        <div className="section-shell">
          <div
            className={`floating-header-inner flex items-center justify-between gap-2 border border-white/55 px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_14px_36px_rgba(27,67,50,0.08),inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(255,255,255,0.16)] backdrop-blur-[30px] backdrop-saturate-[1.8] transition-all duration-500 ease-out supports-[backdrop-filter]:bg-white/16
              dark:border-white/10 dark:shadow-[0_16px_42px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(255,255,255,0.03)] dark:supports-[backdrop-filter]:bg-[#163127]/22
              ${scrolled
                ? "rounded-[1.4rem] sm:rounded-[1.6rem] bg-white/28 dark:bg-[#163127]/38"
                : "rounded-[1.85rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.24))] dark:bg-[linear-gradient(180deg,rgba(19,39,32,0.58),rgba(19,39,32,0.28))]"
              }`}
          >
            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#163f31] text-[14px] font-bold text-[#F5F0E8] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">AH</div>
              <div className="hidden min-w-0 sm:block">
                <div className="truncate text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold leading-none tracking-[-0.03em] text-[#163b2e] dark:text-[#F5F0E8]">Aura Health</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-[0.36em] text-[#416c59] dark:text-[#9fddbd]">Clinical Sanctuary</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative pb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                      active ? "text-[#163b2e] dark:text-[#F5F0E8]" : "text-[#163b2e]/72 hover:text-[#163b2e] dark:text-[#F5F0E8]/72 dark:hover:text-[#F5F0E8]"
                    }`}
                  >
                    {item.label}
                    {active ? <span className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#163f31] dark:bg-[#95D5B2]" /> : null}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {loggedIn ? (
                <Link href="/dashboard" className="relative hidden overflow-hidden rounded-full border border-[#163b2e]/10 bg-white/22 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#163b2e] transition hover:bg-white/34 hover:scale-[1.03] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#F5F0E8] dark:hover:bg-white/[0.08] sm:inline-flex">
                  <Ripple color="text-current" opacity={0.1} />
                  <span className="relative z-10 pointer-events-none">My Appointments</span>
                </Link>
              ) : (
                <Link href="/auth/signin" className="relative hidden overflow-hidden rounded-full border border-[#163b2e]/10 bg-white/22 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#163b2e] transition hover:bg-white/34 hover:scale-[1.03] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#F5F0E8] dark:hover:bg-white/[0.08] sm:inline-flex">
                  <Ripple color="text-current" opacity={0.1} />
                  <span className="relative z-10 pointer-events-none">Sign In</span>
                </Link>
              )}
              <ThemeToggle />
              <Link href="/contact" className="relative overflow-hidden primary-button !hidden !px-3 !py-1.5 !text-[11px] !tracking-[0.22em] shadow-[0_4px_14px_rgba(27,67,50,0.3)] transition hover:scale-[1.03] sm:!inline-flex sm:!px-5 sm:!py-2.5">
                <Ripple color="text-white" opacity={0.15} />
                <span className="relative z-10 pointer-events-none">Book Visit</span>
              </Link>

              {/* Hamburger button - mobile only */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="relative grid h-11 w-11 place-items-center rounded-full border border-[#163b2e]/10 bg-white/40 shadow-sm transition hover:bg-white/60 dark:border-white/10 dark:bg-white/[0.08] lg:hidden"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-[#163b2e] dark:text-[#F5F0E8]" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5 text-[#163b2e] dark:text-[#F5F0E8]" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:pointer-events-none lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <nav
        aria-label="Mobile navigation"
        className={`fixed left-0 top-0 z-[66] flex h-full w-[min(80vw,320px)] flex-col gap-1 overflow-y-auto bg-white/95 px-6 pb-8 pt-24 shadow-[12px_0_40px_rgba(27,67,50,0.15)] backdrop-blur-xl transition-transform duration-400 ease-out dark:bg-[#10211a]/95 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded-2xl px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] transition ${
                active
                  ? "bg-[#1B4332]/8 text-[#1B4332] dark:bg-white/8 dark:text-[#F5F0E8]"
                  : "text-[#1B4332]/72 hover:bg-[#1B4332]/5 dark:text-[#F5F0E8]/72 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <hr className="my-3 border-[#1B4332]/10 dark:border-white/10" />

        {loggedIn ? (
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="rounded-2xl px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#1B4332]/72 transition hover:bg-[#1B4332]/5 dark:text-[#F5F0E8]/72 dark:hover:bg-white/5"
          >
            My Appointments
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            onClick={() => setMobileOpen(false)}
            className="rounded-2xl px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#1B4332]/72 transition hover:bg-[#1B4332]/5 dark:text-[#F5F0E8]/72 dark:hover:bg-white/5"
          >
            Sign In
          </Link>
        )}

        <Link
          href="/contact"
          onClick={() => setMobileOpen(false)}
          className="primary-button mt-2 w-full text-center !text-[12px] !tracking-[0.22em]"
        >
          Book Visit
        </Link>
      </nav>
    </>
  );
}
