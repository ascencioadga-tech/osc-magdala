"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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
            initial={{ opacity: 0, y: 46, scale: 0.965 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.7, delay: 0.2, ease: reverentEase }}
          >
            <div className="stone-breathe">
              <CircleStone />
            </div>
            <p className="font-serif mx-auto mt-4 max-w-md text-center text-[13px] italic leading-relaxed text-ink/50">
              The Oneness Stone is a placeholder — its exact form will be
              closely tied to the art project, which is still in early
              conceptual development.
            </p>
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

            {/* CTA — the stone's story continues on the benefactors page */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.58, ease: reverentEase }}
              className="mt-8 flex justify-center md:justify-start"
            >
              <Link
                href="/benefactors"
                className="group inline-flex items-center gap-2.5 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
              >
                Become a benefactor
                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// The Oneness Stone — a rotating cylindrical base.
// A stone drum seen slightly from above: the dedication rests on the
// flat top; the names of the churches are inscribed around the drum's
// thickness and travel with it as it slowly turns. Flat, editorial
// finish — hairlines and type, no simulated 3D theater beyond the
// geometry itself.
//
// The band is driven by a small rAF loop (transform-only updates on
// ~60 nodes). Initial positions are computed at t = 0 with rounded
// coordinates, so server and client render identically before the
// animation takes over. prefers-reduced-motion leaves it still.
// ────────────────────────────────────────────────────────────────────

const BONE = "#f7f1e3"; // carved lettering — near-white bone for legibility
const RECESS = "#17120d"; // the dark of the incision

// Drum geometry (viewBox 600 × 470)
const CX = 300;
const CYT = 176; // top-face ellipse center
const RX = 252; // drum radius
const RY = 74; // perspective squash
const BAND_H = 118; // visible thickness

const DEG = Math.PI / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Three staggered rows around the thickness — ten names each, with small
// diamond separators between them. Sequence ends with Roman Catholic.
type BandItem = {
  kind: "name" | "diamond";
  label?: string;
  angle: number;
  dy: number;
};

const BAND_ROWS = [
  { names: ringOuter, phase: 0, dy: 34 },
  { names: ringMiddle, phase: 12, dy: 64 },
  { names: ringInner, phase: 24, dy: 94 },
];

const BAND_ITEMS: BandItem[] = BAND_ROWS.flatMap((row) => {
  const step = 360 / row.names.length;
  return row.names.flatMap((name, i): BandItem[] => [
    { kind: "name", label: name.toUpperCase(), angle: row.phase + i * step, dy: row.dy },
    { kind: "diamond", angle: row.phase + i * step + step / 2, dy: row.dy },
  ]);
});

// Where does an item at drum-angle θ sit on screen? Front face only.
function bandPlacement(angleDeg: number, dy: number, turn: number) {
  const theta = ((angleDeg - turn + 540) % 360) - 180;
  const c = Math.cos(theta * DEG);
  if (c <= 0.18) return null; // gone around the turn
  const x = r2(CX + RX * Math.sin(theta * DEG));
  // Key light — a soft vertical band left of center; names brighten as
  // they pass through it, like stone catching a museum spot.
  const lx = (x - (CX - 84)) / 150;
  const light = Math.exp(-lx * lx) * 0.22;
  // Fade steeply near the turn so lettering melts into shadow, never clips.
  const edge = Math.min(1, (c - 0.18) / 0.26);
  // Engraved-on-the-surface physics: the baseline follows the tangent of
  // the drum's elliptical rim — level at front-center, tilting as it
  // wraps toward the edges — plus a whisper of depth scale (the sides of
  // the drum are farther from the eye than the front).
  const s = Math.sin(theta * DEG);
  const tilt = r2((Math.atan2(-RY * s, RX * c) * 180) / Math.PI);
  return {
    x,
    y: r2(CYT + RY * c + dy),
    sx: r2(Math.max(c, 0.1)), // foreshortening along the wrap
    sy: r2(0.93 + 0.07 * c), // depth
    tilt,
    o: r2(Math.min(0.45 + 0.5 * c + light, 1) * (0.12 + 0.88 * edge)),
  };
}

