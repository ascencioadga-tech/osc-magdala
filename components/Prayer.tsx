"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PrayerModal } from "@/components/PrayerModal";
import { prayer, hospitalityPrayer } from "@/lib/content";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

type ActivePrayer = "osc" | "hospitality" | null;

export function Prayer() {
  const [active, setActive] = useState<ActivePrayer>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, margin: "-10% 0px" });

  // Ambient background video — plays (muted) while the section is on screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.muted = true;
      v.play().catch(() => {
        /* ignore autoplay rejections */
      });
    } else {
      v.pause();
    }
  }, [inView]);

  return (
    <>
      <section
        id="prayer"
        ref={sectionRef}
        className="relative isolate overflow-hidden"
      >
        {/* Background video */}
        <div className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            poster="/jon17-osc-poster.jpg"
            className="h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src="/jon17video.mp4" type="video/mp4" />
          </video>
          {/* Light wine veil for legibility — same grammar as the hero */}
          <div className="absolute inset-0 bg-burgundy-ink/25" />
        </div>

        {/* Bottom-left anchored invitation */}
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-end px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: reverentEase }}
          >
            {/* Two prayers, laid like place cards at the table */}
            <div className="flex flex-wrap items-stretch gap-4">
              <button
                type="button"
                onClick={() => setActive("osc")}
                className="group w-[131px] -rotate-1 rounded-md border border-burgundy/20 bg-[#faf8f2] p-2.5 text-left shadow-[0_22px_46px_-18px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_30px_56px_-18px_rgba(0,0,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                style={{ borderTopWidth: 3, borderTopColor: "#54132e" }}
              >
                <span className="font-display block text-[12px] leading-tight text-burgundy">
                  The OSC Prayer
                </span>
                <span className="font-serif mt-1 block text-[9.5px] italic leading-snug text-ink/85">
                  &ldquo;Jesus, You built the Church on the twelve foundation
                  stones&hellip;&rdquo;
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-burgundy underline underline-offset-2 transition-colors group-hover:text-brown">
                  Read the prayer
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActive("hospitality")}
                className="group w-[131px] rotate-1 rounded-md border border-burgundy/20 bg-[#faf8f2] p-2.5 text-left shadow-[0_22px_46px_-18px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_30px_56px_-18px_rgba(0,0,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                style={{ borderTopWidth: 3, borderTopColor: "#54132e" }}
              >
                <span className="font-display block text-[12px] leading-tight text-burgundy">
                  The Hospitality Prayer
                </span>
                <span className="font-serif mt-1 block text-[9.5px] italic leading-snug text-ink/85">
                  &ldquo;Jesus, You came to dwell among us, totally dependent
                  on our hospitality&hellip;&rdquo;
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-burgundy underline underline-offset-2 transition-colors group-hover:text-brown">
                  Read the prayer
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <PrayerModal
        open={active !== null}
        onClose={() => setActive(null)}
        prayer={active === "hospitality" ? hospitalityPrayer : prayer}
      />
    </>
  );
}
