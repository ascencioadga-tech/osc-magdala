"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/content";
import { Medallion } from "@/components/Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When over hero (top of page) the nav is transparent with cream text.
  // After scrolling past the hero it picks up the cream backdrop and burgundy text.
  const overHero = !scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        overHero
          ? "bg-transparent"
          : "border-b border-line-soft bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-4 group"
          aria-label="One Step Closer — home"
        >
          <Medallion
            size={96}
            idPrefix="osc-nav"
            className="drop-shadow-[0_8px_24px_rgba(42,8,16,0.55)] transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <span className="flex flex-col leading-tight">
            <span
              className={[
                "font-display text-xl transition-colors duration-300 md:text-2xl",
                overHero ? "text-cream" : "text-burgundy",
              ].join(" ")}
            >
              One Step Closer
            </span>
            <span
              className={[
                "eyebrow text-[10px] transition-colors duration-300 md:text-[11px]",
                overHero ? "text-gold-light/90" : "text-terracotta",
              ].join(" ")}
            >
              Hospitality · Together
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-sm transition-colors duration-300",
                overHero
                  ? "text-cream/85 hover:text-gold-light"
                  : "text-ink/80 hover:text-burgundy",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={nav.cta.href}
          className={[
            "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition md:px-6",
            overHero
              ? "border border-cream/60 text-cream hover:border-cream hover:bg-cream/10"
              : "bg-burgundy text-cream hover:bg-burgundy-deep",
          ].join(" ")}
        >
          {nav.cta.label}
        </Link>
      </div>
    </header>
  );
}
