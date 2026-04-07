"use client";

import { useEffect, useState } from "react";
import { Ripple } from "@/components/ui/material-design-3-ripple";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);

    try {
      localStorage.setItem("aura-theme", next ? "dark" : "light");
    } catch {
      // ignore storage failures
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative overflow-hidden grid h-10 w-10 place-items-center rounded-full border border-[#1B4332]/10 bg-white/90 text-[#d39a1c] shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-[#F5F0E8]"
    >
      <Ripple color="text-current" opacity={0.15} />
      {dark ? (
        <svg viewBox="0 0 24 24" className="relative z-10 pointer-events-none h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 3v2.5M12 18.5V21M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M3 12h2.5M18.5 12H21M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="relative z-10 pointer-events-none h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4A8.5 8.5 0 1 0 20 15.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
