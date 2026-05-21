"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { stones, type Stone as StoneData } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;
const ROMAN = ["I", "II", "III", "IV"] as const;

export function SteppingStones() {
  const [active, setActive] = useState<StoneData["number"] | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  const handleStoneClick = (n: StoneData["number"]) => {
    setHasInteracted(true);
    setActive((curr) => (curr === n ? null : n));
  };

  return (
    <section
      id="stepping-stones"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 md:px-10 md:pt-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: reverentEase }}
          className="eyebrow text-terracotta"
        >
          Four Stepping Stones
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
          className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] text-burgundy md:text-[56px]"
        >
          The path begins at Galilee.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: reverentEase }}
          className="font-serif mt-5 max-w-xl text-xl italic leading-snug text-ink/75 md:text-2xl"
        >
          Step on each stone to walk the path — from the first meal at Magdala
          to the encounter carried home.
        </motion.p>
      </div>

      {/* Stones path with water */}
      <div className="relative mt-14 md:mt-20">
        {/* Desktop horizontal — water river runs left to right */}
        <div className="relative hidden md:block">
          <WaterHorizontal reveal={inView} />
          <div className="relative mx-auto max-w-6xl px-10 pb-24 pt-20">
            <ol className="relative z-10 grid grid-cols-4 gap-6">
              {stones.map((stone, i) => (
                <li key={stone.number} className="flex justify-center">
                  <StoneButton
                    stone={stone}
                    variant={i}
                    isActive={active === stone.number}
                    showHint={!hasInteracted && stone.number === 1}
                    onClick={() => handleStoneClick(stone.number)}
                    delay={0.5 + i * 0.22}
                    reveal={inView}
                  />
                </li>
              ))}
            </ol>
            <FootprintTrailHorizontal reveal={inView} />
          </div>
        </div>

        {/* Mobile vertical — water column runs top to bottom */}
        <div className="relative block md:hidden">
          <WaterVertical reveal={inView} />
          <ol className="relative z-10 mx-auto block max-w-md px-6 pb-12 pt-6">
            {stones.map((stone, i) => (
              <li key={stone.number} className="flex flex-col items-center">
                <div
                  className={[
                    "flex w-full justify-center",
                    i % 2 === 0 ? "translate-x-3" : "-translate-x-3",
                  ].join(" ")}
                >
                  <StoneButton
                    stone={stone}
                    variant={i}
                    isActive={active === stone.number}
                    showHint={!hasInteracted && stone.number === 1}
                    onClick={() => handleStoneClick(stone.number)}
                    delay={0.45 + i * 0.18}
                    reveal={inView}
                  />
                </div>
                {i < stones.length - 1 ? (
                  <FootprintMobile
                    reveal={inView}
                    delay={1.3 + i * 0.45}
                    direction={i % 2 === 0 ? "left" : "right"}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Active stone panel */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10 md:px-10 md:pb-32">
        <AnimatePresence mode="wait">
          {active !== null ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: reverentEase }}
            >
              <StonePanel stone={stones[active - 1]} />
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="font-serif mx-auto max-w-md text-center text-lg italic text-burgundy/75"
            >
              <span aria-hidden="true" className="mr-2 text-gold">
                ✦
              </span>
              Tap a stone to step into the story.
              <span aria-hidden="true" className="ml-2 text-gold">
                ✦
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Stone graphic ────────────────────────────────────────────────────

// Four organic stone silhouettes — each a unique irregular blob.
const STONE_PATHS = [
  // I — flatter, slightly squashed disk
  "M 14,52 C 8,30 28,10 56,10 C 84,8 102,28 102,50 C 102,76 80,90 54,88 C 26,88 18,72 14,52 Z",
  // II — taller, off-balance pentagon
  "M 18,72 C 12,50 22,22 46,12 C 72,6 96,22 102,46 C 106,72 88,92 60,90 C 36,88 22,84 18,72 Z",
  // III — chunky, slightly tilted right
  "M 10,48 C 8,28 26,10 50,8 C 78,8 98,22 100,46 C 102,72 84,92 56,90 C 30,88 12,72 10,48 Z",
  // IV — asymmetric, broader bottom
  "M 24,84 C 8,76 4,52 14,30 C 28,12 56,8 80,18 C 100,30 104,58 92,76 C 78,92 46,94 24,84 Z",
];

function StoneButton({
  stone,
  variant,
  isActive,
  showHint,
  onClick,
  delay,
  reveal,
}: {
  stone: StoneData;
  variant: number;
  isActive: boolean;
  showHint: boolean;
  onClick: () => void;
  delay: number;
  reveal: boolean;
}) {
  const path = STONE_PATHS[variant % 4];
  const rotation = [-3, 2, -1.5, 3.5][variant % 4];
  const idx = stone.number - 1;
  const gid = `stone-${stone.number}`;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Stone ${stone.number}: ${stone.label}`}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={reveal ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.95, delay, ease: reverentEase }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      whileTap={{ scale: 0.96 }}
      className="group relative flex flex-col items-center focus:outline-none"
    >
      {/* Eyebrow label */}
      <span
        className={[
          "eyebrow z-10 mb-3 text-[11px] transition-colors duration-300",
          isActive
            ? "text-burgundy"
            : "text-ink/55 group-hover:text-burgundy",
        ].join(" ")}
        aria-hidden="true"
      >
        {stone.label}
      </span>

      <span
        className="relative block"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Pulse hint to invite the first tap */}
        {showHint ? (
          <span
            aria-hidden="true"
            className="stone-hint pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        ) : null}

        {/* Active gold ripple */}
        {isActive ? (
          <span
            aria-hidden="true"
            className="ripple-pulse pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
          />
        ) : null}

        {/* Reflection / shadow under stone in water */}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 h-3 w-[78%] -translate-x-1/2 rounded-full bg-burgundy-ink/45 blur-md"
        />

        {/* The stone itself */}
        <svg
          width="148"
          height="128"
          viewBox="0 0 112 100"
          className="relative block"
          style={{
            filter:
              "drop-shadow(0 10px 14px rgba(31,28,24,0.35)) drop-shadow(0 2px 0 rgba(255,255,255,0.10))",
          }}
        >
          <defs>
            <clipPath id={`${gid}-clip`}>
              <path d={path} />
            </clipPath>
          </defs>

          {/* Water ripple ABOVE the stone, behind it visually */}
          <ellipse
            cx="56"
            cy="100"
            rx="56"
            ry="6"
            fill="none"
            stroke="#e0b964"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <ellipse
            cx="56"
            cy="106"
            rx="42"
            ry="4"
            fill="none"
            stroke="#e0b964"
            strokeWidth="0.7"
            strokeOpacity="0.35"
          />

          {/* Stone body — solid dark fill so it reads as wet stone */}
          <path
            d={path}
            fill={isActive ? "#4a2e1d" : "#3a1f12"}
            stroke="#15090a"
            strokeWidth="1.6"
            strokeOpacity="0.85"
          />
          {/* Subtle bottom shadow inside the stone (water-side darker) */}
          <ellipse
            cx="56"
            cy="78"
            rx="46"
            ry="14"
            fill="#0a0303"
            opacity="0.45"
            clipPath={`url(#${gid}-clip)`}
          />

          {/* Sun-from-above highlight + texture, all clipped to stone shape */}
          <g clipPath={`url(#${gid}-clip)`}>
            {/* A small cream sheen ellipse at the top of the stone */}
            <ellipse
              cx="50"
              cy="22"
              rx="28"
              ry="9"
              fill="#fbf3df"
              opacity="0.18"
            />
            {/* Top-edge highlight stroke — catches light along the upper rim */}
            <path
              d={path}
              fill="none"
              stroke="#cdb38a"
              strokeWidth="1.6"
              strokeOpacity="0.55"
              transform="translate(0, -1.2)"
            />
            {/* Speckles — minerals / cracks */}
            {[
              [22, 38],
              [44, 30],
              [70, 34],
              [88, 46],
              [34, 52],
              [60, 58],
              [78, 62],
              [26, 66],
              [54, 72],
              [82, 78],
              [38, 78],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 1.1 : 0.7}
                fill={i % 4 === 0 ? "#cdb38a" : "#0a0503"}
                opacity={0.4 + (i % 3) * 0.1}
              />
            ))}
            {/* A tiny crack line */}
            <path
              d="M 30,30 q 12,8 24,4 q 14,-2 22,8"
              fill="none"
              stroke="#0a0503"
              strokeWidth="0.7"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />
          </g>

          {/* Roman numeral — engraved-feel */}
          <text
            x="56"
            y="64"
            textAnchor="middle"
            fontFamily='"Cormorant Garamond", Georgia, serif'
            fontSize="34"
            fontWeight="600"
            fontStyle="italic"
            fill="#e0b964"
            opacity={isActive ? 1 : 0.92}
            style={{
              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.55))",
              letterSpacing: "0.02em",
            }}
          >
            {ROMAN[idx]}
          </text>
        </svg>
      </span>

    </motion.button>
  );
}

