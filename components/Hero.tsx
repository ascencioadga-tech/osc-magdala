"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { hero } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

// Brand "we say" voice phrases — meditative cycle below the buttons.
const voiceLines = [
  "Pull up a chair.",
  "Come and see.",
  "Around one table, in one hope.",
  "A common life on the shore of Galilee.",
];

// Reverent ease — slow, deliberate, never bouncy.
const reverentEase = [0.22, 0.8, 0.32, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const wordReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%" },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked fade — hero content dissolves as you leave.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 60]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative isolate overflow-hidden"
    >
      {/* Background video + muted maroon-grey overlay for legibility */}
      <div className="absolute inset-0 -z-10">
        {/* Autoplaying, muted background video — the Galilee still is the
            poster shown until the first frame is ready. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-galilee.jpg"
          className="h-full w-full object-cover hero-slow-zoom"
          aria-hidden="true"
        >
          <source src="/magdala-crossroads-v2.mp4" type="video/mp4" />
        </video>
        {/* Desaturated maroon-grey wash — weighted to the left so the
            headline column sits on the darkest part and reads cleanly,
            easing off toward the video on the right. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(41,10,25,0.92) 0%, rgba(52,15,32,0.82) 38%, rgba(66,22,42,0.62) 62%, rgba(52,15,32,0.72) 100%)",
          }}
        />
        {/* Gentle base vignette for the edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(30,8,19,0.45) 100%)",
          }}
        />
      </div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-32 text-cream md:px-10 md:pb-32 md:pt-40 lg:justify-center"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_7fr] lg:gap-12 xl:gap-16">
          <div className="max-w-2xl lg:max-w-none">
            {/* Italic tagline — now the primary headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.95, delay: 0.2, ease: reverentEase }}
              className="font-serif text-[40px] italic leading-[1.05] tracking-tight text-cream md:text-[68px] lg:text-[54px] xl:text-[64px]"
              style={{ textShadow: "0 2px 26px rgba(0,0,0,0.5)" }}
            >
              {hero.tagline}
            </motion.h1>

            {/* Intro */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.8, delay: 1.3, ease: reverentEase }}
              className="mt-7 max-w-xl text-base leading-relaxed text-cream/95 md:text-lg"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
            >
              {hero.intro}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, delay: 1.55, ease: reverentEase }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                href={hero.primaryCta.href}
                className="group/cta relative inline-flex items-center justify-center overflow-hidden rounded-full bg-cream px-7 py-3.5 text-sm font-medium tracking-wide text-burgundy transition-colors duration-500 hover:text-cream"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-0 origin-left scale-x-0 bg-burgundy transition-transform duration-500 group-hover/cta:scale-x-100"
                />
                <span className="relative z-10">{hero.primaryCta.label}</span>
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-cream/50 px-7 py-3.5 text-sm font-medium text-cream transition hover:border-cream hover:bg-cream/10"
              >
                {hero.secondaryCta.label}
              </Link>
            </motion.div>

            {/* Rotating voice line */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, delay: 1.85, ease: reverentEase }}
              className="mt-10 flex h-7 items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-cream/80"
              />
              <RotatingVoice />
            </motion.div>
          </div>

          {/* Fr. Juan video — right column, maximized within its track */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.9, delay: 0.55, ease: reverentEase }}
            className="mt-12 w-full lg:mt-0 lg:max-w-[82%] lg:ml-auto"
          >
            <VideoPlayer
              src="/fr-juan-osc.mp4"
              type="video/mp4"
              poster="/fr-juan-osc-poster.jpg"
              label="Fr. Juan — the vision of One Step Closer"
              className="rounded-lg shadow-[0_30px_70px_-28px_rgba(41,8,24,0.7)]"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Quiet scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        style={{ opacity: contentOpacity }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <span className="eyebrow text-[10px] text-cream/55">Scroll Down</span>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mt-2 h-5 w-5 text-cream/60"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </motion.section>
  );
}


function RotatingVoice() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((v) => (v + 1) % voiceLines.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      aria-live="polite"
      className="font-serif relative h-7 w-full overflow-hidden text-base italic text-cream/70 md:text-lg"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.7, ease: reverentEase }}
          className="absolute left-0 top-0 inline-block"
        >
          {voiceLines[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
