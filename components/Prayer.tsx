"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PrayerModal } from "@/components/PrayerModal";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

export function Prayer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="prayer"
        className="relative isolate overflow-hidden"
      >
        {/* Background video — Jon17 OSC */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src="/jon17-osc.mp4" type="video/mp4" />
          </video>
          {/* Burgundy ceremonial overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 30% 20%, rgba(92,26,43,0.45) 0%, rgba(63,16,25,0.65) 60%, rgba(42,8,16,0.80) 100%)",
            }}
          />
        </div>

        {/* Bottom-left anchored button */}
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-end px-6 pb-10 pt-24 md:px-10 md:pb-16 md:pt-32">
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: reverentEase }}
            className="group/cta inline-flex items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-sm font-medium tracking-wide text-burgundy transition hover:bg-gold hover:text-burgundy-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-ink"
          >
            <span aria-hidden="true" className="text-gold-deep">
              ✦
            </span>
            OSC Prayer
            <span
              aria-hidden="true"
              className="transition-transform group-hover/cta:translate-x-0.5"
            >
              →
            </span>
          </motion.button>
        </div>
      </section>

      <PrayerModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