// ─── Water backdrops ──────────────────────────────────────────────────

// ─── Stream content (drawn twice side-by-side for seamless looping) ───

function HBackWaves({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {/* Slow, soft sweeping waves — back depth */}
      <path
        d="M 0,140 Q 200,118 400,140 T 800,140 T 1200,140"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.8"
        strokeOpacity="0.55"
      />
      <path
        d="M 0,210 Q 250,188 500,210 T 1000,210 T 1200,210"
        fill="none"
        stroke="#e0b964"
        strokeWidth="1.4"
        strokeOpacity="0.5"
      />
      <path
        d="M 0,280 Q 220,258 440,280 T 880,280 T 1200,280"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.4"
        strokeOpacity="0.45"
      />
    </g>
  );
}

function HMidWaves({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {/* Medium wave lines — definite stream surface */}
      <path
        d="M 0,118 Q 100,108 200,118 T 400,118 T 600,118 T 800,118 T 1000,118 T 1200,118"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <path
        d="M 0,176 Q 120,164 240,176 T 480,176 T 720,176 T 960,176 T 1200,176"
        fill="none"
        stroke="#e0b964"
        strokeWidth="1.1"
        strokeOpacity="0.65"
      />
      <path
        d="M 0,244 Q 110,232 220,244 T 440,244 T 660,244 T 880,244 T 1100,244 T 1200,244"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      <path
        d="M 0,300 Q 130,290 260,300 T 520,300 T 780,300 T 1040,300 T 1200,300"
        fill="none"
        stroke="#e0b964"
        strokeWidth="0.9"
        strokeOpacity="0.5"
      />
    </g>
  );
}

