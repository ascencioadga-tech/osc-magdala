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
      className="relative overflow-hidden bg-parchment"
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
              className="group relative flex flex-col rounded-2xl border border-line-soft bg-cream/95 p-8 backdrop-blur-sm shadow-[0_18px_48px_-30px_rgba(63,16,25,0.35)] transition hover:border-burgundy/40 hover:shadow-[0_30px_60px_-25px_rgba(63,16,25,0.40)] md:p-10"
              style={{ borderTopWidth: 3, borderTopColor: "#C8923A" }}
            >
              {/* Number marker */}
              <div className="font-display flex items-baseline gap-3">
                <span className="text-5xl font-light text-burgundy/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-px w-10 translate-y-[-0.5rem] bg-gold/70"
                />
              </div>

              <h3 className="font-display mt-6 text-2xl leading-tight text-burgundy md:text-[30px]">
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
            <stop offset="0" stopColor="#ede0c4" stopOpacity="0" />
            <stop offset="0.3" stopColor="#cdd9e4" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#9eb7cb" stopOpacity="0.6" />
            <stop offset="0.8" stopColor="#cdd9e4" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ede0c4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Water mass spans the section so the cards float over it */}
        <rect x="0" y="0" width="1200" height="720" fill="url(#tas-water-bg)" />

        {/* DEEP back layer — slow flow */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="42s"
            repeatCount="indefinite"
          />
          <BackWaves x={0} />
          <BackWaves x={1200} />
        </g>

        {/* MID surface — wave lines */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="22s"
            repeatCount="indefinite"
          />
          <MidWaves x={0} />
          <MidWaves x={1200} />
        </g>

        {/* FRONT particles — fastest, foam + current marks */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="13s"
            repeatCount="indefinite"
          />
          <FrontParticles x={0} />
          <FrontParticles x={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

function BackWaves({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0,260 Q 200,232 400,260 T 800,260 T 1200,260"
        fill="none"
        stroke="#6A2045"
        strokeWidth="1.6"
        strokeOpacity="0.18"
      />
      <path
        d="M 0,360 Q 250,330 500,360 T 1000,360 T 1200,360"
        fill="none"
        stroke="#C8923A"
        strokeWidth="1.5"
        strokeOpacity="0.28"
      />
      <path
        d="M 0,460 Q 220,432 440,460 T 880,460 T 1200,460"
        fill="none"
        stroke="#6A2045"
        strokeWidth="1.6"
        strokeOpacity="0.18"
      />
    </g>
  );
}

function MidWaves({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {[300, 340, 400, 450, 510, 560, 620, 680].map((y, i) => {
        const stroke = i % 2 === 0 ? "#3E5C7A" : "#C8923A";
        const opacity = 0.5 - (i % 3) * 0.06;
        return (
          <path
            key={y}
            d={`M 0,${y} Q 120,${y - 8} 240,${y} T 480,${y} T 720,${y} T 960,${y} T 1200,${y}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            strokeOpacity={opacity}
          />
        );
      })}
    </g>
  );
}

function FrontParticles({ x }: { x: number }) {
  const dots: { x: number; y: number; r: number; c: string; o: number }[] = [
    { x: 60, y: 320, r: 2.2, c: "#FAF5EA", o: 0.85 },
    { x: 180, y: 400, r: 1.8, c: "#E0B964", o: 0.85 },
    { x: 300, y: 360, r: 2.4, c: "#FAF5EA", o: 0.9 },
    { x: 440, y: 500, r: 1.6, c: "#E0B964", o: 0.85 },
    { x: 560, y: 380, r: 2.2, c: "#FAF5EA", o: 0.85 },
    { x: 700, y: 460, r: 1.8, c: "#E0B964", o: 0.85 },
    { x: 820, y: 340, r: 2.4, c: "#FAF5EA", o: 0.9 },
    { x: 960, y: 480, r: 1.6, c: "#E0B964", o: 0.85 },
    { x: 1080, y: 360, r: 2.2, c: "#FAF5EA", o: 0.85 },
    { x: 1160, y: 440, r: 1.8, c: "#E0B964", o: 0.85 },
  ];
  const dashes: { x: number; y: number; w: number; c: string; o: number }[] = [
    { x: 110, y: 380, w: 18, c: "#FAF5EA", o: 0.65 },
    { x: 380, y: 440, w: 16, c: "#C8923A", o: 0.65 },
    { x: 620, y: 320, w: 22, c: "#FAF5EA", o: 0.6 },
    { x: 870, y: 420, w: 18, c: "#C8923A", o: 0.65 },
    { x: 1100, y: 510, w: 18, c: "#FAF5EA", o: 0.65 },
  ];
  return (
    <g transform={`translate(${x} 0)`}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
      ))}
      {dashes.map((d, i) => (
        <line
          key={i}
          x1={d.x}
          y1={d.y}
          x2={d.x + d.w}
          y2={d.y}
          stroke={d.c}
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity={d.o}
        />
      ))}
    </g>
  );
}
