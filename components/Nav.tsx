"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

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
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Verse bar — always visible; clicking scrolls to the prayer section.
          A plain anchor (not next/link) so native hash scrolling is reliable
          on the homepage and full-navigates from other pages. */}
      <a
        href="/#prayer"
        className="group block bg-burgundy text-cream transition-colors hover:bg-burgundy-deep"
      >
        <span className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-6 py-2.5 md:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] md:text-sm">
            John&nbsp;17:20&ndash;23
          </span>
          <span className="hidden font-serif text-sm italic text-cream/75 sm:inline md:text-base">
            &mdash; &ldquo;that they may all be one&rdquo;
          </span>
          <span
            aria-hidden="true"
            className="font-semibold transition-transform group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </span>
      </a>

      {/* Nav row */}
      <div
        className={[
          "transition-colors duration-300",
          overHero
            ? "bg-transparent"
            : "border-b border-line-soft bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 md:px-10",
            overHero ? "py-3 md:py-4" : "py-2 md:py-2.5",
          ].join(" ")}
        >
        {/* Quiet text wordmark — the brand's one home in the chrome. The
            fixed heights preserve the header's footprint (slimming ~30%
            once scrolled). */}
        <Link
          href="/"
          aria-label="One Step Closer — home"
          className={[
            "font-display flex items-center transition-all duration-300",
            overHero
              ? "h-20 text-xl text-cream md:h-24 md:text-2xl"
              : "h-14 text-lg text-burgundy md:h-16 md:text-xl",
          ].join(" ")}
        >
          One Step Closer
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
      </div>
    </header>
  );
}
