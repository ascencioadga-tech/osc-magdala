"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

// ─── 30 denominations carved into the Oneness Stone ─────────────────
// Left column: traditions of antiquity (Catholic + Orthodox + Anglican
// + Lutheran/Methodist bridges). Right column: Reformed, Baptist,
// Evangelical, Pentecostal, and free-church traditions.
const leftCol = [
  "Roman Catholic",
  "Eastern Catholic",
  "Maronite",
  "Melkite",
  "Chaldean",
  "Greek Orthodox",
  "Russian Orthodox",
  "Coptic Orthodox",
  "Armenian Apostolic",
  "Syriac Orthodox",
  "Ethiopian Orthodox",
  "Anglican",
  "Episcopal",
  "Lutheran",
  "Methodist",
];
const rightCol = [
  "Wesleyan",
  "Presbyterian",
  "Reformed",
  "Congregational",
  "Baptist",
  "Southern Baptist",
  "Evangelical",
  "Pentecostal",
  "Assemblies of God",
  "Nazarene",
  "Foursquare",
  "Vineyard",
  "Mennonite",
  "Quaker",
  "Moravian",
];

// Galilee-blue scrim (Magdala palette) over the ambient video — darker at
// the edges, clearer through the middle so the footage stays alive.
const GALILEE_SCRIM =
  "linear-gradient(180deg, rgba(14,38,52,0.86) 0%, rgba(14,38,52,0.46) 34%, rgba(14,38,52,0.46) 60%, rgba(11,30,42,0.90) 100%)";
const GALILEE_VIGNETTE =
  "radial-gradient(ellipse 72% 82% at 50% 46%, rgba(14,38,52,0) 0%, rgba(14,38,52,0.30) 68%, rgba(9,24,34,0.62) 100%)";

export function OnenessStone() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });
  const inViewLoose = useInView(sectionRef, {
    amount: 0.05,
    margin: "0px 0px -10% 0px",
  });

  // Background video is ambient — plays (muted) while the section is on
  // screen and pauses when the visitor scrolls away.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inViewLoose) {
      v.muted = true;
      v.play().catch(() => {
        /* ignore autoplay rejections */
      });
    } else {
      v.pause();
    }
  }, [inViewLoose]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0e2634]"
    >
      {/* ─── Background video — full-bleed, cool Galilee scrim ─── */}
      <div aria-hidden="true" className="absolute inset-0">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          poster="/banner-recognition-poster.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/banner-recognition.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{ background: GALILEE_SCRIM }}
        />
        <div
          className="absolute inset-0"
          style={{ background: GALILEE_VIGNETTE }}
        />
      </div>

      {/* ─── Two columns: stone left, text right ─── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-[0.95fr_1fr] md:gap-16 lg:gap-20">
          {/* LEFT — the refined stone */}
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
              className="eyebrow text-gold-light"
            >
              A Covenant in Stone
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
              className="font-display mt-4 text-4xl leading-[1.04] text-cream md:text-[60px]"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.45)" }}
            >
              The Oneness Stone
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.22, ease: reverentEase }}
              className="font-serif mt-6 space-y-5 text-lg leading-[1.7] text-cream/85 md:text-xl"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
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
                className="block h-px w-10 bg-gold-light/70"
              />
              <span className="font-serif text-base italic text-gold-light md:text-lg">
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
// The round Oneness Stone — a refined pale-limestone medallion with a
// gilded engraved ring and two columns of carved denomination names.
// Palette: Magdala cream limestone · gold rim · charcoal inscription.
// All coordinates are static, so server and client render identically.
// ────────────────────────────────────────────────────────────────────

