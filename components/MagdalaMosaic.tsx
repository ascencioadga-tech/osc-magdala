"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
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
                Tap the sea on the map to lift it{" "}
                <span aria-hidden="true">→</span>
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

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // The resting sea's on-screen rect, captured at click time so the lifted
  // copy can fly out from its exact spot on the map.
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const restRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const lift = () => {
    if (restRef.current) setOrigin(restRef.current.getBoundingClientRect());
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="relative mx-auto w-full max-w-[560px]">
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

        {/* Clickable Sea of Galilee — sits registered over the map's own sea
            (seamless) until lifted. A soft hover glow hints it is interactive. */}
        {!open && (
          <motion.button
            ref={restRef}
            type="button"
            onClick={lift}
            aria-label="Lift the Sea of Galilee out of the mosaic"
            className="group absolute z-20 cursor-pointer"
            style={{
              left: `${SEA_BOX.left}%`,
              top: `${SEA_BOX.top}%`,
              width: `${SEA_BOX.width}%`,
              height: `${SEA_BOX.height}%`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <Image
              src="/sea-of-galilee.png"
              alt=""
              fill
              sizes="120px"
              className="pointer-events-none object-contain transition duration-300 group-hover:[filter:drop-shadow(0_6px_12px_rgba(62,92,122,0.5))]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(62,92,122,0.28),transparent_70%)] opacity-0 transition duration-300 group-hover:opacity-100"
            />
          </motion.button>
        )}
      </div>

      {/* Focused "lifted" view — portaled to <body> so it escapes the mosaic's
          3D transform context and covers the full viewport. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="sea-overlay"
                role="dialog"
                aria-modal="true"
                aria-label="The Sea of Galilee — reserved for One Step Closer benefactors"
                className="fixed inset-0 z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: reverentEase }}
              >
                {/* Backdrop — deep Galilee-blue velvet (Magdala palette);
                    click to settle back. */}
                <button
                  type="button"
                  aria-label="Settle the Sea of Galilee back into the mosaic"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 cursor-zoom-out backdrop-blur-2xl"
                  style={{
                    background:
                      "radial-gradient(125% 100% at 50% 30%, rgba(22,52,68,0.94) 0%, rgba(13,34,46,0.975) 52%, rgba(7,20,28,0.99) 100%)",
                  }}
                />
                {/* Hairline gold inner frame — a quiet 5-star detail */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-[20px] ring-1 ring-gold-light/15 md:inset-7"
                />

                {/* Elegant close */}
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream/70 backdrop-blur-sm transition hover:border-gold-light/70 hover:text-cream md:right-8 md:top-8"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </motion.button>

                {/* Dynamic composition — the map bleeds in and dissolves into
                    the ground; the words rise on the right. */}
                <div className="pointer-events-none absolute inset-0">
                  {/* The lifted Sea of Galilee. A centering frame (CSS
                      translate) wraps the motion element so the lift transform
                      never fights the centering. Edges feather into the dark. */}
                  <div
                    className="absolute left-1/2 top-[27%] h-[40vh] max-h-[330px] -translate-x-1/2 -translate-y-1/2 md:left-[31%] md:top-1/2 md:h-[64vh] md:max-h-[560px]"
                    style={{ aspectRatio: SEA_ASPECT }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Settle the Sea of Galilee back into the mosaic"
                      className="pointer-events-auto absolute inset-0 cursor-zoom-out"
                      initial={liftFrom(origin)}
                      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      exit={liftFrom(origin)}
                      transition={{ type: "spring", stiffness: 170, damping: 24 }}
                    >
                      <motion.span
                        className="absolute inset-0 block"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src="/sea-of-galilee.png"
                          alt="The Sea of Galilee, lifted from the Magdala mosaic"
                          fill
                          sizes="(min-width: 768px) 40vh, 40vh"
                          className="pointer-events-none object-contain"
                          style={{
                            WebkitMaskImage:
                              "radial-gradient(94% 96% at 50% 50%, #000 82%, transparent 100%)",
                            maskImage:
                              "radial-gradient(94% 96% at 50% 50%, #000 82%, transparent 100%)",
                            filter: "drop-shadow(0 30px 55px rgba(0,0,0,0.55))",
                          }}
                        />
                      </motion.span>
                    </motion.button>
                  </div>

                  {/* Words — gathered on the right (below the sea on mobile) */}
                  <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-7 pb-14 text-center md:inset-y-0 md:left-auto md:right-[7%] md:max-w-[40%] md:items-start md:justify-center md:px-0 md:pb-0 md:text-left">
                    <motion.h2
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: reverentEase }}
                      className="font-display text-[40px] leading-[1.0] text-cream md:text-[72px]"
                      style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
                    >
                      The Sea of Galilee
                    </motion.h2>

                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.4 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: 0.42, ease: reverentEase }}
                      className="flex origin-center items-center gap-3 md:origin-left"
                    >
                      <span className="block h-px w-16 bg-gradient-to-r from-gold-light to-transparent" />
                      <svg
                        viewBox="0 0 10 10"
                        className="h-2 w-2 fill-gold-light"
                        aria-hidden="true"
                      >
                        <path d="M5 0l5 5-5 5-5-5z" />
                      </svg>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.8, delay: 0.52, ease: reverentEase }}
                      className="font-serif max-w-md text-lg leading-relaxed text-cream/90 md:text-xl"
                    >
                      At the heart of the Magdala Mosaic, the Sea of Galilee has
                      been set aside in full —{" "}
                      <span className="text-gold-light">
                        reserved for the benefactors of One Step Closer.
                      </span>
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: reverentEase }}
                      className="font-serif max-w-md text-sm italic leading-relaxed text-cream/60 md:text-base"
                    >
                      A rare opportunity to hold a place in the Holy
                      Land&rsquo;s most storied waters — woven into Magdala, one
                      stone at a time, for generations to come.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: 0.72, ease: reverentEase }}
                      className="mt-2 flex flex-col items-center gap-4 md:items-start"
                    >
                      <Link
                        href={SPONSOR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-medium tracking-wide text-burgundy-ink ring-1 ring-gold-light/50 shadow-[0_16px_40px_-14px_rgba(200,146,58,0.6)] transition hover:ring-gold-light/80 hover:shadow-[0_22px_52px_-14px_rgba(200,146,58,0.8)]"
                        style={{
                          background:
                            "linear-gradient(180deg, #edcc7a 0%, #d3a14a 48%, #c0872f 100%)",
                        }}
                      >
                        Reserve your place
                        <span
                          aria-hidden="true"
                          className="transition group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="eyebrow text-[10px] text-cream/55 underline-offset-4 transition hover:text-cream hover:underline"
                      >
                        Settle it back into the mosaic
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

// Transform that places the centered lifted sea back onto its resting spot on
// the map, so it can animate (fly + scale) out from there and settle back.
function liftFrom(origin: DOMRect | null) {
  if (!origin || typeof window === "undefined") {
    return { opacity: 0, scale: 0.6, x: 0, y: 0 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const desktop = vw >= 768;
  // Match the resting frame in the JSX so the sea flies from the map to
  // exactly where it settles.
  const targetH = desktop ? Math.min(vh * 0.64, 560) : Math.min(vh * 0.4, 330);
  const targetW = targetH * SEA_ASPECT;
  const targetCx = desktop ? vw * 0.31 : vw / 2;
  const targetCy = desktop ? vh / 2 : vh * 0.27;
  const originCx = origin.left + origin.width / 2;
  const originCy = origin.top + origin.height / 2;
  return {
    x: originCx - targetCx,
    y: originCy - targetCy,
    scale: origin.width / targetW,
    opacity: 0.4,
  };
}

