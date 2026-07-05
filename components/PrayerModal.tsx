"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

type PrayerContent = {
  epigraph: string;
  title: string;
  body: string[];
};

type PrayerModalProps = {
  open: boolean;
  onClose: () => void;
  prayer: PrayerContent;
};

export function PrayerModal({ open, onClose, prayer }: PrayerModalProps) {
  // Close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="prayer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="osc-prayer-title"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close prayer"
            className="absolute inset-0 cursor-default bg-burgundy-ink/80 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: reverentEase }}
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line-soft bg-cream p-8 pb-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] md:max-w-2xl md:p-12 md:pb-0"
            style={{ borderTopWidth: 3, borderTopColor: "#54132e" }}
          >
            {/* Heading — the hand-set tessera mark, then the dedication */}
            <div className="text-center">
              <svg
                viewBox="-38 -12 76 24"
                className="mx-auto h-4 w-[76px]"
                aria-hidden="true"
              >
                {[
                  { x: -27, s: 4.4, r: -16, c: "#54132e" },
                  { x: -18, s: 5.4, r: 11, c: "#8a6746" },
                  { x: -9, s: 6.4, r: -7, c: "#3f0e22" },
                  { x: 0, s: 7.6, r: 6, c: "#54132e" },
                  { x: 9, s: 6.4, r: 13, c: "#3f0e22" },
                  { x: 18, s: 5.4, r: -11, c: "#8a6746" },
                  { x: 27, s: 4.4, r: 15, c: "#54132e" },
                ].map((t, i) => (
                  <rect
                    key={i}
                    x={t.x - t.s / 2}
                    y={-t.s / 2}
                    width={t.s}
                    height={t.s}
                    rx="0.6"
                    fill={t.c}
                    opacity={0.55 + (3 - Math.abs(i - 3)) * 0.13}
                    transform={`rotate(${t.r} ${t.x} 0)`}
                  />
                ))}
              </svg>
              <p className="eyebrow mt-4 text-terracotta">{prayer.epigraph}</p>
              <h2
                id="osc-prayer-title"
                className="font-serif mt-3 text-3xl italic text-burgundy md:text-[40px]"
              >
                {prayer.title}
              </h2>
            </div>

            {/* Prayer body — set like a manuscript page */}
            <div className="mx-auto mt-8 max-w-prose space-y-5 text-left font-serif text-lg leading-[1.8] text-ink/90 md:text-xl md:leading-[1.75]">
              {prayer.body.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-serif first-letter:text-[52px] first-letter:leading-[0.75] first-letter:text-burgundy"
                      : undefined
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Amen */}
            <div className="mt-9 flex items-center justify-center gap-3 text-center">
              <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-burgundy/50" />
              <p className="font-serif text-xl italic text-burgundy">Amen.</p>
              <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-burgundy/50" />
            </div>

            {/* The shore — a quiet band of Galilee water closes the card */}
            <div aria-hidden="true" className="-mx-8 mt-9 md:-mx-12">
              <svg
                viewBox="0 0 600 46"
                preserveAspectRatio="none"
                className="block h-10 w-full"
              >
                <defs>
                  <linearGradient id="prayer-shore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#a7c0d1" stopOpacity="0" />
                    <stop offset="0.55" stopColor="#7b9cb2" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#587e97" stopOpacity="0.42" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="600" height="46" fill="url(#prayer-shore)" />
                <path
                  d="M 0,16 C 60,11 120,13 180,17 S 300,22 360,16 S 480,10 540,16 L 600,16"
                  fill="none"
                  stroke="#e4eef4"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />
                <path
                  d="M 0,32 C 80,27 160,29 240,33 S 400,38 480,31 L 600,32"
                  fill="none"
                  stroke="#cadbe7"
                  strokeWidth="0.9"
                  strokeOpacity="0.4"
                  strokeDasharray="70 40"
                />
              </svg>
            </div>

            {/* Close — top-right */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close prayer"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-burgundy/70 transition hover:bg-burgundy/10 hover:text-burgundy"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
