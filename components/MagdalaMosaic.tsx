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
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
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

            {/* Inline stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: reverentEase }}
              className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-ink/70"
            >
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-burgundy">1.5M+</span>
                <span className="eyebrow text-[10px]">stones</span>
              </span>
              <span className="text-line">·</span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-burgundy">114</span>
                <span className="eyebrow text-[10px]">m²</span>
              </span>
              <span className="text-line">·</span>
              <span className="font-serif italic text-ink/70">
                sponsored one tile at a time
              </span>
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
    <div
      className="relative mx-auto w-full max-w-[560px]"
      style={{ perspective: 1200 }}
    >
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
              "radial-gradient(circle, rgba(224,185,100,0.32), rgba(200,146,58,0.10) 60%, transparent 75%)",
            filter: "blur(24px)",
          }}
          animate={{ scale: [1, 1.035, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The mosaic — transparent PNG, contains naturally on cream */}
        <div className="absolute inset-0">
          <Image
            src="/magdala-mosaic.png"
            alt="The Magdala Mosaic — a hand-cut map of biblical Galilee"
            fill
            sizes="(min-width: 768px) 560px, 92vw"
            className="object-contain"
            priority
            style={{
              filter: "drop-shadow(0 18px 28px rgba(63, 16, 25, 0.18))",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