function CircleStone() {
  const itemRefs = useRef<(SVGGElement | null)[]>([]);

  // Slow, stately turn — one revolution every 200 s. Updates are written
  // as CSS transforms (compositor-friendly) into a dedicated overlay SVG,
  // so the displacement-filtered rock below is never re-rasterized.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const SPEED = 1.8; // degrees per second — slow enough to read
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const turn = (((now - t0) / 1000) * SPEED) % 360;
      BAND_ITEMS.forEach((item, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const pos = bandPlacement(item.angle, item.dy, turn);
        if (!pos) {
          el.style.display = "none";
        } else {
          el.style.display = "";
          el.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.tilt}deg) scale(${pos.sx}, ${pos.sy})`;
          el.style.opacity = String(pos.o);
        }
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* ── Layer 1 · the rock — static, displacement-filtered once ── */}
      <svg
        viewBox="0 0 600 470"
        role="img"
        aria-label="The Oneness Stone — a round stone base engraved around its side with the names of 30 Christian denominations, turning slowly"
        className="relative block w-full"
      >
        <defs>
          <radialGradient id="osTop" cx="0.38" cy="0.3" r="0.95">
            <stop offset="0" stopColor="#9d8e79" />
            <stop offset="0.4" stopColor="#80725f" />
            <stop offset="0.75" stopColor="#5f5344" />
            <stop offset="1" stopColor="#453b31" />
          </radialGradient>
          <linearGradient id="osWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6e6252" />
            <stop offset="0.6" stopColor="#4a4034" />
            <stop offset="1" stopColor="#211b15" />
          </linearGradient>
          <linearGradient id="osKey" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.12" stopColor="#fff6dd" stopOpacity="0" />
            <stop offset="0.34" stopColor="#fff6dd" stopOpacity="0.2" />
            <stop offset="0.58" stopColor="#fff6dd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.1" stopColor="#fffaf0" stopOpacity="0.16" />
            <stop offset="0.45" stopColor="#fffaf0" stopOpacity="0.03" />
            <stop offset="0.78" stopColor="#0e0a06" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="osTurnL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#14100b" stopOpacity="0.55" />
            <stop offset="1" stopColor="#14100b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osTurnR" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#14100b" stopOpacity="0.55" />
            <stop offset="1" stopColor="#14100b" stopOpacity="0" />
          </linearGradient>
          <filter id="osRough" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              seed="33"
              result="n"
            />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
          </filter>
          <filter id="osGrainD" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed="9"
            />
            <feColorMatrix
              values="0 0 0 0 0.07
                      0 0 0 0 0.06
                      0 0 0 0 0.04
                      0 0 0 0.5 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="osBlotchD" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.06"
              numOctaves="2"
              seed="27"
            />
            <feColorMatrix
              values="0 0 0 0 0.58
                      0 0 0 0 0.53
                      0 0 0 0 0.44
                      0 0 0 0.35 -0.07"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="osPitsD" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.09"
              numOctaves="2"
              seed="17"
            />
            <feColorMatrix
              values="0 0 0 0 0.05
                      0 0 0 0 0.04
                      0 0 0 0 0.03
                      0 0 0 0.42 -0.05"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="osShadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#241d14" stopOpacity="0.34" />
            <stop offset="0.65" stopColor="#241d14" stopOpacity="0.14" />
            <stop offset="1" stopColor="#241d14" stopOpacity="0" />
          </radialGradient>
          <clipPath id="osWallClip">
            <path
              d={`M ${CX - RX} ${CYT} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT} L ${CX + RX} ${CYT + BAND_H} A ${RX} ${RY} 0 0 1 ${CX - RX} ${CYT + BAND_H} Z`}
            />
          </clipPath>
          <clipPath id="osTopClip">
            <ellipse cx={CX} cy={CYT} rx={RX} ry={RY} />
          </clipPath>
          <clipPath id="osDrumClip">
            <ellipse cx={CX} cy={CYT} rx={RX} ry={RY} />
            <path
              d={`M ${CX - RX} ${CYT} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT} L ${CX + RX} ${CYT + BAND_H} A ${RX} ${RY} 0 0 1 ${CX - RX} ${CYT + BAND_H} Z`}
            />
          </clipPath>
        </defs>

        {/* Ground shadow — cast long to the right of the key light */}
        <ellipse
          cx={CX + 44}
          cy={CYT + BAND_H + RY + 14}
          rx={RX * 1.12}
          ry={20}
          fill="url(#osShadow)"
        />
        <ellipse
          cx={CX + 10}
          cy={CYT + BAND_H + RY + 7}
          rx={RX * 0.82}
          ry={9}
          fill="#1c160f"
          opacity="0.36"
        />

        <g filter="url(#osRough)">
          {/* Base molding — a slightly wider foot the drum stands on */}
          <ellipse
            cx={CX}
            cy={CYT + BAND_H + 7}
            rx={RX + 8}
            ry={RY + 3}
            fill="#373026"
          />
          <path
            d={`M ${CX - RX - 8} ${CYT + BAND_H + 7} A ${RX + 8} ${RY + 3} 0 0 0 ${CX + RX + 8} ${CYT + BAND_H + 7}`}
            fill="none"
            stroke="#f7f1e3"
            strokeWidth="0.8"
            opacity="0.14"
          />
          <path
            d={`M ${CX - RX} ${CYT} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT} L ${CX + RX} ${CYT + BAND_H} A ${RX} ${RY} 0 0 1 ${CX - RX} ${CYT + BAND_H} Z`}
            fill="url(#osWall)"
          />
          <g clipPath="url(#osWallClip)">
            <rect x="0" y="0" width="600" height="470" fill="#000" filter="url(#osGrainD)" opacity="0.55" />
            <rect x="0" y="0" width="600" height="470" fill="#000" filter="url(#osBlotchD)" opacity="0.5" />
            {/* Incised guide rules — the carver's ledger lines between the
                rows of names, each a dark groove with a lit lower lip */}
            {[16, 46, 76, 106].map((d) => (
              <g key={d}>
                <path
                  d={`M ${CX - RX} ${CYT + d} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT + d}`}
                  fill="none"
                  stroke="#211b14"
                  strokeWidth="0.9"
                  opacity="0.45"
                />
                <path
                  d={`M ${CX - RX} ${CYT + d + 1.2} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT + d + 1.2}`}
                  fill="none"
                  stroke="#f7f1e3"
                  strokeWidth="0.5"
                  opacity="0.14"
                />
              </g>
            ))}
            <rect x={CX - RX} y={CYT - 4} width={RX * 2} height={BAND_H + RY + 8} fill="url(#osKey)" />
            <rect x={CX - RX} y={CYT - 4} width={190} height={BAND_H + RY + 8} fill="url(#osTurnL)" />
            <rect x={CX + RX - 190} y={CYT - 4} width={190} height={BAND_H + RY + 8} fill="url(#osTurnR)" />
          </g>
          <path
            d={`M ${CX - RX} ${CYT + BAND_H} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT + BAND_H}`}
            fill="none"
            stroke="#14100b"
            strokeWidth="1.4"
            opacity="0.55"
          />

          <ellipse cx={CX} cy={CYT} rx={RX} ry={RY} fill="url(#osTop)" />
          <ellipse cx={CX} cy={CYT} rx={RX} ry={RY} fill="url(#osSheen)" />
          <g clipPath="url(#osTopClip)">
            <rect x="0" y="0" width="600" height="470" fill="#000" filter="url(#osGrainD)" opacity="0.55" />
            <rect x="0" y="0" width="600" height="470" fill="#000" filter="url(#osBlotchD)" opacity="0.42" />
            <rect x="0" y="0" width="600" height="470" fill="#000" filter="url(#osPitsD)" opacity="0.3" />
            <ellipse cx={CX - 92} cy={CYT - 16} rx={70} ry={22} fill="#8d816c" opacity="0.2" />
            <ellipse cx={CX + 88} cy={CYT + 14} rx={64} ry={20} fill="#6e6250" opacity="0.22" />
            <ellipse cx={CX - 10} cy={CYT + 34} rx={80} ry={18} fill="#4e463c" opacity="0.22" />
            <ellipse cx={CX - 168} cy={CYT + 22} rx={44} ry={14} fill="#5a5044" opacity="0.26" />
            <ellipse cx={CX + 172} cy={CYT - 26} rx={40} ry={12} fill="#665a4b" opacity="0.24" />
            {/* peripheral fissures — away from the dedication */}
            <path
              d={`M ${CX - 226} ${CYT + 8} q 26 14 58 10 q 22 -3 34 8`}
              fill="none"
              stroke="#17120d"
              strokeWidth="0.7"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />
            <path
              d={`M ${CX + 150} ${CYT + 34} q 28 6 52 -4`}
              fill="none"
              stroke="#17120d"
              strokeWidth="0.6"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />
            <path
              d={`M ${CX + 60} ${CYT - 52} q 30 8 62 2`}
              fill="none"
              stroke="#17120d"
              strokeWidth="0.55"
              strokeOpacity="0.32"
              strokeLinecap="round"
            />
            {/* rim chips — worn bites along the top edge */}
            <ellipse cx={CX - 234} cy={CYT - 18} rx={9} ry={4} fill="#2e2720" opacity="0.3" transform={`rotate(-24 ${CX - 234} ${CYT - 18})`} />
            <ellipse cx={CX + 226} cy={CYT + 26} rx={11} ry={4.5} fill="#2e2720" opacity="0.28" transform={`rotate(18 ${CX + 226} ${CYT + 26})`} />
            <ellipse cx={CX - 96} cy={CYT - 66} rx={10} ry={3.5} fill="#2e2720" opacity="0.26" transform={`rotate(-8 ${CX - 96} ${CYT - 66})`} />
            {[
              [96, -34, 1.0, "#211c16"],
              [178, -6, 0.7, "#a89a86"],
              [420, -28, 1.1, "#211c16"],
              [498, 6, 0.7, "#8d816c"],
              [236, 30, 0.9, "#1a1610"],
              [352, 38, 0.7, "#a89a86"],
              [140, 26, 0.8, "#211c16"],
              [462, 34, 0.8, "#1a1610"],
            ].map(([dx, dy, r, c], i) => (
              <circle
                key={i}
                cx={CX - 300 + Number(dx) + 100}
                cy={CYT + Number(dy)}
                r={Number(r)}
                fill={String(c)}
                opacity={0.4 + (i % 3) * 0.12}
              />
            ))}
          </g>
          <ellipse
            cx={CX}
            cy={CYT - 1}
            rx={RX - 2}
            ry={RY - 1}
            fill="none"
            stroke="#cbbfa8"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>
      </svg>

      {/* ── Layer 2 · the moving band + dedication — no filters here, so
          per-frame CSS transforms composite cleanly ── */}
      <svg
        viewBox="0 0 600 470"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      >
        <g clipPath="url(#osWallClip)">
          {BAND_ITEMS.map((item, i) => {
            const pos = bandPlacement(item.angle, item.dy, 0);
            return (
              <g
                key={`${item.kind}-${i}`}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                style={{
                  display: pos ? undefined : "none",
                  transform: pos
                    ? `translate(${pos.x}px, ${pos.y}px) rotate(${pos.tilt}deg) scale(${pos.sx}, ${pos.sy})`
                    : undefined,
                  opacity: pos ? pos.o : undefined,
                }}
              >
                {item.kind === "name" ? (
                  <>
                    <text
                      x={0.9}
                      y={1.1}
                      textAnchor="middle"
                      fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
                      fontSize="13.5"
                      fontWeight="600"
                      fill={RECESS}
                      opacity="1"
                      style={{ letterSpacing: "0.8px" }}
                    >
                      {item.label}
                    </text>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
                      fontSize="13.5"
                      fontWeight="600"
                      fill={BONE}
                      style={{ letterSpacing: "0.8px" }}
                    >
                      {item.label}
                    </text>
                  </>
                ) : (
                  <rect
                    x="-1.9"
                    y="-5.9"
                    width="3.8"
                    height="3.8"
                    rx="0.5"
                    fill={(i >> 1) % 2 ? "#b19277" : "#d9cfbc"}
                    opacity="0.32"
                    transform="rotate(12)"
                  />
                )}
              </g>
            );
          })}
        </g>

        <text
          x={CX + 0.9}
          y={CYT - 14.9}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
          fontSize="17"
          fontWeight="700"
          fill={RECESS}
          opacity="0.75"
          style={{ letterSpacing: "4.5px" }}
        >
          THE ONENESS STONE
        </text>
        <text
          x={CX}
          y={CYT - 16}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
          fontSize="17"
          fontWeight="700"
          fill="#f9f4e8"
          style={{ letterSpacing: "4.5px" }}
        >
          THE ONENESS STONE
        </text>
        <text
          x={CX + 0.7}
          y={CYT + 26.9}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="13.5"
          fontWeight="700"
          fill={RECESS}
          opacity="0.75"
          style={{ letterSpacing: "4px" }}
        >
          JOHN · 17 · 21
        </text>
        <text
          x={CX}
          y={CYT + 26}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="13.5"
          fontWeight="700"
          fill="#f9f4e8"
          style={{ letterSpacing: "4px" }}
        >
          JOHN · 17 · 21
        </text>
        <text
          x={CX}
          y={CYT + 48}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="12"
          fontStyle="italic"
          fontWeight="600"
          fill={BONE}
          opacity="0.95"
          style={{ letterSpacing: "0.5px" }}
        >
          “that they may all be one”
        </text>

        {/* ── Liquid glass — a slow sheen gliding across the drum, with
            crisp screen-glass hairlines on the edges ── */}
        <defs>
          <linearGradient id="osLiquid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath="url(#osDrumClip)">
          <g className="oneness-sheen">
            <rect
              x={CX - 90}
              y={CYT - RY - 10}
              width="180"
              height={RY + BAND_H + RY + 20}
              fill="url(#osLiquid)"
              transform={`skewX(-14)`}
            />
          </g>
        </g>
        <ellipse
          cx={CX}
          cy={CYT}
          rx={RX}
          ry={RY}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.16"
        />
        <path
          d={`M ${CX - RX} ${CYT + BAND_H} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CYT + BAND_H}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          opacity="0.1"
        />
      </svg>
    </div>
  );
}
