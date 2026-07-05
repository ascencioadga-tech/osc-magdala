"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

// The Sea of Galilee's bounding box as a percentage of the (square) mosaic
// container. Derived from its position in the source map (origin 1169,330,
// size 267x441 within 2000x1335) and corrected for the square container's
// vertical letterbox, since the landscape image is fit by object-contain
// (rendered height = 0.6675 x width).
const SEA_BOX = { left: 58.45, top: 33.13, width: 13.35, height: 22.05 };
const SEA_ASPECT = 267 / 441;
const SPONSOR_URL = "https://www.magdalamosaic.org/sponsor";
const LEARN_URL = "https://www.magdalamosaic.org/";

export function MagdalaMosaic() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      {/* pt clears the fixed header (verse bar + nav ≈ 110px) so the back
          link is the first visible thing, not hidden under the chrome. */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-40 md:px-10 md:pb-28 md:pt-44">
        {/* Way back to the main journey */}
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2.5 text-sm font-medium text-burgundy/75 transition hover:text-burgundy"
        >
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to One Step Closer
        </Link>

        {/* ── Main row: text on left, mosaic on right ── */}
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-20">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: reverentEase }}
              className="eyebrow text-terracotta"
            >
              Another way to be part
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
              className="font-display mt-4 text-4xl leading-[1.04] text-burgundy md:text-[56px]"
            >
              The Magdala Mosaic.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.22, ease: reverentEase }}
              className="font-serif mt-7 space-y-4 text-lg leading-[1.7] text-ink/85 md:text-xl"
            >
              <p>
                Designed by <em>María Jesús Ortiz de Fernández</em> and crafted
                at the Burg Engelsdorf studio in Germany, the mosaic spans
                114&nbsp;m² and maps the land where Jesus walked — over 1.5
                million handcrafted stones, set into the floor of Magdala one
                tile at a time.
              </p>
              <p className="text-burgundy/85">
                Each individual piece has its own character, just as each human
                does. When brought together they create something beautiful.
              </p>
            </motion.div>

            {/* OSC reservation — the heart of this section's message */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.34, ease: reverentEase }}
              className="mt-7 border-l-2 border-gold/70 pl-5"
            >
              <p className="font-serif text-lg leading-[1.6] text-ink/90 md:text-xl">
                And at its very center, the{" "}
                <span className="text-burgundy">Sea of Galilee</span> is{" "}
                <em className="text-burgundy">saved in full for One Step Closer</em>{" "}
                — a place held in the mosaic for every member and participant.
              </p>
              <p className="eyebrow mt-3 text-[11px] text-terracotta">
                Hover the map — the Sea of Galilee rises
                <span aria-hidden="true"> →</span>
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.52, ease: reverentEase }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <Link
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
              >
                Sponsor a tile{" "}
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href={LEARN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy underline-offset-4 transition hover:text-terracotta hover:underline"
              >
                Learn more at magdalamosaic.org
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                  ↗
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Mosaic — transparent PNG bleeds into cream bg */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.15, ease: reverentEase }}
          >
            <MosaicVisual />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Mosaic visual — transparent PNG floating on cream, with a soft glow
// behind it and a very subtle 3D parallax tilt on hover.
// ────────────────────────────────────────────────────────────────────────

function MosaicVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.7 });
  const rotateY = useTransform(sx, [-1, 1], [-3, 3]);
  const rotateX = useTransform(sy, [-1, 1], [3, -3]);

  return (
    <div className="group/mosaic relative mx-auto w-full max-w-[560px]">
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          x.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
          y.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-square w-full"
      >
        {/* Soft warm halo behind the mosaic — gentle breathing pulse */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-[4%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(177,146,119,0.32), rgba(138,103,70,0.10) 60%, transparent 75%)",
            filter: "blur(24px)",
          }}
          animate={{ scale: [1, 1.035, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The mosaic — transparent PNG, contains naturally on the page */}
        <div className="absolute inset-0">
          <Image
            src="/magdala-mosaic.png"
            alt="The Magdala Mosaic — a hand-cut map of biblical Galilee"
            fill
            sizes="(min-width: 768px) 560px, 92vw"
            className="object-contain"
            priority
            style={{
              filter: "drop-shadow(0 18px 28px rgba(63, 14, 34, 0.18))",
            }}
          />
        </div>

        {/* The Sea of Galilee — sits registered in the map; hovering the
            mosaic lifts it out of the floor, and it settles back on leave. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.32,1)] group-hover/mosaic:-translate-y-6 group-hover/mosaic:scale-[1.45]"
          style={{
            left: `${SEA_BOX.left}%`,
            top: `${SEA_BOX.top}%`,
            width: `${SEA_BOX.width}%`,
            height: `${SEA_BOX.height}%`,
          }}
        >
          <Image
            src="/sea-of-galilee.png"
            alt=""
            fill
            sizes="180px"
            className="object-contain transition-[filter] duration-700 group-hover/mosaic:[filter:drop-shadow(0_22px_30px_rgba(20,5,11,0.5))]"
          />
        </div>
      </motion.div>
    </div>
  );
}
