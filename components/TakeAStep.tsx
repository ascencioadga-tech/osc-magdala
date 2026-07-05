"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { takeAStep } from "@/lib/content";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

export function TakeAStep() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  return (
    <section
      id="take-a-step"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      {/* Running stream backdrop */}
      <FlowingStreamBackground reveal={inView} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: reverentEase }}
          className="eyebrow text-terracotta"
        >
          {takeAStep.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
          className="font-display mt-4 max-w-3xl text-4xl leading-[1.05] text-burgundy md:text-[60px]"
        >
          {takeAStep.title}
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
          {takeAStep.paths.map((path, i) => (
            <motion.article
              key={path.key}
              id={path.key === "donors" ? "donate" : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                delay: 0.3 + i * 0.15,
                ease: reverentEase,
              }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className="group relative flex flex-col rounded-2xl border border-line-soft bg-cream/95 p-8 backdrop-blur-sm shadow-[0_18px_48px_-30px_rgba(63,14,34,0.35)] transition hover:border-burgundy/40 hover:shadow-[0_30px_60px_-25px_rgba(63,14,34,0.40)] md:p-10"
              style={{ borderTopWidth: 3, borderTopColor: "#633511" }}
            >
              {/* Small mosaic accent — three hand-set tiles */}
              <div aria-hidden="true" className="flex items-center gap-1.5">
                <span className="block h-2 w-2 rotate-45 bg-burgundy" />
                <span className="block h-1.5 w-1.5 rotate-45 bg-terracotta/80" />
                <span className="block h-1 w-1 rotate-45 bg-burgundy/40" />
              </div>

              <h3 className="font-display mt-5 text-2xl leading-tight text-burgundy md:text-[30px]">
                {path.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/80 md:text-base">
                {path.body}
              </p>
              <Link
                href={path.cta.href}
                className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-burgundy transition group-hover:text-terracotta"
              >
                {path.cta.label}{" "}
                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Flowing stream background ─────────────────────────────────────────
// The same water language as the Stepping Stones: depth gradient, filled
// swell ribbons, irregular broken crests, and twinkling glints — kept
// quieter here so the cards stay in front.

function FlowingStreamBackground({ reveal }: { reveal: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={reveal ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: reverentEase }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 720"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="tas-water-bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c9d8e2" stopOpacity="0" />
            <stop offset="0.3" stopColor="#a7c0d1" stopOpacity="0.3" />
            <stop offset="0.55" stopColor="#7b9cb2" stopOpacity="0.38" />
            <stop offset="0.8" stopColor="#a7c0d1" stopOpacity="0.3" />
            <stop offset="1" stopColor="#c9d8e2" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="720" fill="url(#tas-water-bg)" />

        {/* Swell ribbons — slow deep layer */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="46s"
            repeatCount="indefinite"
          />
          <TasSwells x={0} />
          <TasSwells x={1200} />
        </g>

        {/* Irregular crests — mid layer */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="26s"
            repeatCount="indefinite"
          />
          <TasCrests x={0} />
          <TasCrests x={1200} />
        </g>

        {/* Glints — fast front layer */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="14s"
            repeatCount="indefinite"
          />
          <TasGlints x={0} />
          <TasGlints x={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

function TasSwells({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0,300 C 66,288 134,288 200,300 S 334,312 400,300 S 534,288 600,300 S 734,312 800,300 S 934,288 1000,300 S 1134,312 1200,300 L 1200,352 C 1134,342 1066,342 1000,352 S 866,362 800,352 S 666,342 600,352 S 466,362 400,352 S 266,342 200,352 S 66,362 0,352 Z"
        fill="#7fa2bc"
        opacity="0.14"
      />
      <path
        d="M 0,452 C 50,442 100,442 150,452 S 250,462 300,452 S 400,442 450,452 S 550,462 600,452 S 700,442 750,452 S 850,462 900,452 S 1000,442 1050,452 S 1150,462 1200,452 L 1200,498 C 1150,490 1100,490 1050,498 S 950,506 900,498 S 800,490 750,498 S 650,506 600,498 S 500,490 450,498 S 350,506 300,498 S 200,490 150,498 S 50,506 0,498 Z"
        fill="#476e8a"
        opacity="0.16"
      />
    </g>
  );
}

function TasCrests({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0,264 C 55,257 95,260 150,264 S 260,271 330,263 S 470,254 540,264 S 660,273 730,263 S 860,255 930,264 S 1090,272 1200,264"
        fill="none"
        stroke="#e4eef4"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="90 46"
      />
      <path
        d="M 0,388 C 80,379 150,382 230,388 S 390,397 470,387 S 630,377 710,388 S 870,398 950,387 S 1110,379 1200,388"
        fill="none"
        stroke="#b9d0de"
        strokeWidth="0.9"
        strokeOpacity="0.3"
        strokeDasharray="120 70"
      />
      <path
        d="M 0,532 C 90,525 170,527 260,533 S 430,540 520,531 S 700,522 790,532 S 970,541 1060,531 L 1200,532"
        fill="none"
        stroke="#a5c0d1"
        strokeWidth="0.9"
        strokeOpacity="0.26"
        strokeDasharray="70 90"
      />
    </g>
  );
}

const TAS_GLINTS: { x: number; y: number; w: number }[] = [
  { x: 90, y: 322, w: 14 },
  { x: 330, y: 420, w: 10 },
  { x: 560, y: 300, w: 16 },
  { x: 760, y: 472, w: 10 },
  { x: 960, y: 356, w: 14 },
  { x: 1130, y: 500, w: 10 },
];

function TasGlints({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {TAS_GLINTS.map((g, i) => (
        <line
          key={i}
          x1={g.x}
          y1={g.y}
          x2={g.x + g.w}
          y2={g.y}
          stroke="#fdfaf2"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="water-glint"
          style={{ animationDelay: `${(i * 0.8) % 4.2}s` }}
        />
      ))}
    </g>
  );
}
