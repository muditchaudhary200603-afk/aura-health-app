"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { Ripple } from "@/components/ui/material-design-3-ripple";

export function HeroSurface({
  eyebrow,
  title,
  copy,
  imageUrl,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  eyebrow: string;
  title: string;
  copy: string;
  imageUrl: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(224,255,246,0.32), transparent 28%)`;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 100);
    y.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#131f1b] text-mist">
      {/* Optimized hero background image using next/image */}
      <div onMouseMove={handleMove} className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Aura Health premium clinical environment"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,18,0.85),rgba(8,13,18,0.36))]" />
      </div>
      <motion.div className="absolute inset-0 hidden md:block" style={{ backgroundImage: glow }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),transparent_30%,rgba(0,0,0,0.46))]" />
      <div className="section-shell relative flex min-h-[100svh] items-end pb-16 pt-32 sm:pb-20 md:items-center">
        <div className="max-w-3xl">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow text-glow"
          >
            {eyebrow}
          </motion.div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 32 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08 }}
            className="mt-5 font-display text-4xl font-semibold leading-[0.92] text-balance sm:text-5xl md:text-7xl lg:text-8xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg"
          >
            {copy}
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start"
          >
            <Link
              href={primaryHref}
              className="relative overflow-hidden inline-flex items-center justify-center rounded-full bg-mist px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-white hover:scale-[1.03]"
            >
              <Ripple color="text-black" opacity={0.15} />
              <span className="relative z-10 pointer-events-none">{primaryLabel}</span>
            </Link>
            <Link
              href={secondaryHref}
              className="relative overflow-hidden inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-mist transition hover:bg-white/10 hover:scale-[1.03]"
            >
              <Ripple color="text-white" opacity={0.15} />
              <span className="relative z-10 pointer-events-none">{secondaryLabel}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
