"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { inAction } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

export function OSCInAction() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section
      id="in-action"
      ref={ref}
      className="relative overflow-hidden bg-cream"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: reverentEase }}
          className="eyebrow text-terracotta"
        >
          ONE STEP CLOSER IN ACTION
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
          className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] text-burgundy md:text-[52px]"
        >
          {inAction.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: reverentEase }}
          className="font-serif mt-5 max-w-xl text-lg italic leading-snug text-ink/75 md:text-xl"
        >
          {inAction.intro}
        </motion.p>

        {/* Cinematic video hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.35, ease: reverentEase }}
          className="mt-8 md:mt-10"
        >
          <div className="mx-auto max-w-5xl">
            {inAction.youtube ? (
              <YouTubeFrame url={inAction.youtube} />
            ) : inAction.video ? (
              <VideoPlayer
                src={inAction.video}
                type={
                  inAction.video.endsWith(".mov")
                    ? "video/quicktime"
                    : "video/mp4"
                }
                fallbackSrc={inAction.video}
                fallbackType="video/mp4"
                label="One Step Closer in Action — progress video"
              />
            ) : (
              <VideoFramePlaceholder />
            )}
          </div>
        </motion.div>
      </div>

      {/* Polaroid wall — full bleed, runs edge-to-edge across the section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6, ease: reverentEase }}
        className="relative z-10 mt-10 md:mt-12"
      >
        <PolaroidWall images={inAction.images} />
      </motion.div>

      <div className="relative z-10 pb-12 md:pb-16" />
    </section>
  );
}

/** Extract a YouTube video ID from a URL or pass-through if already an ID. */
function youtubeId(input: string): string | null {
  if (!input) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  const short = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const long = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (long) return long[1];
  const embed = input.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return null;
}

function YouTubeFrame({ url }: { url: string }) {
  const id = youtubeId(url);
  if (!id) return <VideoFramePlaceholder />;

  // youtube-nocookie + modestbranding + rel=0 keeps the player feeling
  // hosted-by-OSC rather than a heavy external embed.
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#16090f] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/10">
        <iframe
          src={src}
          title="One Step Closer in Action — progress video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {/* Editorial corner ornaments — match the rest of the brand */}
    </div>
  );
}

function VideoFramePlaceholder() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[#16090f] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/10">
      <div className="grid h-full w-full place-items-center">
        <div className="text-center">
          <span aria-hidden="true" className="text-3xl text-gold-light/85">
            ✦
          </span>
          <p className="eyebrow mt-3 text-cream/65">
            Video · coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Polaroid wall — a full-bleed horizontal strip of photos styled as
 * physical polaroids. Auto-scrolls slowly left, pauses on hover, with
 * fade gradients on the edges so photos materialize as they enter view.
 * Each polaroid has a slight rotation and varied size for a hand-pinned
 * scrapbook feel.
 */
function PolaroidWall({
  images,
}: {
  images: { src: string; alt?: string; caption?: string }[];
}) {
  if (!images.length) return null;

  // Duplicate the array so the marquee animation has a seamless loop —
  // when the first set scrolls off, the second is already in place.
  const reel = [...images, ...images];

  return (
    <div className="group/wall relative overflow-hidden">
      {/* Edge fades — photos enter / exit through a soft cream gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent md:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent md:w-40"
      />

      <ul className="polaroid-marquee flex w-max items-center gap-6 py-6 group-hover/wall:[animation-play-state:paused] md:gap-8 md:py-8">
        {reel.map((img, i) => {
          const idx = i % images.length;
          return (
            <PolaroidCard
              key={`${img.src}-${i}`}
              src={img.src}
              alt={img.alt ?? ""}
              caption={img.caption ?? "Washington D.C. Event"}
              index={idx}
            />
          );
        })}
      </ul>
    </div>
  );
}

function PolaroidCard({
  src,
  alt,
  caption,
  index,
}: {
  src: string;
  alt: string;
  caption: string;
  index: number;
}) {
  // Deterministic-but-varied per-card properties so the wall feels
  // intentionally hand-curated (not random across SSR/CSR).
  const rotations = [-3.5, 2.2, -1.6, 3.8, -2.4, 1.2, -3, 2.8, -1.2, 3.2];
  // Bumped slightly so the now-square images get more visual weight.
  const widths = [280, 300, 270, 310, 280, 290, 320, 270, 300, 285];
  const yOffsets = [-6, 4, -2, 8, 0, -4, 6, -8, 2, -3];
  // Every polaroid is square so the photos read at full strength —
  // no awkward portrait/landscape crops.
  const aspectRatios = Array(10).fill("aspect-[1/1]");

  const rot = rotations[index % rotations.length];
  const w = widths[index % widths.length];
  const y = yOffsets[index % yOffsets.length];
  const ratio = aspectRatios[index % aspectRatios.length];

  return (
    <li
      className="shrink-0 transition-transform duration-300 ease-out hover:!translate-y-[-12px] hover:!rotate-0"
      style={{
        transform: `rotate(${rot}deg) translateY(${y}px)`,
      }}
    >
      <figure
        className="p-3 pb-10 shadow-[0_18px_40px_-18px_rgba(63,14,34,0.35)] ring-1 ring-burgundy/10 transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgba(63,14,34,0.50)]"
        style={{ width: w, backgroundColor: "#fffdf6" }}
      >
        <div
          className={[
            "relative overflow-hidden bg-parchment",
            ratio,
          ].join(" ")}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`${w}px`}
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-burgundy/55">
          {caption}
        </figcaption>
      </figure>
    </li>
  );
}

function ImagePlaceholder({ index }: { index: number }) {
  // Subtle gradient variations so the four placeholders don't look identical.
  const gradients = [
    "from-sand via-parchment to-gold-light/40",
    "from-parchment via-sand to-terracotta/30",
    "from-cream via-sand to-burgundy/15",
    "from-cream via-parchment to-gold-light/35",
  ];
  return (
    <div
      className={[
        "grid h-full w-full place-items-center bg-gradient-to-br",
        gradients[(index - 1) % gradients.length],
      ].join(" ")}
    >
      <span className="eyebrow text-[10px] text-burgundy/55">
        Photo · {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}
