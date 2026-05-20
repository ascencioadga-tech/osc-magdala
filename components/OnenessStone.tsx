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
      className="relative flex min-h-screen items-center overflow-hidden bg-burgundy-ink"
    >
      {/* ─── Background video — full-bleed, ceremonial dark scrim ─── */}
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
        {/* Burgundy gradient scrim — strong at edges, lighter in the
            middle so the footage stays clearly visible behind the content. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,8,16,0.78) 0%, rgba(42,8,16,0.35) 35%, rgba(42,8,16,0.35) 65%, rgba(42,8,16,0.78) 100%)",
          }}
        />
        {/* Side-vignette so the stone + prose still pop without hiding
            the video. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(42,8,16,0) 0%, rgba(42,8,16,0.25) 70%, rgba(42,8,16,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-14 md:grid-cols-[1.05fr_1fr] md:gap-16 lg:gap-20">
          {/* LEFT — the round stone */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: reverentEase }}
            className="relative"
          >
            <CircleStone />
          </motion.div>

          {/* RIGHT — copy, sat on a soft burgundy blur-card so it lifts
              cleanly off the background video */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-x-5 -inset-y-7 rounded-[28px] bg-burgundy-ink/55 backdrop-blur-[6px] ring-1 ring-cream/10 md:-inset-x-8 md:-inset-y-9"
              style={{
                background:
                  "linear-gradient(180deg, rgba(42,8,16,0.55) 0%, rgba(42,8,16,0.65) 100%)",
              }}
            />

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: reverentEase }}
                className="eyebrow text-gold-light"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.45)" }}
              >
                A Covenant in Stone
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.12, ease: reverentEase }}
                className="font-display mt-4 text-4xl leading-[1.04] text-cream md:text-[60px]"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}
              >
                The Oneness Stone
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.28, ease: reverentEase }}
                className="font-serif mt-8 space-y-5 text-lg leading-[1.7] text-cream/95 md:text-xl"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
              >
                <p>
                  The Oneness Stone will sit at the entrance of the future OSC
                  restaurant in Magdala. Carved into its face are the names of
                  the Christian denominations who came together to build this
                  place — Catholic, Orthodox, Anglican, Lutheran, Methodist,
                  Reformed, Baptist, Pentecostal, and many more — gathered on
                  a single stone.
                </p>
                <p>
                  It is a covenant marker and a public witness — a sign that
                  Catholics, Protestants, and Eastern Christians can work
                  together in concrete ways while remaining faithful to their
                  own traditions. Names not on separate monuments, but on one
                  shared stone.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.52, ease: reverentEase }}
                className="mt-10 flex items-center gap-4 text-sm text-cream/80"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}
              >
                <span
                  aria-hidden="true"
                  className="block h-px w-10 bg-gold-light/80"
                />
                <span className="font-serif italic text-gold-light">
                  “That they may all be one.” — John 17:21
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// The round Oneness Stone — realistic limestone disc with two columns
// of 15 carved denomination names.
// ────────────────────────────────────────────────────────────────────

