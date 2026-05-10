"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { vision } from "@/lib/content";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

type Slide = {
  key: string;
  label: string;
  caption: string;
  image: string;
  alt: string;
};

const slides: Slide[] = [
  {
    key: "magdala-stone",
    label: "Magdala Stone",
    caption: "The synagogue stone of Magdala",
    image: "/vision/magdala-stone.jpg",
    alt: "The 1st-century synagogue stone of Magdala",
  },
  {
    key: "duc-in-altum",
    label: "Duc In Altum",
    caption: "Magdala · Galilee",
    image: "/vision/duc-in-altum.jpg",
    alt: "Duc In Altum at Magdala",
  },
  {
    key: "pilgrims",
    label: "Pilgrims",
    caption: "Hospitality together",
    image: "/vision/pilgrims.jpg",
    alt: "Pilgrims at Magdala",
  },
  {
    key: "encounter-chapel",
    label: "Encounter Chapel",
    caption: "Magdala · Galilee",
    image: "/vision/encounter-chapel.jpg",
    alt: "The Encounter Chapel at Magdala",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Vision() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3, once: true });

  // Scroll-progress marker — a vertical gold line that fills as you read.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 30%"],
  });
  const markerHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-24 md:px-10 md:pb-14 md:pt-32">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16 lg:gap-20">
          {/* LEFT — vision text with animated highlights and scroll marker */}
          <div className="relative">
            {/* Vertical scroll-progress marker on the left edge */}
            <div
              aria-hidden="true"
              className="absolute -left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-line-soft md:block"
            >
              <motion.span
                style={{ height: markerHeight }}
                className="block w-full origin-top bg-gold"
              />
            </div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.7, ease: reverentEase }}
              className="eyebrow text-terracotta"
            >
              {vision.eyebrow}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.9, delay: 0.15, ease: reverentEase }}
              className="font-display mt-6 text-xl leading-[1.4] text-burgundy md:text-[26px] md:leading-[1.45]"
            >
              At <Highlight inView={inView} delay={0.55}>Magdala</Highlight>
              {" — the Galilean crossroads where Jesus walked from synagogue to synagogue — Christians of every tradition are "}
              <Highlight inView={inView} delay={0.95}>stepping closer</Highlight>
              {" to one another by serving pilgrims together. One Step Closer is a "}
              <Highlight inView={inView} delay={1.35}>
                shared work of hospitality
              </Highlight>
              {": a restaurant, a volunteer program, an iconic artwork, and the pilgrims who carry the encounter home. From Galilee, "}
              <Highlight inView={inView} delay={1.75}>
                leaven changes the world
              </Highlight>
              .
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.7, delay: 2.05, ease: reverentEase }}
              className="mt-10 flex items-center gap-4 text-sm text-ink/70"
            >
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-gold/80"
              />
              <span className="font-serif italic text-burgundy/85">
                Around one table. In one hope.
              </span>
            </motion.div>
          </div>

          {/* RIGHT — photo carousel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            transition={{ duration: 0.9, delay: 0.4, ease: reverentEase }}
          >
            <PhotoCarousel slides={slides} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Highlight({
  children,
  inView,
  delay,
}: {
  children: React.ReactNode;
  inView: boolean;
  delay: number;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.85, delay, ease: reverentEase }}
        className="absolute bottom-[0.06em] left-0 right-0 h-[0.18em] origin-left rounded-sm bg-gold/55"
      />
    </span>
  );
}

function PhotoCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % slides.length),
      5400,
    );
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  return (
    <figure
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex flex-col"
    >
      {/* Frame — 3:2 to match the natural ratio of the photography */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-parchment shadow-[0_30px_60px_-30px_rgba(63,16,25,0.35)]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={slides[i].key}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{
              opacity: { duration: 1.2, ease: reverentEase },
              scale: { duration: 6.5, ease: "easeOut" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={slides[i].image}
              alt={slides[i].alt}
              fill
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 40vw, 90vw"
              className="object-cover"
              priority={i === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-burgundy/15" />
        {/* Top-left corner ornament */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 text-cream/90">
          <span className="block h-px w-6 bg-gold-light" />
          <span className="text-[10px] uppercase tracking-[0.28em]">
            from Magdala
          </span>
        </div>
      </div>

      {/* Slide title + caption — now lives below the image, no longer overlaid */}
      <figcaption className="mt-5">
        <h3 className="font-display text-2xl text-burgundy md:text-[28px]">
          {slides[i].label}
        </h3>
        <p className="font-serif mt-1 text-sm italic text-ink/70">
          {slides[i].caption}
        </p>
      </figcaption>

      {/* Dot indicators + paused state */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.label}`}
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
