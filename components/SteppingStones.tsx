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
          The path begins in Galilee.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: reverentEase }}
          className="font-serif mt-5 max-w-xl text-xl italic leading-snug text-ink/75 md:text-2xl"
        >
          Step on each stone to walk the path from acting on Jesus&rsquo;
          Oneness Prayer in Galilee to living oneness at home.
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
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="mx-auto flex max-w-md items-center justify-center gap-3.5"
            >
              {/* A stone touching water — the ripple your tap will make */}
              <svg
                viewBox="0 0 40 40"
                className="h-9 w-9 shrink-0"
                aria-hidden="true"
              >
                <circle cx="20" cy="20" r="4.5" fill="none" stroke="#7a95b0" strokeWidth="1">
                  <animate attributeName="r" values="4.5;16" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.55;0" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="20" r="4.5" fill="none" stroke="#7a95b0" strokeWidth="1">
                  <animate attributeName="r" values="4.5;16" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.55;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                </circle>
                <ellipse cx="20" cy="20" rx="5.5" ry="4.6" fill="#6e6252" />
                <ellipse cx="18.6" cy="18.4" rx="2.6" ry="1.8" fill="#8d816c" opacity="0.65" />
              </svg>
              <p className="font-serif text-left text-lg italic leading-snug text-burgundy/80">
                The path crosses the water &mdash; step onto the first stone.
              </p>
            </motion.div>
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
          className="absolute -bottom-2 left-1/2 h-3 w-[78%] -translate-x-1/2 rounded-full bg-[#16242e]/50 blur-md"
        />

        {/* The stone itself — natural river rock: taupe-grey basalt with a
            displacement-roughened silhouette, mineral grain, a wet darkened
            base where it meets the water, and foam lapping the waterline. */}
        <svg
          width="148"
          height="128"
          viewBox="0 0 112 100"
          className="relative block overflow-visible"
          style={{
            filter: "drop-shadow(0 10px 14px rgba(20,26,30,0.4))",
          }}
        >
          <defs>
            <clipPath id={`${gid}-clip`}>
              <path d={path} />
            </clipPath>
            {/* Natural stone body — lit upper-left, falling to deep umber */}
            <radialGradient id={`${gid}-body`} cx="0.36" cy="0.28" r="1.0">
              <stop offset="0" stopColor="#9a8b76" />
              <stop offset="0.35" stopColor="#7a6c5b" />
              <stop offset="0.65" stopColor="#574c40" />
              <stop offset="0.85" stopColor="#3a322a" />
              <stop offset="1" stopColor="#241f19" />
            </radialGradient>
            {/* Wet base — cool watery darkening on the lower third */}
            <linearGradient id={`${gid}-wet`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.5" stopColor="#101820" stopOpacity="0" />
              <stop offset="0.74" stopColor="#101820" stopOpacity="0.34" />
              <stop offset="1" stopColor="#0a1218" stopOpacity="0.62" />
            </linearGradient>
            {/* Diffuse skylight on the crown — broad, not glossy */}
            <radialGradient id={`${gid}-light`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#f4efe4" stopOpacity="0.22" />
              <stop offset="0.7" stopColor="#f4efe4" stopOpacity="0.06" />
              <stop offset="1" stopColor="#f4efe4" stopOpacity="0" />
            </radialGradient>
            {/* Roughen the vector silhouette into hewn rock */}
            <filter id={`${gid}-rough`} x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.04 + (variant % 4) * 0.006}
                numOctaves="3"
                seed={21 + stone.number * 7}
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
            </filter>
            {/* Fine mineral grain */}
            <filter id={`${gid}-grain`} x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="2"
                seed={5 + stone.number}
              />
              <feColorMatrix
                values="0 0 0 0 0.08
                        0 0 0 0 0.07
                        0 0 0 0 0.05
                        0 0 0 0.55 0"
              />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
            {/* Coarse weathering blotches */}
            <filter id={`${gid}-blotch`} x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.07"
                numOctaves="2"
                seed={40 + stone.number * 3}
              />
              <feColorMatrix
                values="0 0 0 0 0.55
                        0 0 0 0 0.5
                        0 0 0 0 0.42
                        0 0 0 0.4 -0.08"
              />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Foam where the water laps the stone */}
          <ellipse
            cx="56"
            cy="93"
            rx="52"
            ry="6.5"
            fill="none"
            stroke="#edf4f8"
            strokeWidth="1.3"
            strokeOpacity="0.5"
          />
          <ellipse
            cx="56"
            cy="97"
            rx="40"
            ry="4.5"
            fill="none"
            stroke="#dfeaf1"
            strokeWidth="0.9"
            strokeOpacity="0.35"
            strokeDasharray="10 7"
          />

          {/* Rock body + texture, silhouette roughened as one group */}
          <g filter={`url(#${gid}-rough)`}>
            <path d={path} fill={`url(#${gid}-body)`} />
            <g clipPath={`url(#${gid}-clip)`}>
              {/* weathering + grain */}
              <rect x="0" y="0" width="112" height="100" fill="#000" filter={`url(#${gid}-blotch)`} opacity="0.5" />
              <rect x="0" y="0" width="112" height="100" fill="#000" filter={`url(#${gid}-grain)`} opacity="0.5" />
              {/* tonal mottling — lichen-grey patches */}
              <ellipse cx="38" cy="34" rx="20" ry="12" fill="#8d816c" opacity="0.2" />
              <ellipse cx="74" cy="56" rx="18" ry="11" fill="#6e6250" opacity="0.22" />
              <ellipse cx="52" cy="74" rx="22" ry="10" fill="#4e463c" opacity="0.25" />
              {/* speckles — mixed minerals */}
              {[
                [22, 38, 0.9, "#211c16"],
                [44, 28, 0.7, "#a89a86"],
                [70, 34, 1.0, "#211c16"],
                [88, 46, 0.6, "#8d816c"],
                [34, 52, 0.8, "#1a1610"],
                [60, 56, 0.6, "#a89a86"],
                [78, 64, 0.9, "#211c16"],
                [28, 66, 0.6, "#8d816c"],
                [54, 70, 0.8, "#1a1610"],
                [82, 76, 0.6, "#211c16"],
              ].map(([x, y, r, c], i) => (
                <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity={0.4 + (i % 3) * 0.12} />
              ))}
              {/* hairline fissures */}
              <path
                d="M 28,32 q 14,7 26,3 q 12,-3 20,6"
                fill="none"
                stroke="#17120d"
                strokeWidth="0.6"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
              <path
                d="M 62,68 q 8,4 16,2"
                fill="none"
                stroke="#17120d"
                strokeWidth="0.5"
                strokeOpacity="0.32"
                strokeLinecap="round"
              />
              {/* broad diffuse skylight */}
              <ellipse cx="44" cy="26" rx="34" ry="18" fill={`url(#${gid}-light)`} />
              {/* ambient occlusion pooling at the base */}
              <ellipse cx="56" cy="84" rx="46" ry="16" fill="#0c1014" opacity="0.35" />
              {/* wet darkening where the stone sits in water */}
              <rect x="0" y="0" width="112" height="100" fill={`url(#${gid}-wet)`} />
              {/* thin waterline sheen on the wet band */}
              <path
                d="M 12,66 Q 56,60 100,66"
                fill="none"
                stroke="#bcd3de"
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              {/* active warmth — a candle-glow lift when selected */}
              {isActive ? (
                <rect x="0" y="0" width="112" height="100" fill="#b19277" opacity="0.12" />
              ) : null}
            </g>
          </g>

          {/* Roman numeral — chiselled into the face, natural bone tone */}
          <text
            x="56.8"
            y="64.8"
            textAnchor="middle"
            fontFamily='"Cormorant Garamond", Georgia, serif'
            fontSize="34"
            fontWeight="600"
            fontStyle="italic"
            fill="#120e0a"
            opacity="0.65"
            style={{ letterSpacing: "0.02em" }}
            aria-hidden="true"
          >
            {ROMAN[idx]}
          </text>
          <text
            x="56"
            y="64"
            textAnchor="middle"
            fontFamily='"Cormorant Garamond", Georgia, serif'
            fontSize="34"
            fontWeight="600"
            fontStyle="italic"
            fill={isActive ? "#ece3d2" : "#d9cfbc"}
            opacity="0.95"
            style={{ letterSpacing: "0.02em" }}
          >
            {ROMAN[idx]}
          </text>
        </svg>
      </span>

    </motion.button>
  );
}

