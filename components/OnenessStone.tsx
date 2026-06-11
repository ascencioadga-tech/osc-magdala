"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

// ─── 30 denominations inscribed on the Oneness Stone ─────────────────
// Carved as three concentric rings that rotate slowly with the stone,
// millstone-fashion, around a fixed center hub. Each ring holds exactly
// 10 names at an even 36° step, so names can never overlap. Names are
// sorted longest → shortest by ring (outer ring has the widest arc), and
// Roman Catholic is index 0 of the outer ring, pinned to the bottom.
const ringOuter = [
  "Roman Catholic", // index 0 → bottom (offset 180°)
  "Armenian Apostolic",
  "Ethiopian Orthodox",
  "Assemblies of God",
  "Eastern Catholic",
  "Russian Orthodox",
  "Southern Baptist",
  "Coptic Orthodox",
  "Syriac Orthodox",
  "Greek Orthodox",
];
const ringMiddle = [
  "Congregational",
  "Presbyterian",
  "Evangelical",
  "Pentecostal",
  "Foursquare",
  "Episcopal",
  "Methodist",
  "Mennonite",
  "Anglican",
  "Lutheran",
];
const ringInner = [
  "Wesleyan",
  "Reformed",
  "Maronite",
  "Chaldean",
  "Nazarene",
  "Vineyard",
  "Moravian",
  "Baptist",
  "Melkite",
  "Quaker",
];

export function OnenessStone() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      {/* Stepping Stones above already carries a generous bottom padding, so
          this section keeps its top shallow and breathes at the bottom before
          the burgundy Crossroads. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-6 md:px-10 md:pb-28 md:pt-10">
        <div className="grid items-center gap-12 md:grid-cols-[0.95fr_1fr] md:gap-16 lg:gap-20">
          {/* LEFT — the rotating stone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: -24 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: reverentEase }}
          >
            <CircleStone />
          </motion.div>

          {/* RIGHT — copy */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: reverentEase }}
              className="eyebrow text-terracotta"
            >
              A Covenant in Stone
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
              className="font-display mt-4 text-4xl leading-[1.04] text-burgundy md:text-[56px]"
            >
              The Oneness Stone
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.22, ease: reverentEase }}
              className="font-serif mt-6 space-y-5 text-lg leading-[1.7] text-ink/85 md:text-xl"
            >
              <p>
                At the entrance of the future restaurant at Magdala, one stone
                will carry the names of the Christian traditions taking part in
                this work — gathered not on separate monuments, but on a single
                shared stone.
              </p>
              <p>
                It is a marker of friendship and shared purpose — a sign that
                Catholics, Protestants, and Eastern Christians can work side by
                side in concrete ways, each remaining faithful to their own
                tradition.
              </p>
            </motion.div>

            {/* Scripture */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.46, ease: reverentEase }}
              className="mt-9 flex items-center justify-center gap-4 md:justify-start"
            >
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-gold/70"
              />
              <span className="font-serif text-base italic text-burgundy/85 md:text-lg">
                “That they may all be one.” — John 17:21
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// The round Oneness Stone — a pale-limestone millstone that rotates
// slowly. The rock (mottling, veins, and three rings of inscribed
// names) turns as one body via the .oneness-rotor CSS animation, while
// the lighting (dome shading, sunlit rim, grain) and the center hub
// (title + scripture) stay fixed, like a millstone around its axle.
// All coordinates are static, so server and client render identically.
// ────────────────────────────────────────────────────────────────────