function HFrontParticles({ x }: { x: number }) {
  // Foam dots and current dashes — fastest layer
  const dots: { x: number; y: number; r: number; c: string; o: number }[] = [
    { x: 60, y: 150, r: 1.6, c: "#faf5ea", o: 0.85 },
    { x: 170, y: 200, r: 1.2, c: "#faf5ea", o: 0.75 },
    { x: 290, y: 130, r: 1.8, c: "#faf5ea", o: 0.9 },
    { x: 420, y: 230, r: 1.0, c: "#e0b964", o: 0.85 },
    { x: 540, y: 175, r: 1.5, c: "#faf5ea", o: 0.8 },
    { x: 680, y: 260, r: 1.3, c: "#faf5ea", o: 0.75 },
    { x: 800, y: 145, r: 1.6, c: "#e0b964", o: 0.85 },
    { x: 930, y: 215, r: 1.2, c: "#faf5ea", o: 0.8 },
    { x: 1040, y: 285, r: 1.4, c: "#faf5ea", o: 0.7 },
    { x: 1140, y: 165, r: 1.6, c: "#e0b964", o: 0.85 },
  ];
  const dashes: { x: number; y: number; w: number; c: string; o: number }[] = [
    { x: 110, y: 175, w: 14, c: "#faf5ea", o: 0.7 },
    { x: 350, y: 215, w: 10, c: "#e0b964", o: 0.7 },
    { x: 580, y: 130, w: 16, c: "#faf5ea", o: 0.65 },
    { x: 760, y: 240, w: 12, c: "#e0b964", o: 0.7 },
    { x: 980, y: 175, w: 14, c: "#faf5ea", o: 0.7 },
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
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={d.o}
        />
      ))}
    </g>
  );
}