function CircleStone() {
  const cx = 300;
  const cy = 310;
  const r = 268;

  // Inscription layout — no cross; tuned to sit comfortably inside
  // the inner bevel ring with breathing room top, bottom, and sides.
  const titleY = 124;
  const dividerTopY = 146;
  const colCenterOffset = 102;
  const firstNameY = 180;
  const lineSpacing = 17.5;
  const lastNameY = firstNameY + (leftCol.length - 1) * lineSpacing;
  const dividerBotY = lastNameY + 20;
  const scriptureY = dividerBotY + 26;

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <svg
        viewBox="0 0 600 620"
        role="img"
        aria-label="The Oneness Stone — a round commemorative limestone carved with the names of 30 Christian denominations"
        className="relative block w-full"
        style={{
          // Multi-layer shadow gives the stone real weight in the scene.
          filter:
            "drop-shadow(0 4px 8px rgba(0,0,0,0.30)) drop-shadow(0 22px 36px rgba(48,28,10,0.42)) drop-shadow(0 60px 100px rgba(0,0,0,0.30))",
        }}
      >
        <defs>
          {/* Warm radial glow behind the stone */}
          <radialGradient id="oneSoftGlow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#e8c267" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#c8923a" stopOpacity="0.08" />
            <stop offset="1" stopColor="#c8923a" stopOpacity="0" />
          </radialGradient>

          {/* Limestone face — cooler Jerusalem-stone tone with strong
              directional lighting (sun upper-left, shadow lower-right). */}
          <radialGradient id="oneStoneFace" cx="0.34" cy="0.26" r="0.92">
            <stop offset="0" stopColor="#ecdfc1" />
            <stop offset="0.20" stopColor="#dcccA8" />
            <stop offset="0.45" stopColor="#bcab87" />
            <stop offset="0.70" stopColor="#917f5d" />
            <stop offset="0.88" stopColor="#6b5a3f" />
            <stop offset="1" stopColor="#43361f" />
          </radialGradient>

          {/* Subtle horizontal sedimentary banding — three faint stripes
              that read as bedded limestone */}
          <linearGradient id="oneStoneBeds" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.18" stopColor="#3a2810" stopOpacity="0.06" />
            <stop offset="0.20" stopColor="#3a2810" stopOpacity="0" />
            <stop offset="0.46" stopColor="#3a2810" stopOpacity="0.05" />
            <stop offset="0.48" stopColor="#3a2810" stopOpacity="0" />
            <stop offset="0.74" stopColor="#3a2810" stopOpacity="0.07" />
            <stop offset="0.76" stopColor="#3a2810" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>

          {/* Dome shading overlay — upper-left light, lower-right shadow */}
          <radialGradient id="oneStoneDome" cx="0.30" cy="0.26" r="1.0">
            <stop offset="0" stopColor="#fff6dc" stopOpacity="0.30" />
            <stop offset="0.35" stopColor="#fff6dc" stopOpacity="0" />
            <stop offset="0.70" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#150a04" stopOpacity="0.55" />
          </radialGradient>

          {/* Iron-stain drip gradient — vertical brownish streaks */}
          <linearGradient id="oneStoneStain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a3a18" stopOpacity="0" />
            <stop offset="0.4" stopColor="#5a3a18" stopOpacity="0.20" />
            <stop offset="1" stopColor="#3a2510" stopOpacity="0.32" />
          </linearGradient>

          {/* Top edge highlight (sunlit rim) */}
          <linearGradient id="oneStoneTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbecc0" stopOpacity="0.80" />
            <stop offset="1" stopColor="#fbecc0" stopOpacity="0" />
          </linearGradient>

          {/* Bottom edge shadow */}
          <linearGradient id="oneStoneBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a0d04" stopOpacity="0" />
            <stop offset="1" stopColor="#1a0d04" stopOpacity="0.65" />
          </linearGradient>

          {/* Bevel side — the thickness of the disc seen as a thin band */}
          <linearGradient id="oneStoneBevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2810" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#2a1c0a" stopOpacity="0.30" />
            <stop offset="1" stopColor="#3a2810" stopOpacity="0.55" />
          </linearGradient>

          {/* Fine grain — fractal noise */}
          <filter
            id="oneStoneTex"
            x="-2%"
            y="-2%"
            width="104%"
            height="104%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.7"
              numOctaves="2"
              seed="9"
            />
            <feColorMatrix
              values="0 0 0 0 0.30
                      0 0 0 0 0.23
                      0 0 0 0 0.14
                      0 0 0 0.45 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Coarse pitting */}
          <filter
            id="oneStonePits"
            x="-2%"
            y="-2%"
            width="104%"
            height="104%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="3"
              seed="23"
            />
            <feColorMatrix
              values="0 0 0 0 0.20
                      0 0 0 0 0.15
                      0 0 0 0 0.08
                      0 0 0 0.35 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Patchy weathering — large soft blotches */}
          <filter
            id="oneStoneBlotch"
            x="-2%"
            y="-2%"
            width="104%"
            height="104%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="2"
              seed="41"
            />
            <feColorMatrix
              values="0 0 0 0 0.28
                      0 0 0 0 0.22
                      0 0 0 0 0.13
                      0 0 0 0.55 -0.15"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Carved-into-stone filter — deeper inset with two-side relief.
              Light catches the bottom-right wall of each groove; a darker
              halo above-left reads as the upper groove wall in shadow. */}
          <filter
            id="carvedInto"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            {/* Larger light catch on the bottom-right wall */}
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="0.7"
              result="thicker"
            />
            <feFlood floodColor="#f8e6b6" floodOpacity="0.95" />
            <feComposite in2="thicker" operator="in" result="lit" />
            <feOffset in="lit" dx="1.6" dy="1.6" result="litOffset" />
            <feGaussianBlur
              in="litOffset"
              stdDeviation="0.5"
              result="litSoft"
            />

            {/* Darker shadow on the top-left wall — reads as the chiselled
                depth of the groove */}
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="0.5"
              result="thicker2"
            />
            <feFlood floodColor="#08040a" floodOpacity="0.85" />
            <feComposite in2="thicker2" operator="in" result="dark" />
            <feOffset in="dark" dx="-1" dy="-1" result="darkOffset" />
            <feGaussianBlur
              in="darkOffset"
              stdDeviation="0.4"
              result="darkSoft"
            />

            {/* Subtle outer drop-shadow so the carving feels recessed
                into the stone face */}
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="0.2"
              result="thicker3"
            />
            <feFlood floodColor="#0a0604" floodOpacity="0.5" />
            <feComposite in2="thicker3" operator="in" result="ring" />
            <feGaussianBlur
              in="ring"
              stdDeviation="1.4"
              result="ringSoft"
            />

            <feMerge>
              <feMergeNode in="ringSoft" />
              <feMergeNode in="litSoft" />
              <feMergeNode in="darkSoft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path so chips & shadows stay inside the stone */}
          <clipPath id="stoneClip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* ─── Soft warm glow behind the stone ─── */}
        <ellipse
          cx={cx}
          cy={cy + 18}
          rx={r + 70}
          ry={r + 46}
          fill="url(#oneSoftGlow)"
        />

        {/* ─── Cast shadow on the ground ─── */}
        <ellipse
          cx={cx}
          cy={cy + r + 18}
          rx={r * 0.84}
          ry={15}
          fill="#1a0608"
          opacity="0.50"
        />

        {/* ─── Stone base ─── */}
        <circle cx={cx} cy={cy} r={r} fill="url(#oneStoneFace)" />

        {/* ─── Everything inside the stone is clipped to the disc ─── */}
        <g clipPath="url(#stoneClip)">
          {/* Patchy weathering blotches — large, soft */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="#000"
            filter="url(#oneStoneBlotch)"
            opacity="0.4"
          />

          {/* Fine grain texture */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="#000"
            filter="url(#oneStoneTex)"
            opacity="0.6"
          />

          {/* Coarse pitting */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="#000"
            filter="url(#oneStonePits)"
            opacity="0.35"
          />

          {/* Subtle color blotches — slightly different limestone tones */}
          <ellipse
            cx={cx - 75}
            cy={cy - 105}
            rx="85"
            ry="55"
            fill="#7a6440"
            opacity="0.14"
          />
          <ellipse
            cx={cx + 110}
            cy={cy + 80}
            rx="95"
            ry="65"
            fill="#8a7350"
            opacity="0.11"
          />
          <ellipse
            cx={cx - 130}
            cy={cy + 130}
            rx="60"
            ry="40"
            fill="#6a5530"
            opacity="0.13"
          />
          <ellipse
            cx={cx + 80}
            cy={cy - 170}
            rx="50"
            ry="35"
            fill="#7a6440"
            opacity="0.10"
          />

          {/* Surface cracks — thin hairlines */}
          <path
            d={`M ${cx - 235} ${cy + 50} Q ${cx - 180} ${cy + 35} ${cx - 130} ${cy + 60} T ${cx - 30} ${cy + 75}`}
            fill="none"
            stroke="#3d2a14"
            strokeWidth="0.6"
            opacity="0.45"
          />
          <path
            d={`M ${cx + 90} ${cy - 215} Q ${cx + 120} ${cy - 175} ${cx + 100} ${cy - 130} T ${cx + 80} ${cy - 70}`}
            fill="none"
            stroke="#3d2a14"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d={`M ${cx + 200} ${cy + 130} Q ${cx + 215} ${cy + 165} ${cx + 195} ${cy + 200}`}
            fill="none"
            stroke="#3d2a14"
            strokeWidth="0.5"
            opacity="0.4"
          />

          {/* Subtle veining */}
          <path
            d={`M ${cx - 200} ${cy - 80} Q ${cx - 110} ${cy - 115} ${cx - 40} ${cy - 70} T ${cx + 150} ${cy - 35}`}
            fill="none"
            stroke="#5a4225"
            strokeWidth="0.7"
            opacity="0.22"
          />
          <path
            d={`M ${cx - 160} ${cy + 105} Q ${cx - 60} ${cy + 135} ${cx + 30} ${cy + 95} T ${cx + 190} ${cy + 70}`}
            fill="none"
            stroke="#5a4225"
            strokeWidth="0.6"
            opacity="0.2"
          />

          {/* Sedimentary banding — faint horizontal layers across the face */}
          <rect
            x="0"
            y="0"
            width="600"
            height="620"
            fill="url(#oneStoneBeds)"
          />

          {/* Iron-stain drip streaks — vertical brownish water marks */}
          <ellipse
            cx={cx - 90}
            cy={cy - 30}
            rx="22"
            ry="160"
            fill="url(#oneStoneStain)"
            opacity="0.55"
          />
          <ellipse
            cx={cx + 130}
            cy={cy + 20}
            rx="14"
            ry="140"
            fill="url(#oneStoneStain)"
            opacity="0.42"
          />
          <ellipse
            cx={cx + 30}
            cy={cy + 60}
            rx="10"
            ry="120"
            fill="url(#oneStoneStain)"
            opacity="0.28"
          />

          {/* Mineral specks — varied size, colour and shape so the eye
              reads it as real grain rather than uniform noise. */}
          {[
            // Dark iron specks
            { x: -185, y: -65, r: 2.8, c: "#2a1c0a", o: 0.55 },
            { x: 150, y: -120, r: 2.2, c: "#2a1c0a", o: 0.50 },
            { x: -85, y: -200, r: 1.9, c: "#2a1c0a", o: 0.50 },
            { x: 95, y: 185, r: 2.4, c: "#2a1c0a", o: 0.48 },
            { x: -155, y: 140, r: 1.7, c: "#2a1c0a", o: 0.45 },
            { x: 205, y: 60, r: 1.5, c: "#2a1c0a", o: 0.45 },
            { x: -215, y: 35, r: 1.4, c: "#2a1c0a", o: 0.42 },
            { x: 65, y: 235, r: 1.6, c: "#2a1c0a", o: 0.40 },
            { x: -45, y: -235, r: 1.3, c: "#2a1c0a", o: 0.42 },
            { x: 175, y: -45, r: 1.8, c: "#2a1c0a", o: 0.44 },
            // Rust / oxidized specks
            { x: -120, y: 35, r: 1.6, c: "#7a4218", o: 0.55 },
            { x: 110, y: -80, r: 1.4, c: "#7a4218", o: 0.50 },
            { x: -210, y: -110, r: 1.2, c: "#7a4218", o: 0.45 },
            { x: 200, y: 150, r: 1.3, c: "#7a4218", o: 0.45 },
            // Small micro-grain
            { x: 35, y: -55, r: 0.8, c: "#1a0e04", o: 0.40 },
            { x: -75, y: 80, r: 0.7, c: "#1a0e04", o: 0.40 },
            { x: 130, y: 215, r: 0.9, c: "#1a0e04", o: 0.42 },
            { x: -195, y: 175, r: 0.8, c: "#1a0e04", o: 0.42 },
            { x: 90, y: -180, r: 0.8, c: "#1a0e04", o: 0.42 },
            { x: -135, y: -160, r: 0.7, c: "#1a0e04", o: 0.40 },
            { x: 165, y: -10, r: 0.6, c: "#1a0e04", o: 0.38 },
            { x: -25, y: 195, r: 0.7, c: "#1a0e04", o: 0.40 },
            { x: 220, y: -70, r: 0.6, c: "#1a0e04", o: 0.36 },
            { x: -240, y: -10, r: 0.6, c: "#1a0e04", o: 0.36 },
            // Lighter calcite specks (pale highlights)
            { x: -65, y: -150, r: 1.0, c: "#fbecc0", o: 0.42 },
            { x: 145, y: 90, r: 0.9, c: "#fbecc0", o: 0.38 },
            { x: 0, y: -100, r: 0.7, c: "#fbecc0", o: 0.35 },
            { x: -180, y: 80, r: 0.8, c: "#fbecc0", o: 0.36 },
            { x: 75, y: 130, r: 0.7, c: "#fbecc0", o: 0.34 },
          ].map((s, i) => (
            <circle
              key={i}
              cx={cx + s.x}
              cy={cy + s.y}
              r={s.r}
              fill={s.c}
              opacity={s.o}
            />
          ))}

          {/* Fossil-inclusion hints — tiny shell / spiral outlines */}
          <g fill="none" stroke="#3a2810" strokeWidth="0.5" opacity="0.4">
            {/* small ammonite-like spiral */}
            <path
              d={`M ${cx + 165} ${cy + 100}
                  a 3 3 0 1 1 -3 3
                  a 2 2 0 1 1 2 -2
                  a 1 1 0 1 1 -1 1`}
            />
            {/* tiny shell oval */}
            <ellipse cx={cx - 175} cy={cy - 130} rx="3.5" ry="2" />
            <line
              x1={cx - 178}
              y1={cy - 130}
              x2={cx - 172}
              y2={cy - 130}
              strokeWidth="0.3"
            />
            {/* second small oval inclusion */}
            <ellipse cx={cx + 60} cy={cy - 195} rx="2.5" ry="1.5" />
          </g>

          {/* Chisel-mark dashes radiating around the inner bevel — implies
              hand-cut craftsmanship */}
          {Array.from({ length: 56 }).map((_, i) => {
            const a = (i * 360) / 56;
            const rad = (a * Math.PI) / 180;
            const r1 = r - 7;
            const r2 = r - 13;
            const x1 = cx + r1 * Math.cos(rad);
            const y1 = cy + r1 * Math.sin(rad);
            const x2 = cx + r2 * Math.cos(rad);
            const y2 = cy + r2 * Math.sin(rad);
            return (
              <line
                key={`chisel-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#2a1c0a"
                strokeWidth="0.6"
                opacity={0.30 + (i % 3) * 0.05}
                strokeLinecap="round"
              />
            );
          })}

          {/* Edge chips — break the perfect circle with hand-cut wear */}
          <path
            d={`M ${cx + r - 4} ${cy - 70}
                Q ${cx + r + 6} ${cy - 58} ${cx + r - 2} ${cy - 46}
                Q ${cx + r - 14} ${cy - 52} ${cx + r - 4} ${cy - 70} Z`}
            fill="#2a1c0a"
            opacity="0.55"
          />
          <path
            d={`M ${cx - r + 6} ${cy + 110}
                Q ${cx - r - 6} ${cy + 124} ${cx - r + 2} ${cy + 138}
                Q ${cx - r + 16} ${cy + 130} ${cx - r + 6} ${cy + 110} Z`}
            fill="#2a1c0a"
            opacity="0.58"
          />
          <path
            d={`M ${cx + 55} ${cy - r + 4}
                Q ${cx + 62} ${cy - r - 6} ${cx + 72} ${cy - r + 2}
                Q ${cx + 65} ${cy - r + 14} ${cx + 55} ${cy - r + 4} Z`}
            fill="#2a1c0a"
            opacity="0.52"
          />
          {/* A larger weathered chip on the lower-left */}
          <path
            d={`M ${cx - 130} ${cy + r - 5}
                Q ${cx - 145} ${cy + r + 8} ${cx - 120} ${cy + r + 4}
                Q ${cx - 105} ${cy + r - 4} ${cx - 130} ${cy + r - 5} Z`}
            fill="#2a1c0a"
            opacity="0.55"
          />
          {/* Small chip on upper-right */}
          <path
            d={`M ${cx + 145} ${cy - r + 18}
                Q ${cx + 158} ${cy - r + 10} ${cx + 150} ${cy - r + 4}
                Q ${cx + 138} ${cy - r + 14} ${cx + 145} ${cy - r + 18} Z`}
            fill="#2a1c0a"
            opacity="0.48"
          />

          {/* Bottom edge shadow on the disc */}
          <ellipse
            cx={cx}
            cy={cy + r - 30}
            rx={r - 4}
            ry={50}
            fill="url(#oneStoneBot)"
          />

          {/* Top edge sunlit highlight */}
          <path
            d={`M ${cx - r + 10} ${cy - 50} A ${r - 8} ${r - 8} 0 0 1 ${cx + r - 10} ${cy - 50}`}
            fill="none"
            stroke="url(#oneStoneTop)"
            strokeWidth="34"
            opacity="0.65"
          />

          {/* Dome shading — gives a 3D rounded-disc feel */}
          <circle cx={cx} cy={cy} r={r} fill="url(#oneStoneDome)" />
        </g>

        {/* ─── 3D side bevel — a darker ring just inside the outline
            that reads as the thickness of the stone disc ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 2.5}
          fill="none"
          stroke="url(#oneStoneBevel)"
          strokeWidth="5"
          opacity="0.9"
        />

        {/* ─── Inner bevel ring (the polished face edge, sat just inside
            the chiselled rim) ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 14}
          fill="none"
          stroke="#3d2a14"
          strokeWidth="0.9"
          opacity="0.55"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r - 18}
          fill="none"
          stroke="#fbecc0"
          strokeWidth="0.6"
          opacity="0.35"
        />

        {/* ─── Outer outline — hand-cut edge ─── */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1a0e04"
          strokeWidth="2.2"
          opacity="0.75"
        />

        {/* ─── All inscriptions: carved with light/shadow ─── */}
        <g filter="url(#carvedInto)">
          {/* Title */}
          <text
            x={cx}
            y={titleY}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
            fontSize="17"
            fontWeight="700"
            fill="#241608"
            style={{ letterSpacing: "5.5px" }}
          >
            THE ONENESS STONE
          </text>

          {/* Top divider — slim with diamond ornament centered */}
          <line
            x1={cx - 130}
            y1={dividerTopY}
            x2={cx - 12}
            y2={dividerTopY}
            stroke="#241608"
            strokeWidth="1"
            opacity="0.85"
          />
          <line
            x1={cx + 12}
            y1={dividerTopY}
            x2={cx + 130}
            y2={dividerTopY}
            stroke="#241608"
            strokeWidth="1"
            opacity="0.85"
          />
          <path
            d={`M ${cx} ${dividerTopY - 4} L ${cx + 4} ${dividerTopY} L ${cx} ${dividerTopY + 4} L ${cx - 4} ${dividerTopY} Z`}
            fill="#241608"
            opacity="0.85"
          />

          {/* LEFT column — 15 names */}
          {leftCol.map((name, i) => (
            <text
              key={`L-${name}`}
              x={cx - colCenterOffset}
              y={firstNameY + i * lineSpacing}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize="13.5"
              fontWeight="600"
              fill="#241608"
              style={{ letterSpacing: "1.5px" }}
            >
              {name.toUpperCase()}
            </text>
          ))}

          {/* RIGHT column — 15 names */}
          {rightCol.map((name, i) => (
            <text
              key={`R-${name}`}
              x={cx + colCenterOffset}
              y={firstNameY + i * lineSpacing}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
              fontSize="13.5"
              fontWeight="600"
              fill="#241608"
              style={{ letterSpacing: "1.5px" }}
            >
              {name.toUpperCase()}
            </text>
          ))}

          {/* Center hairline — subtle vertical column separator,
              short on purpose so it doesn't divide the stone visually. */}
          <line
            x1={cx}
            y1={firstNameY - 4}
            x2={cx}
            y2={lastNameY + 4}
            stroke="#241608"
            strokeWidth="0.5"
            opacity="0.25"
          />

          {/* Bottom divider — mirrors the top */}
          <line
            x1={cx - 130}
            y1={dividerBotY}
            x2={cx - 12}
            y2={dividerBotY}
            stroke="#241608"
            strokeWidth="1"
            opacity="0.85"
          />
          <line
            x1={cx + 12}
            y1={dividerBotY}
            x2={cx + 130}
            y2={dividerBotY}
            stroke="#241608"
            strokeWidth="1"
            opacity="0.85"
          />
          <path
            d={`M ${cx} ${dividerBotY - 4} L ${cx + 4} ${dividerBotY} L ${cx} ${dividerBotY + 4} L ${cx - 4} ${dividerBotY} Z`}
            fill="#241608"
            opacity="0.85"
          />

          {/* Scripture reference */}
          <text
            x={cx}
            y={scriptureY}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="13.5"
            fontWeight="700"
            fill="#241608"
            style={{ letterSpacing: "4.5px" }}
          >
            JOHN · 17 · 21
          </text>
        </g>
      </svg>
    </div>
  );
}
