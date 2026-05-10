"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { prayer } from "@/lib/content";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

type PrayerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PrayerModal({ open, onClose }: PrayerModalProps) {
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
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line-soft bg-parchment p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] md:max-w-2xl md:p-12"
          >
            {/* Top ornament */}
            <div className="text-center">
              <span aria-hidden="true" className="text-2xl text-gold">
                ✦
              </span>
              <p className="eyebrow mt-3 text-terracotta">{prayer.epigraph}</p>
              <h2
                id="osc-prayer-title"
                className="font-serif mt-3 text-3xl italic text-burgundy md:text-[40px]"
              >
                {prayer.title}
              </h2>
              <span
                aria-hidden="true"
                className="mx-auto mt-5 block h-px w-16 bg-gold"
              />
            </div>

            {/* Prayer body */}
            <div className="mx-auto mt-8 max-w-prose space-y-5 text-center font-serif text-lg leading-[1.75] text-burgundy md:text-xl md:leading-[1.7]">
              {prayer.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {/* Bottom ornament + Amen */}
            <div className="mt-8 text-center">
              <span
                aria-hidden="true"
                className="mx-auto block h-px w-16 bg-gold"
              />
              <p className="eyebrow mt-5 text-terracotta">Amen.</p>
            </div>

            {/* Close button — top-right corner */}
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