function WaterHorizontal({ reveal }: { reveal: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={reveal ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: reverentEase }}
      className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 360"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="water-bg-h" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#cdd9e4" stopOpacity="0" />
            <stop offset="0.18" stopColor="#9eb7cb" stopOpacity="0.42" />
            <stop offset="0.45" stopColor="#5e7e9b" stopOpacity="0.7" />
            <stop offset="0.78" stopColor="#3e5c7a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#1d4358" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="water-edge-h" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#faf5ea" stopOpacity="0" />
            <stop offset="0.1" stopColor="#faf5ea" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#faf5ea" stopOpacity="0.8" />
            <stop offset="0.9" stopColor="#faf5ea" stopOpacity="0.6" />
            <stop offset="1" stopColor="#faf5ea" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Stream bed — full width */}
        <path
          d="M 0,80 L 1200,80 L 1200,320 L 0,320 Z"
          fill="url(#water-bg-h)"
        />

        {/* Top shoreline */}
        <path
          d="M 0,84 Q 200,72 400,82 T 800,82 T 1200,82"
          fill="none"
          stroke="url(#water-edge-h)"
          strokeWidth="2"
        />

        {/* DEEP back layer — slowest flow */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="38s"
            repeatCount="indefinite"
          />
          <HBackWaves x={0} />
          <HBackWaves x={1200} />
        </g>

        {/* MID layer — wave surface */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="20s"
            repeatCount="indefinite"
          />
          <HMidWaves x={0} />
          <HMidWaves x={1200} />
        </g>

        {/* FRONT particles — fastest, most graphic */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="11s"
            repeatCount="indefinite"
          />
          <HFrontParticles x={0} />
          <HFrontParticles x={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

function WaterVertical({ reveal }: { reveal: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={reveal ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: reverentEase }}
      className="pointer-events-none absolute inset-y-0 left-1/2 h-full w-[88%] -translate-x-1/2 overflow-hidden"
    >
      <svg
        viewBox="0 0 320 1200"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="water-bg-v" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#cdd9e4" stopOpacity="0" />
            <stop offset="0.12" stopColor="#9eb7cb" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#3e5c7a" stopOpacity="0.78" />
            <stop offset="0.88" stopColor="#9eb7cb" stopOpacity="0.45" />
            <stop offset="1" stopColor="#cdd9e4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="320" height="1200" fill="url(#water-bg-v)" />

        {/* DEEP back waves — slow drift downward */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 -1200"
            to="0 0"
            dur="38s"
            repeatCount="indefinite"
          />
          <VBackWaves y={0} />
          <VBackWaves y={1200} />
        </g>

        {/* MID wave lines — surface ripples */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 -1200"
            to="0 0"
            dur="20s"
            repeatCount="indefinite"
          />
          <VMidWaves y={0} />
          <VMidWaves y={1200} />
        </g>

        {/* FRONT particles — foam and current marks */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 -1200"
            to="0 0"
            dur="11s"
            repeatCount="indefinite"
          />
          <VFrontParticles y={0} />
          <VFrontParticles y={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

function VBackWaves({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path
        d="M 30,160 Q 100,140 160,160 T 290,160"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.6"
        strokeOpacity="0.55"
      />
      <path
        d="M 30,420 Q 100,400 160,420 T 290,420"
        fill="none"
        stroke="#e0b964"
        strokeWidth="1.4"
        strokeOpacity="0.5"
      />
      <path
        d="M 30,680 Q 100,660 160,680 T 290,680"
        fill="none"
        stroke="#faf5ea"
        strokeWidth="1.6"
        strokeOpacity="0.5"
      />
      <path
        d="M 30,940 Q 100,920 160,940 T 290,940"
        fill="none"
        stroke="#e0b964"
        strokeWidth="1.4"
        strokeOpacity="0.45"
      />
    </g>
  );
}

function VMidWaves({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {Array.from({ length: 14 }).map((_, i) => {
        const lineY = 80 + i * 88;
        const stroke = i % 2 === 0 ? "#faf5ea" : "#e0b964";
        const opacity = 0.65 - (i % 3) * 0.08;
        return (
          <path
            key={i}
            d={`M 20,${lineY} Q 90,${lineY - 12} 160,${lineY} T 300,${lineY}`}
            fill="none"
            stroke={stroke}
            strokeWidth={i % 2 === 0 ? 1.2 : 1}
            strokeOpacity={opacity}
          />
        );
      })}
    </g>
  );
}

function VFrontParticles({ y }: { y: number }) {
  const dots: { x: number; y: number; r: number; c: string; o: number }[] = [
    { x: 70, y: 120, r: 1.6, c: "#faf5ea", o: 0.85 },
    { x: 220, y: 200, r: 1.3, c: "#faf5ea", o: 0.75 },
    { x: 110, y: 320, r: 1.8, c: "#e0b964", o: 0.85 },
    { x: 250, y: 440, r: 1.1, c: "#faf5ea", o: 0.85 },
    { x: 60, y: 540, r: 1.6, c: "#faf5ea", o: 0.8 },
    { x: 180, y: 660, r: 1.4, c: "#e0b964", o: 0.85 },
    { x: 240, y: 780, r: 1.2, c: "#faf5ea", o: 0.75 },
    { x: 90, y: 880, r: 1.8, c: "#faf5ea", o: 0.85 },
    { x: 200, y: 1000, r: 1.4, c: "#e0b964", o: 0.85 },
    { x: 130, y: 1120, r: 1.6, c: "#faf5ea", o: 0.8 },
  ];
  const dashes: { x: number; y: number; w: number; c: string; o: number }[] = [
    { x: 50, y: 240, w: 18, c: "#faf5ea", o: 0.7 },
    { x: 200, y: 380, w: 14, c: "#e0b964", o: 0.7 },
    { x: 90, y: 600, w: 20, c: "#faf5ea", o: 0.65 },
    { x: 220, y: 740, w: 14, c: "#e0b964", o: 0.7 },
    { x: 110, y: 940, w: 18, c: "#faf5ea", o: 0.7 },
  ];
  return (
    <g transform={`translate(0 ${y})`}>
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
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={d.o}
        />
      ))}
    </g>
  );
}

// ─── Footprints ──────────────────────────────────────────────────────

function FootprintTrailHorizontal({ reveal }: { reveal: boolean }) {
  // Walks across the path, alternating left/right between stones
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 mt-12 -translate-y-1/2"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-12">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              reveal
                ? { opacity: [0, 0.7, 0], scale: [0.6, 1, 1.1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.0,
              delay: 1.6 + i * 0.13,
              ease: "easeOut",
            }}
            className={[
              "inline-block",
              i % 2 === 0 ? "translate-y-2" : "-translate-y-2",
            ].join(" ")}
            style={{ transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)` }}
          >
            <FootprintIcon size={14} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function FootprintMobile({
  reveal,
  delay,
  direction,
}: {
  reveal: boolean;
  delay: number;
  direction: "left" | "right";
}) {
  return (
    <div
      aria-hidden="true"
      className="my-4 flex flex-col items-center gap-1.5"
    >
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -6 }}
          animate={reveal ? { opacity: [0, 0.7, 0], y: [-6, 4, 12] } : {}}
          transition={{
            duration: 1.4,
            delay: delay + i * 0.35,
            ease: "easeOut",
          }}
          className="inline-block"
          style={{
            transform: `translateX(${
              (direction === "left" ? -1 : 1) * (i === 0 ? 6 : -6)
            }px) rotate(${(direction === "left" ? -1 : 1) * (i === 0 ? -10 : 10)}deg)`,
          }}
        >
          <FootprintIcon size={14} />
        </motion.span>
      ))}
    </div>
  );
}

function FootprintIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 14 20"
      fill="none"
      role="presentation"
    >
      <ellipse cx="7" cy="13" rx="4" ry="5" fill="#6A2045" opacity="0.55" />
      <ellipse cx="4.5" cy="3.6" rx="1.3" ry="1.6" fill="#6A2045" opacity="0.55" />
      <ellipse cx="8" cy="2.6" rx="1" ry="1.2" fill="#6A2045" opacity="0.55" />
      <ellipse cx="10" cy="3.6" rx="0.85" ry="1" fill="#6A2045" opacity="0.55" />
      <ellipse cx="11.5" cy="5.4" rx="0.7" ry="0.9" fill="#6A2045" opacity="0.55" />
    </svg>
  );
}

// ─── Active stone panel ───────────────────────────────────────────────

function StonePanel({ stone }: { stone: StoneData }) {
  return (
    <div className="grid items-center gap-10 rounded-2xl border border-line-soft bg-cream p-8 shadow-[0_30px_60px_-30px_rgba(63,16,25,0.25)] md:grid-cols-[1.1fr_1fr] md:p-12">
      <div>
        <p className="eyebrow text-terracotta">
          Stone {stone.number} · {stone.label}
        </p>
        <h3 className="font-display mt-4 text-3xl leading-tight text-burgundy md:text-[40px]">
          {stone.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-ink/85 md:text-lg">
          {stone.body}
        </p>
        <Link
          href={stone.cta.href}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
        >
          {stone.cta.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
      {stone.youtube ? (
        <YouTubeStoneFrame
          url={stone.youtube}
          label={`Stone ${stone.number} — ${stone.label} video`}
        />
      ) : stone.video ? (
        <VideoPlayer
          src={stone.video}
          type="video/mp4"
          label={`Stone ${stone.number} — ${stone.label} video`}
        />
      ) : stone.images && stone.images.length > 0 ? (
        <StoneCarousel
          images={stone.images}
          label={`Stone ${stone.number} — ${stone.label}`}
        />
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
          <PhotoPlaceholder
            label={`Photo · Stone ${stone.number} · ${stone.label}`}
          />
        </div>
      )}
    </div>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-sand via-parchment to-gold-light/40">
      <div className="eyebrow text-center text-[11px] text-burgundy/65">
        {label}
      </div>
    </div>
  );
}

// ─── Stone photo carousel ─────────────────────────────────────────────
// Auto-advancing 3:2 frame with crossfade + slow Ken-Burns drift,
// pause-on-hover, click-dot navigation, and a soft caption strip.

function StoneCarousel({
  images,
  label,
}: {
  images: NonNullable<StoneData["images"]>;
  label: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % images.length),
      5400,
    );
    return () => window.clearInterval(id);
  }, [images.length, paused]);

  const current = images[i];

  return (
    <figure
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex flex-col"
      aria-label={label}
    >
      {/* Frame — adapts its aspect-ratio to whichever image is currently
          showing, so every shot fills the box edge-to-edge with zero
          cropping. CSS transitions smooth the height change between slides. */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-burgundy-ink shadow-[0_24px_50px_-28px_rgba(63,16,25,0.35)] transition-[aspect-ratio] duration-700 ease-out"
        style={{ aspectRatio: `${current.width} / ${current.height}` }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: reverentEase }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt ?? label}
              fill
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 44vw, 92vw"
              className="object-cover"
              priority={i === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Top-left corner label */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 text-cream/90">
          <span className="block h-px w-6 bg-gold-light" />
          <span className="text-[10px] uppercase tracking-[0.28em]">
            Magdala Restaurant
          </span>
        </div>

        {/* Caption — gradient strip on top of image */}
        {current.caption ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy-deep/85 via-burgundy-deep/30 to-transparent px-4 py-3">
            <p className="font-serif text-sm italic text-cream md:text-base">
              {current.caption}
            </p>
          </div>
        ) : null}
      </div>

      {/* Dot indicators + paused state */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {images.map((s, idx) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show image ${idx + 1}${s.caption ? `: ${s.caption}` : ""}`}
              className={[
                "h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out",
                idx === i
                  ? "w-10 bg-burgundy"
                  : "w-1.5 bg-burgundy/25 hover:bg-burgundy/45",
              ].join(" ")}
            />
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55">
          {paused ? "Paused" : "Auto"}
        </span>
      </div>
    </figure>
  );
}

// ─── YouTube frame for a stone panel ──────────────────────────────────
// Accepts any standard YouTube URL form (watch?v=, youtu.be/, /embed/),
// or a bare 11-char video ID. Parses the optional `t=` / `start=` param
// for a deep-link start time (supports "4s", "1m30s", or bare seconds).

function parseYouTube(input: string): { id: string; start?: number } | null {
  if (!input) return null;
  const trimmed = input.trim();
  // Bare 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return { id: trimmed };

  let id: string | null = null;
  let timeParam: string | null = null;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      id = url.pathname.replace(/^\//, "").split("/")[0] ?? null;
    } else if (url.pathname.startsWith("/embed/")) {
      id = url.pathname.split("/")[2] ?? null;
    } else {
      id = url.searchParams.get("v");
    }
    timeParam = url.searchParams.get("t") ?? url.searchParams.get("start");
  } catch {
    // Fallback regex parsing for malformed URLs
    const m =
      trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ??
      trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ??
      trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) id = m[1];
  }

  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;

  let start: number | undefined;
  if (timeParam) {
    if (/^\d+$/.test(timeParam)) {
      start = parseInt(timeParam, 10);
    } else {
      // "1h2m3s" / "2m30s" / "45s" forms
      const h = timeParam.match(/(\d+)h/)?.[1];
      const m = timeParam.match(/(\d+)m/)?.[1];
      const s = timeParam.match(/(\d+)s/)?.[1];
      const total =
        (h ? parseInt(h, 10) * 3600 : 0) +
        (m ? parseInt(m, 10) * 60 : 0) +
        (s ? parseInt(s, 10) : 0);
      if (total > 0) start = total;
    }
  }
  return { id, start };
}

function YouTubeStoneFrame({ url, label }: { url: string; label: string }) {
  const parsed = parseYouTube(url);

  if (!parsed) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line-soft bg-burgundy-ink">
        <div className="grid h-full w-full place-items-center">
          <p className="font-serif text-sm italic text-cream/60">
            Video unavailable
          </p>
        </div>
      </div>
    );
  }

  // youtube-nocookie + modestbranding + rel=0 keeps the player feeling
  // hosted-by-OSC rather than a heavy external embed.
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (parsed.start) params.set("start", String(parsed.start));

  const src = `https://www.youtube-nocookie.com/embed/${parsed.id}?${params.toString()}`;

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line-soft bg-burgundy-ink shadow-[0_24px_50px_-28px_rgba(63,16,25,0.35)]">
        <iframe
          src={src}
          title={label}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {/* Editorial corner ornaments — match the rest of the brand */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-5 w-5 border-l border-t border-gold-light/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -bottom-3 h-5 w-5 border-b border-r border-gold-light/55"
      />
    </div>
  );
}