// ─── Water backdrops ──────────────────────────────────────────────────
// Realistic layered water: a depth gradient, filled swell ribbons drifting
// at three parallax speeds, irregular broken crest lines with a slow
// vertical bob, a breathing sun-sheen, and twinkling specular glints.
// All geometry is deterministic (no randomness → no hydration drift) and
// every band repeats exactly at the tile width for a seamless SMIL loop.

/* Filled swell ribbons — the slow, deep layer. Ribbon edges repeat every
   300 units, so tiles join invisibly at x = 1200. */
function HSwells({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0,150 C 50,140 100,140 150,150 S 250,160 300,150 S 400,140 450,150 S 550,160 600,150 S 700,140 750,150 S 850,160 900,150 S 1000,140 1050,150 S 1150,160 1200,150 L 1200,196 C 1150,188 1100,188 1050,196 S 950,204 900,196 S 800,188 750,196 S 650,204 600,196 S 500,188 450,196 S 350,204 300,196 S 200,188 150,196 S 50,204 0,196 Z"
        fill="#7fa2bc"
        opacity="0.20"
      />
      <path
        d="M 0,238 C 66,226 134,226 200,238 S 334,250 400,238 S 534,226 600,238 S 734,250 800,238 S 934,226 1000,238 S 1134,250 1200,238 L 1200,290 C 1134,280 1066,280 1000,290 S 866,300 800,290 S 666,280 600,290 S 466,300 400,290 S 266,280 200,290 S 66,300 0,290 Z"
        fill="#476e8a"
        opacity="0.24"
      />
    </g>
  );
}