// One ring of names inscribed tangentially around the center. Each name
// is engraved with a cheap two-copy technique (light catch offset below,
// dark glyph on top) so the rotating group needs no SVG filters — filters
// re-rasterize every animation frame and would be expensive.
function NameRing({
  names,
  radius,
  fontSize,
  offsetDeg,
  cx,
  cy,
}: {
  names: string[];
  radius: number;
  fontSize: number;
  offsetDeg: number;
  cx: number;
  cy: number;
}) {
  const step = 360 / names.length;
  return (
    <g>
      {names.map((name, i) => {
        const angle = offsetDeg + i * step;
        const label = name.toUpperCase();
        return (
          <g key={name} transform={`rotate(${angle} ${cx} ${cy})`}>
            {/* light catch of the carved groove */}
            <text
              x={cx}
              y={cy - radius}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize={fontSize}
              fontWeight="600"
              fill="#fff6da"
              opacity="0.55"
              transform="translate(0.8 1)"
              style={{ letterSpacing: "1.1px" }}
            >
              {label}
            </text>
            {/* the incision itself */}
            <text
              x={cx}
              y={cy - radius}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize={fontSize}
              fontWeight="600"
              fill="#3a2a14"
              opacity="0.92"
              style={{ letterSpacing: "1.1px" }}
            >
              {label}
            </text>
            {/* diamond separator at the half-step, optically centered on the
                cap height of the neighboring names */}
            <g transform={`rotate(${step / 2} ${cx} ${cy})`}>
              <path
                d={`M ${cx} ${cy - radius - 7} l 2.4 3.5 l -2.4 3.5 l -2.4 -3.5 Z`}
                transform="translate(0 3.5)"
                fill="#8a6a30"
                opacity="0.5"
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}

function CircleStone() {
  const cx = 300;
  const cy = 310;
  const r = 266;

  // Soft, deterministic limestone mottling (no randomness → no hydration drift)
  const mottle = [
    { x: -78, y: -104, rx: 86, ry: 56, c: "#cdbf9f", o: 0.18 },
    { x: 108, y: 82, rx: 96, ry: 64, c: "#c3b390", o: 0.16 },
    { x: -128, y: 132, rx: 60, ry: 42, c: "#bdac86", o: 0.16 },
    { x: 84, y: -168, rx: 52, ry: 36, c: "#d4c8ab", o: 0.14 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <svg
        viewBox="0 0 600 620"
        role="img"
        aria-label="The Oneness Stone — a round commemorative limestone inscribed with the names of 30 Christian denominations, turning slowly like a millstone"
        className="relative block w-full"
        style={{
          filter:
            "drop-shadow(0 4px 10px rgba(63,16,25,0.18)) drop-shadow(0 24px 42px rgba(63,16,25,0.25))",
        }}
      >
        <defs>
          {/* Warm gold glow behind the stone */}
          <radialGradient id="osGlow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#e6c06a" stopOpacity="0.30" />
            <stop offset="0.55" stopColor="#c8923a" stopOpacity="0.08" />
            <stop offset="1" stopColor="#c8923a" stopOpacity="0" />
          </radialGradient>

          {/* Pale Jerusalem-limestone face — cream, lit from upper-left */}
          <radialGradient id="osFace" cx="0.36" cy="0.28" r="0.95">
            <stop offset="0" stopColor="#f3ecdb" />
            <stop offset="0.30" stopColor="#e8dcc4" />
            <stop offset="0.60" stopColor="#d6c8a8" />
            <stop offset="0.82" stopColor="#bba985" />
            <stop offset="1" stopColor="#988970" />
          </radialGradient>

          {/* Dome shading — soft top-left light, warm lower-right shadow */}
          <radialGradient id="osDome" cx="0.32" cy="0.26" r="1.0">
            <stop offset="0" stopColor="#fffaf0" stopOpacity="0.34" />
            <stop offset="0.4" stopColor="#fffaf0" stopOpacity="0" />
            <stop offset="0.72" stopColor="#2a1810" stopOpacity="0" />
            <stop offset="1" stopColor="#2a1810" stopOpacity="0.32" />
          </radialGradient>

          {/* Top sunlit rim + bottom shade */}
          <linearGradient id="osTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf3d6" stopOpacity="0.75" />
            <stop offset="1" stopColor="#fdf3d6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1810" stopOpacity="0" />
            <stop offset="1" stopColor="#2a1810" stopOpacity="0.4" />
          </linearGradient>

          {/* Gilded ring — beveled gold band */}
          <linearGradient id="osGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0d488" />
            <stop offset="0.5" stopColor="#c8923a" />
            <stop offset="1" stopColor="#8a6326" />
          </linearGradient>

          {/* Fine, refined limestone grain (low opacity) */}
          <filter id="osGrain" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
            />
            <feColorMatrix
              values="0 0 0 0 0.34
                      0 0 0 0 0.28
                      0 0 0 0 0.18
                      0 0 0 0.5 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Refined engraving for the static center hub — incised
              letterpress with a light catch below-right. (Safe to use a
              filter here because the hub does not animate.) */}
          <filter id="osEngrave" x="-25%" y="-25%" width="150%" height="150%">
            <feOffset in="SourceAlpha" dx="0.7" dy="0.9" result="dn" />
            <feFlood floodColor="#fff4d4" floodOpacity="0.55" />
            <feComposite in2="dn" operator="in" result="lite" />
            <feOffset in="SourceAlpha" dx="-0.7" dy="-0.9" result="up" />
            <feFlood floodColor="#1a1408" floodOpacity="0.55" />
            <feComposite in2="up" operator="in" result="dark" />
            <feGaussianBlur in="dark" stdDeviation="0.3" result="darkSoft" />
            <feMerge>
              <feMergeNode in="lite" />
              <feMergeNode in="darkSoft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="osClip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* Soft glow + cast shadow */}
        <ellipse cx={cx} cy={cy + 16} rx={r + 64} ry={r + 42} fill="url(#osGlow)" />
        <ellipse
          cx={cx}
          cy={cy + r + 16}
          rx={r * 0.82}
          ry={13}
          fill="#3f1019"
          opacity="0.3"
        />

        {/* Stone base */}
        <circle cx={cx} cy={cy} r={r} fill="url(#osFace)" />

        {/* Interior, clipped to the disc */}
        <g clipPath="url(#osClip)">
          {/* ── THE ROTOR — everything that belongs to the rock itself
              turns as one rigid body: mottling, veins, and the three
              inscribed rings of names. ── */}
          <g className="oneness-rotor">
            {mottle.map((m, i) => (
              <ellipse
                key={`mottle-${i}`}
                cx={cx + m.x}
                cy={cy + m.y}
                rx={m.rx}
                ry={m.ry}
                fill={m.c}
                opacity={m.o}
              />
            ))}

            {/* Faint hairline veins for character */}
            <path
              d={`M ${cx - 190} ${cy - 70} Q ${cx - 90} ${cy - 104} ${cx - 10} ${cy - 62} T ${cx + 160} ${cy - 30}`}
              fill="none"
              stroke="#9c8a64"
              strokeWidth="0.7"
              opacity="0.2"
            />
            <path
              d={`M ${cx - 150} ${cy + 110} Q ${cx - 50} ${cy + 138} ${cx + 40} ${cy + 100} T ${cx + 185} ${cy + 74}`}
              fill="none"
              stroke="#9c8a64"
              strokeWidth="0.6"
              opacity="0.16"
            />

            {/* Three rings of inscribed names. The inner ring's offset
                places Roman Catholic — last in the sequence — at the
                bottom of the stone at rest. */}
            <NameRing names={ringOuter} radius={218} fontSize={10.5} offsetDeg={180} cx={cx} cy={cy} />
            <NameRing names={ringMiddle} radius={182} fontSize={10.5} offsetDeg={18} cx={cx} cy={cy} />
            <NameRing names={ringInner} radius={146} fontSize={11} offsetDeg={0} cx={cx} cy={cy} />
          </g>

          {/* ── STATIC LIGHT — grain, shade, and sunlit rim do not turn
              with the rock; light stays where the sun is. ── */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="#000"
            filter="url(#osGrain)"
            opacity="0.28"
          />
          <ellipse cx={cx} cy={cy + r - 28} rx={r - 4} ry={48} fill="url(#osBot)" />
          <path
            d={`M ${cx - r + 10} ${cy - 48} A ${r - 8} ${r - 8} 0 0 1 ${cx + r - 10} ${cy - 48}`}
            fill="none"
            stroke="url(#osTop)"
            strokeWidth="30"
            opacity="0.6"
          />
          <circle cx={cx} cy={cy} r={r} fill="url(#osDome)" />
        </g>

        {/* ─── Hand-cut outer edge ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#2a2114"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* ─── Gilded ring (channel + gold fill + highlight) ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 16}
          fill="none"
          stroke="#2a2114"
          strokeWidth="3.4"
          opacity="0.5"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r - 16}
          fill="none"
          stroke="url(#osGold)"
          strokeWidth="2"
        />
        <circle
          cx={cx}
          cy={cy - 0.6}
          r={r - 16}
          fill="none"
          stroke="#f4dd9a"
          strokeWidth="0.7"
          opacity="0.7"
        />

        {/* ─── The fixed center hub — the axle the millstone turns on ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={114}
          fill="none"
          stroke="#5a4a2a"
          strokeWidth="0.7"
          opacity="0.45"
        />
        <circle
          cx={cx}
          cy={cy}
          r={110}
          fill="none"
          stroke="#fbeec0"
          strokeWidth="0.5"
          opacity="0.4"
        />

        <g filter="url(#osEngrave)">
          <text
            x={cx}
            y={cy - 16}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
            fontSize="14"
            fontWeight="700"
            fill="#2a2418"
            style={{ letterSpacing: "4px" }}
          >
            THE ONENESS STONE
          </text>

          {/* Divider with a gold diamond */}
          <line
            x1={cx - 64}
            y1={cy + 4}
            x2={cx - 10}
            y2={cy + 4}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1={cx + 10}
            y1={cy + 4}
            x2={cx + 64}
            y2={cy + 4}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d={`M ${cx} ${cy - 0.5} L ${cx + 4.5} ${cy + 4} L ${cx} ${cy + 8.5} L ${cx - 4.5} ${cy + 4} Z`}
            fill="#b8893a"
          />

          {/* Scripture reference */}
          <text
            x={cx}
            y={cy + 32}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="12.5"
            fontWeight="700"
            fill="#2a2418"
            style={{ letterSpacing: "4px" }}
          >
            JOHN · 17 · 21
          </text>
        </g>
      </svg>
    </div>
  );
}
