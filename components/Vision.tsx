"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { vision } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// The fuller vision, paged as three chapters the visitor steps through.
const chapters = [
  {
    key: "prayer",
    label: "Christ’s Prayer",
    body: (
      <>
        Animated by Christ&rsquo;s prayer at the Last Supper,{" "}
        <em>&ldquo;that they may all be one&rdquo;</em>{" "}
        (John&nbsp;17:20&ndash;23), and born from the Magdala experience where
        friendships have begun replacing inherited prejudices, OSC-HT envisages
        Christians from diverse confessions coming closer together while
        serving needy people.
      </>
    ),
  },
  {
    key: "step-by-step",
    label: "Step by Step",
    body: (
      <>
        True oneness is the work of the Holy Spirit and unfolds gradually. Step
        by step, believers grow in Christ as they choose partnership over
        divisiveness, hospitality over hostility, and long-term friendship over
        inherited prejudice.
      </>
    ),
  },
  {
    key: "toward-2033",
    label: "Toward 2033",
    body: (
      <>
        Toward 2033, OSC-HT hopes to help celebrate 2000 years of Redemption by
        fostering a blossoming culture of Christian oneness worldwide: churches
        collaborating in service, witnessing together to Christ&rsquo;s love,
        and preparing future generations to become agents of reconciliation in
        a world burdened by division. OSC&ndash;HT envisions a long-term
        journey, step by step, not a short campaign. Centuries of division
        cannot be healed by one action.
      </>
    ),
  },
];

export function Vision() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3, once: true });
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState(0);

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
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16 lg:gap-20">
          {/* RIGHT (desktop) — vision text with animated highlights */}
          <div className="relative md:order-2">
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

            {/* TOP — the strong sentence we lead with */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.9, delay: 0.15, ease: reverentEase }}
              className="font-display mt-6 text-xl leading-[1.4] text-burgundy md:text-[26px] md:leading-[1.45]"
            >
              One Step Closer &ndash; Hospitality Together envisions a
              blossoming culture of{" "}
              <Highlight inView={inView} delay={0.55}>
                Christian oneness
              </Highlight>{" "}
              (John&nbsp;17) where disciples of Jesus from{" "}
              <Highlight inView={inView} delay={0.95}>
                diverse traditions
              </Highlight>{" "}
              walk closer together through{" "}
              <Highlight inView={inView} delay={1.35}>
                hospitality, friendship, and collaborative service
              </Highlight>{" "}
              to those in need.
            </motion.p>

            {/* Toggle for the in-depth lower layer */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.7, delay: 1.7, ease: reverentEase }}
              className="mt-6"
            >
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="vision-lower-layer"
                className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-burgundy/85 underline-offset-4 transition hover:text-terracotta hover:underline"
              >
                {open ? "Show less" : "Read the fuller vision"}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: reverentEase }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </button>
            </motion.div>

            {/* LOWER LAYER — the in-depth explanation */}
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="vision-lower"
                  id="vision-lower-layer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: reverentEase }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 space-y-6">
                    {/* Chapter chips — the visitor steps through the vision */}
                    <div className="flex flex-wrap items-center gap-2">
                      {chapters.map((c, i) => {
                        const isActive = i === chapter;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setChapter(i)}
                            aria-pressed={isActive}
                            className={[
                              "rounded-full border px-4 py-1.5 text-[12px] font-medium tracking-wide transition",
                              isActive
                                ? "border-burgundy bg-burgundy text-cream shadow-[0_6px_18px_-8px_rgba(84,19,46,0.55)]"
                                : "border-burgundy/25 text-burgundy/70 hover:border-burgundy/55 hover:text-burgundy",
                            ].join(" ")}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active chapter — crossfades when switching */}
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={chapters[chapter].key}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.5, ease: reverentEase }}
                          className="font-serif text-base leading-[1.75] text-ink/85 md:text-lg"
                        >
                          {chapters[chapter].body}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Chapter progress + next */}
                    <div className="flex items-center justify-between border-t border-burgundy/10 pt-4">
                      <span className="flex items-center gap-2">
                        {chapters.map((_, i) => (
                          <span
                            key={i}
                            aria-hidden="true"
                            className={[
                              "block h-1.5 w-1.5 rotate-45 transition-colors duration-300",
                              i === chapter ? "bg-burgundy" : "bg-burgundy/20",
                            ].join(" ")}
                          />
                        ))}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setChapter((c) => (c + 1) % chapters.length)
                        }
                        className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy/85 transition hover:text-terracotta"
                      >
                        {chapter === chapters.length - 1
                          ? "Begin again"
                          : "Next"}
                        <span
                          aria-hidden="true"
                          className="transition group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

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

          {/* LEFT (desktop) — One Step Closer introduction video */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            transition={{ duration: 0.9, delay: 0.4, ease: reverentEase }}
            className="md:order-1"
          >
            <VideoPlayer
              src="/osc-vision.mp4"
              type="video/mp4"
              label="One Step Closer — the vision"
            />
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