/* Irregular crest lines — the mid layer. Mixed wavelengths and broken
   (dashed) crests read as real chop rather than pen lines. */
function HCrests({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0,124 C 55,117 95,120 150,124 S 260,131 330,123 S 470,114 540,124 S 660,133 730,123 S 860,115 930,124 S 1090,132 1200,124"
        fill="none"
        stroke="#e4eef4"
        strokeWidth="1.1"
        strokeOpacity="0.4"
        strokeDasharray="90 46"
      />
      <path
        d="M 0,178 C 80,169 150,172 230,178 S 390,187 470,177 S 630,167 710,178 S 870,188 950,177 S 1110,169 1200,178"
        fill="none"
        stroke="#b9d0de"
        strokeWidth="1"
        strokeOpacity="0.34"
        strokeDasharray="120 70"
      />
      <path
        d="M 0,232 C 60,226 110,228 170,233 S 290,240 360,231 S 500,222 570,232 S 710,241 780,231 S 930,223 1010,232 S 1140,238 1200,232"
        fill="none"
        stroke="#d3e2eb"
        strokeWidth="0.9"
        strokeOpacity="0.3"
      />
      <path
        d="M 0,282 C 90,275 170,277 260,283 S 430,290 520,281 S 700,272 790,282 S 970,291 1060,281 L 1200,282"
        fill="none"
        stroke="#a5c0d1"
        strokeWidth="0.9"
        strokeOpacity="0.28"
        strokeDasharray="70 90"
      />
    </g>
  );
}

/* Specular glints + drifting foam — the fast front layer. Each glint
   twinkles on its own (deterministic) delay while the layer drifts. */
const H_GLINTS: { x: number; y: number; w: number; warm?: boolean }[] = [
  { x: 70, y: 146, w: 16 },
  { x: 190, y: 214, w: 10, warm: true },
  { x: 300, y: 132, w: 20 },
  { x: 405, y: 246, w: 12 },
  { x: 505, y: 176, w: 18, warm: true },
  { x: 640, y: 268, w: 10 },
  { x: 730, y: 150, w: 22 },
  { x: 845, y: 226, w: 12, warm: true },
  { x: 950, y: 186, w: 16 },
  { x: 1060, y: 262, w: 10 },
  { x: 1140, y: 156, w: 18, warm: true },
];