function CircleStone() {
  const cx = 300;
  const cy = 310;
  const r = 266;

  // Inscription layout — sits comfortably inside the gilded ring.
  const titleY = 126;
  const dividerTopY = 150;
  const colCenterOffset = 104;
  const firstNameY = 184;
  const lineSpacing = 17.5;
  const lastNameY = firstNameY + (leftCol.length - 1) * lineSpacing;
  const dividerBotY = lastNameY + 20;
  const scriptureY = dividerBotY + 28;

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
        aria-label="The Oneness Stone — a round commemorative limestone carved with the names of 30 Christian denominations"
        className="relative block w-full"
        style={{
          filter:
            "drop-shadow(0 6px 12px rgba(0,0,0,0.28)) drop-shadow(0 26px 46px rgba(8,22,30,0.45))",
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

          {/* Dome shading — soft top-left light, cool lower-right shadow */}
          <radialGradient id="osDome" cx="0.32" cy="0.26" r="1.0">
            <stop offset="0" stopColor="#fffaf0" stopOpacity="0.34" />
            <stop offset="0.4" stopColor="#fffaf0" stopOpacity="0" />
            <stop offset="0.72" stopColor="#16242c" stopOpacity="0" />
            <stop offset="1" stopColor="#16242c" stopOpacity="0.34" />
          </radialGradient>

          {/* Top sunlit rim + bottom shade */}
          <linearGradient id="osTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf3d6" stopOpacity="0.75" />
            <stop offset="1" stopColor="#fdf3d6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#15222a" stopOpacity="0" />
            <stop offset="1" stopColor="#15222a" stopOpacity="0.45" />
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

          {/* Refined engraving — subtle incised letterpress: a soft light
              catch below-right and a shadow above-left of each glyph. */}
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
          fill="#0a1820"
          opacity="0.5"
        />

        {/* Stone base */}
        <circle cx={cx} cy={cy} r={r} fill="url(#osFace)" />

        {/* Interior, clipped to the disc */}
        <g clipPath="url(#osClip)">
          {/* Soft mottling */}
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

          {/* Fine grain */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="#000"
            filter="url(#osGrain)"
            opacity="0.28"
          />

          {/* A couple of faint hairline veins for character */}
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

          {/* Bottom shade + top sunlit rim */}
          <ellipse cx={cx} cy={cy + r - 28} rx={r - 4} ry={48} fill="url(#osBot)" />
          <path
            d={`M ${cx - r + 10} ${cy - 48} A ${r - 8} ${r - 8} 0 0 1 ${cx + r - 10} ${cy - 48}`}
            fill="none"
            stroke="url(#osTop)"
            strokeWidth="30"
            opacity="0.6"
          />

          {/* Dome shading for a rounded-disc feel */}
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

        {/* ─── Gilded engraved ring (channel + gold fill + highlight) ─── */}
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
        {/* Thin inner hairline */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 30}
          fill="none"
          stroke="#5a4a2a"
          strokeWidth="0.6"
          opacity="0.4"
        />

        {/* ─── Carved inscriptions ─── */}
        <g filter="url(#osEngrave)">
          {/* Title */}
          <text
            x={cx}
            y={titleY}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
            fontSize="17"
            fontWeight="700"
            fill="#2a2418"
            style={{ letterSpacing: "5.5px" }}
          >
            THE ONENESS STONE
          </text>

          {/* Top divider with a gold diamond */}
          <line
            x1={cx - 128}
            y1={dividerTopY}
            x2={cx - 12}
            y2={dividerTopY}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1={cx + 12}
            y1={dividerTopY}
            x2={cx + 128}
            y2={dividerTopY}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d={`M ${cx} ${dividerTopY - 4.5} L ${cx + 4.5} ${dividerTopY} L ${cx} ${dividerTopY + 4.5} L ${cx - 4.5} ${dividerTopY} Z`}
            fill="#b8893a"
          />

          {/* LEFT column */}
          {leftCol.map((name, i) => (
            <text
              key={`L-${name}`}
              x={cx - colCenterOffset}
              y={firstNameY + i * lineSpacing}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize="13.5"
              fontWeight="600"
              fill="#2a2418"
              style={{ letterSpacing: "1.5px" }}
            >
              {name.toUpperCase()}
            </text>
          ))}

          {/* RIGHT column */}
          {rightCol.map((name, i) => (
            <text
              key={`R-${name}`}
              x={cx + colCenterOffset}
              y={firstNameY + i * lineSpacing}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize="13.5"
              fontWeight="600"
              fill="#2a2418"
              style={{ letterSpacing: "1.5px" }}
            >
              {name.toUpperCase()}
            </text>
          ))}

          {/* Center hairline */}
          <line
            x1={cx}
            y1={firstNameY - 4}
            x2={cx}
            y2={lastNameY + 4}
            stroke="#2a2418"
            strokeWidth="0.5"
            opacity="0.22"
          />

          {/* Bottom divider with a gold diamond */}
          <line
            x1={cx - 128}
            y1={dividerBotY}
            x2={cx - 12}
            y2={dividerBotY}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1={cx + 12}
            y1={dividerBotY}
            x2={cx + 128}
            y2={dividerBotY}
            stroke="#2a2418"
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d={`M ${cx} ${dividerBotY - 4.5} L ${cx + 4.5} ${dividerBotY} L ${cx} ${dividerBotY + 4.5} L ${cx - 4.5} ${dividerBotY} Z`}
            fill="#b8893a"
          />

          {/* Scripture reference */}
          <text
            x={cx}
            y={scriptureY}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="13.5"
            fontWeight="700"
            fill="#2a2418"
            style={{ letterSpacing: "4.5px" }}
          >
            JOHN · 17 · 21
          </text>
        </g>
      </svg>
    </div>
  );
}