function HGlints({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {H_GLINTS.map((g, i) => (
        <line
          key={i}
          x1={g.x}
          y1={g.y}
          x2={g.x + g.w}
          y2={g.y}
          stroke={g.warm ? "#f2ece0" : "#fdfaf2"}
          strokeWidth="1.8"
          strokeLinecap="round"
          className="water-glint"
          style={{ animationDelay: `${(i * 0.7) % 4.2}s` }}
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
            <stop offset="0" stopColor="#c9d8e2" stopOpacity="0" />
            <stop offset="0.12" stopColor="#a7c0d1" stopOpacity="0.55" />
            <stop offset="0.36" stopColor="#7b9cb2" stopOpacity="0.82" />
            <stop offset="0.6" stopColor="#587e97" stopOpacity="0.9" />
            <stop offset="0.84" stopColor="#3d617a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#2c4c62" stopOpacity="0" />
          </linearGradient>
          {/* Organic tonal patches — break up any banding so the surface
              reads as moving water, not ruled stripes */}
          <filter id="water-organic-h" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.03"
              numOctaves="2"
              seed="11"
            />
            <feColorMatrix
              values="0 0 0 0 0.13
                      0 0 0 0 0.27
                      0 0 0 0 0.36
                      0 0 0 0.5 -0.06"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="water-organic-h2" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.045"
              numOctaves="2"
              seed="29"
            />
            <feColorMatrix
              values="0 0 0 0 0.87
                      0 0 0 0 0.92
                      0 0 0 0 0.95
                      0 0 0 0.4 -0.08"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id="water-edge-h" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f0efec" stopOpacity="0" />
            <stop offset="0.1" stopColor="#f0efec" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#f0efec" stopOpacity="0.75" />
            <stop offset="0.9" stopColor="#f0efec" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f0efec" stopOpacity="0" />
          </linearGradient>
          <clipPath id="water-clip-h">
            <rect x="0" y="80" width="1200" height="240" />
          </clipPath>
          <radialGradient id="water-sun-h" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fdf8ec" stopOpacity="0.32" />
            <stop offset="0.55" stopColor="#fdf8ec" stopOpacity="0.10" />
            <stop offset="1" stopColor="#fdf8ec" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Water body */}
        <path d="M 0,80 L 1200,80 L 1200,320 L 0,320 Z" fill="url(#water-bg-h)" />

        {/* Shoreline */}
        <path
          d="M 0,84 Q 200,72 400,82 T 800,82 T 1200,82"
          fill="none"
          stroke="url(#water-edge-h)"
          strokeWidth="2"
        />

        {/* Sky reflection — long soft streaks of light near the far shore */}
        <ellipse cx="380" cy="122" rx="200" ry="10" fill="#eef5f9" opacity="0.12" />
        <ellipse cx="820" cy="136" rx="260" ry="12" fill="#eef5f9" opacity="0.1" />
        <ellipse cx="600" cy="108" rx="150" ry="7" fill="#f6fafc" opacity="0.14" />

        {/* Organic tone patches — static (rasterized once). Animating these
            forced huge turbulence filters to re-render per frame and tanked
            the water's frame rate on slower machines. */}
        <g clipPath="url(#water-clip-h)">
          <rect x="0" y="80" width="1200" height="240" fill="#22455c" filter="url(#water-organic-h)" opacity="0.16" />
          <rect x="0" y="80" width="1200" height="240" fill="#dfeaf1" filter="url(#water-organic-h2)" opacity="0.1" />
        </g>

        {/* Sun-sheen — slow breathing patch of reflected light */}
        <g
          className="water-sheen"
          style={{ transformBox: "view-box", transformOrigin: "50% 55%" }}
        >
          <ellipse cx="620" cy="198" rx="330" ry="104" fill="url(#water-sun-h)" />
        </g>

        {/* DEEP swells — slowest drift */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="36s"
            repeatCount="indefinite"
          />
          <HSwells x={0} />
          <HSwells x={1200} />
        </g>

        {/* MID crests — drift + a slow vertical bob (nested transforms) */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0; 0 4; 0 0"
            keyTimes="0; 0.5; 1"
            dur="7s"
            repeatCount="indefinite"
          />
          <g>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              from="0 0"
              to="-1200 0"
              dur="19s"
              repeatCount="indefinite"
            />
            <HCrests x={0} />
            <HCrests x={1200} />
          </g>
        </g>

        {/* FRONT glints — fastest drift, twinkling */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 0"
            to="-1200 0"
            dur="10s"
            repeatCount="indefinite"
          />
          <HGlints x={0} />
          <HGlints x={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

/* Vertical (mobile) variants — the same layering rotated 90°. */
function VSwells({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path
        d="M 88,0 C 78,50 78,100 88,150 S 98,250 88,300 S 78,400 88,450 S 98,550 88,600 S 78,700 88,750 S 98,850 88,900 S 78,1000 88,1050 S 98,1150 88,1200 L 128,1200 C 120,1150 120,1100 128,1050 S 136,950 128,900 S 120,800 128,750 S 136,650 128,600 S 120,500 128,450 S 136,350 128,300 S 120,200 128,150 S 136,50 128,0 Z"
        fill="#7fa2bc"
        opacity="0.2"
      />
      <path
        d="M 196,0 C 184,66 184,134 196,200 S 208,334 196,400 S 184,534 196,600 S 208,734 196,800 S 184,934 196,1000 S 208,1134 196,1200 L 244,1200 C 236,1134 236,1066 244,1000 S 252,866 244,800 S 236,666 244,600 S 252,466 244,400 S 236,266 244,200 S 252,66 244,0 Z"
        fill="#476e8a"
        opacity="0.24"
      />
    </g>
  );
}

function VCrests({ y }: { y: number }) {
  const lines = [
    { x: 74, amp: 8, period: 260, color: "#e4eef4", w: 1.1, o: 0.38, dash: "80 44" },
    { x: 138, amp: 10, period: 340, color: "#b9d0de", w: 1, o: 0.32, dash: "110 66" },
    { x: 196, amp: 7, period: 210, color: "#d3e2eb", w: 0.9, o: 0.3, dash: "" },
    { x: 250, amp: 9, period: 310, color: "#a5c0d1", w: 0.9, o: 0.27, dash: "64 84" },
  ];
  return (
    <g transform={`translate(0 ${y})`}>
      {lines.map((l, i) => {
        const half = l.period / 2;
        let d = `M ${l.x},0`;
        for (let yy = 0; yy < 1200; yy += l.period) {
          d += ` C ${l.x - l.amp},${yy + half * 0.33} ${l.x - l.amp},${yy + half * 0.66} ${l.x},${yy + half}`;
          d += ` C ${l.x + l.amp},${yy + half + half * 0.33} ${l.x + l.amp},${yy + half + half * 0.66} ${l.x},${yy + l.period}`;
        }
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={l.color}
            strokeWidth={l.w}
            strokeOpacity={l.o}
            strokeDasharray={l.dash || undefined}
          />
        );
      })}
    </g>
  );
}

const V_GLINTS: { x: number; y: number; w: number; warm?: boolean }[] = [
  { x: 72, y: 110, w: 12 },
  { x: 210, y: 220, w: 9, warm: true },
  { x: 120, y: 340, w: 14 },
  { x: 240, y: 470, w: 9 },
  { x: 66, y: 580, w: 13, warm: true },
  { x: 180, y: 700, w: 9 },
  { x: 236, y: 820, w: 12, warm: true },
  { x: 96, y: 930, w: 10 },
  { x: 200, y: 1050, w: 13 },
  { x: 130, y: 1150, w: 9, warm: true },
];

function VGlints({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {V_GLINTS.map((g, i) => (
        <line
          key={i}
          x1={g.x}
          y1={g.y}
          x2={g.x + g.w}
          y2={g.y}
          stroke={g.warm ? "#f2ece0" : "#fdfaf2"}
          strokeWidth="1.8"
          strokeLinecap="round"
          className="water-glint"
          style={{ animationDelay: `${(i * 0.9) % 4.2}s` }}
        />
      ))}
    </g>
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
            <stop offset="0" stopColor="#c9d8e2" stopOpacity="0" />
            <stop offset="0.14" stopColor="#a7c0d1" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#587e97" stopOpacity="0.85" />
            <stop offset="0.86" stopColor="#a7c0d1" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c9d8e2" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="water-sun-v" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fdf8ec" stopOpacity="0.3" />
            <stop offset="0.55" stopColor="#fdf8ec" stopOpacity="0.1" />
            <stop offset="1" stopColor="#fdf8ec" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="320" height="1200" fill="url(#water-bg-v)" />

        {/* Sun-sheen */}
        <g
          className="water-sheen"
          style={{ transformBox: "view-box", transformOrigin: "50% 30%" }}
        >
          <ellipse cx="160" cy="360" rx="110" ry="290" fill="url(#water-sun-v)" />
        </g>

        {/* DEEP swells — slow drift downstream */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 -1200"
            to="0 0"
            dur="36s"
            repeatCount="indefinite"
          />
          <VSwells y={0} />
          <VSwells y={1200} />
        </g>

        {/* MID crests — drift + sideways bob */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0; 3 0; 0 0"
            keyTimes="0; 0.5; 1"
            dur="7s"
            repeatCount="indefinite"
          />
          <g>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              from="0 -1200"
              to="0 0"
              dur="19s"
              repeatCount="indefinite"
            />
            <VCrests y={0} />
            <VCrests y={1200} />
          </g>
        </g>

        {/* FRONT glints */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0 -1200"
            to="0 0"
            dur="10s"
            repeatCount="indefinite"
          />
          <VGlints y={0} />
          <VGlints y={1200} />
        </g>
      </svg>
    </motion.div>
  );
}

// ─── Active stone panel ───────────────────────────────────────────────

function StonePanel({ stone }: { stone: StoneData }) {
  const [expanded, setExpanded] = useState(false);
  const [genesisOpen, setGenesisOpen] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const panelId = `stone-${stone.number}-expand`;
  const genesisId = `stone-${stone.number}-genesis`;
  const hasExpand = Boolean(stone.expand);
  const sectionCount = stone.expand?.sections.length ?? 0;
  const safeIndex = Math.min(sectionIndex, Math.max(sectionCount - 1, 0));
  const activeSection = stone.expand?.sections[safeIndex];

  return (
    <div className="rounded-2xl border border-line-soft bg-cream p-8 shadow-[0_30px_60px_-30px_rgba(63,14,34,0.25)] md:p-12">
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow text-terracotta">
            Stone {stone.number} · {stone.label}
          </p>
          <h3 className="font-display mt-4 text-3xl leading-tight text-burgundy md:text-[40px]">
            {stone.title}
            {stone.subtitle ? (
              <span className="mt-1 block font-display text-2xl leading-tight text-burgundy/70 md:text-[28px]">
                {stone.subtitle}
              </span>
            ) : null}
          </h3>
          {stone.bodyBlocks ? (
            <div className="mt-5 space-y-3 text-base leading-relaxed text-ink/85 md:text-lg">
              {stone.bodyBlocks.map((block, i) => {
                if ("paragraph" in block) {
                  return <p key={i}>{block.paragraph}</p>;
                }
                return (
                  <ul key={i} className="space-y-2 pt-1">
                    {block.bullets.map((b, j) => (
                      <li key={j} className="relative pl-7">
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-[0.65em] block h-1.5 w-1.5 rotate-45 bg-gold"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          ) : stone.body ? (
            <p className="mt-5 text-base leading-relaxed text-ink/85 md:text-lg">
              {stone.body}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {hasExpand ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
              >
                {expanded ? "Show less" : stone.cta.label}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: reverentEase }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </button>
            ) : (
              <Link
                href={stone.cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
              >
                {stone.cta.label} <span aria-hidden="true">→</span>
              </Link>
            )}

            {stone.genesis ? (
              <button
                type="button"
                onClick={() => setGenesisOpen((v) => !v)}
                aria-expanded={genesisOpen}
                aria-controls={genesisId}
                className="inline-flex items-center gap-2 rounded-full border border-burgundy/40 px-6 py-3 text-sm font-medium text-burgundy transition hover:border-burgundy hover:bg-burgundy/5"
              >
                {stone.genesis.label}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: genesisOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: reverentEase }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </button>
            ) : null}
          </div>
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

      {/* Expandable detail — full-width below the grid; bullets stagger in. */}
      <AnimatePresence initial={false}>
        {expanded && stone.expand ? (
          <motion.div
            key={panelId}
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: reverentEase }}
            className="overflow-hidden"
          >
            <div className="mt-10 border-t border-line-soft pt-8">
              <div className="space-y-7">
                {/* Section chips — visitor steps through the dropdown */}
                <div className="flex flex-wrap items-center gap-2">
                  {stone.expand.sections.map((s, i) => {
                    const isActive = i === safeIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSectionIndex(i)}
                        aria-pressed={isActive}
                        className={[
                          "rounded-full border px-4 py-1.5 text-[12px] font-medium tracking-wide transition",
                          isActive
                            ? "border-burgundy bg-burgundy text-cream shadow-[0_6px_18px_-8px_rgba(84,19,46,0.55)]"
                            : "border-burgundy/25 text-burgundy/70 hover:border-burgundy/55 hover:text-burgundy",
                        ].join(" ")}
                      >
                        {s.label ?? s.heading}
                      </button>
                    );
                  })}
                </div>

                {/* Active section — heading + blocks, crossfades on switch */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {activeSection ? (
                      <motion.div
                        key={safeIndex}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.5, ease: reverentEase }}
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-serif text-sm italic text-gold/85">
                            {ROMAN[safeIndex]}
                          </span>
                          <span
                            aria-hidden="true"
                            className="block h-px w-10 bg-gold"
                          />
                          <h4 className="font-display text-xl leading-tight text-burgundy md:text-[26px]">
                            {activeSection.heading}
                          </h4>
                        </div>

                        <div className="mt-5 space-y-4">
                          {activeSection.blocks.map((block, bi) => {
                            if ("paragraph" in block) {
                              return (
                                <p
                                  key={bi}
                                  className="font-serif text-base leading-[1.75] text-ink/85 md:text-lg"
                                >
                                  {block.paragraph}
                                </p>
                              );
                            }
                            return (
                              <ul key={bi} className="space-y-3 pt-1">
                                {block.bullets.map((item, ii) => (
                                  <li
                                    key={ii}
                                    className="font-serif relative pl-7 text-base leading-[1.7] text-ink/85 md:text-lg"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="absolute left-0 top-[0.65em] block h-1.5 w-1.5 rotate-45 bg-gold"
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Progress + next */}
                <div className="flex items-center justify-between border-t border-burgundy/10 pt-4">
                  <span className="flex items-center gap-2">
                    {stone.expand.sections.map((_, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className={[
                          "block h-1.5 w-1.5 rotate-45 transition-colors duration-300",
                          i === safeIndex ? "bg-burgundy" : "bg-burgundy/20",
                        ].join(" ")}
                      />
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSectionIndex((c) => (c + 1) % sectionCount)
                    }
                    className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy/85 transition hover:text-terracotta"
                  >
                    {safeIndex === sectionCount - 1 ? "Begin again" : "Next"}
                    <span
                      aria-hidden="true"
                      className="transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Genesis Hospitality reveal — full-width below the grid */}
      <AnimatePresence initial={false}>
        {genesisOpen && stone.genesis ? (
          <motion.div
            key={genesisId}
            id={genesisId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: reverentEase }}
            className="overflow-hidden"
          >
            <div className="mt-10 border-t border-line-soft pt-8">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-10 bg-gold" />
                <p className="eyebrow text-terracotta">
                  {stone.genesis.reference}
                </p>
              </div>
              <p className="font-serif mt-5 max-w-3xl text-xl italic leading-[1.6] text-burgundy/90 md:text-2xl">
                {stone.genesis.scripture}
              </p>
              <p className="font-serif mt-6 max-w-2xl text-base leading-[1.75] text-ink/80 md:text-lg">
                {stone.genesis.note}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
        className="relative w-full overflow-hidden rounded-xl bg-[#16090f] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-[aspect-ratio] duration-700 ease-out"
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
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#16090f] ring-1 ring-inset ring-white/10">
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
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#16090f] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/10">
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
    </div>
  );
}
