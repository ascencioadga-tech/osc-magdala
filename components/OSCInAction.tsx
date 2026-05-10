"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { inAction } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;

// Footsteps walk diagonally from upper-left to lower-right.
// Each step alternates left/right foot (mirrored via `flip`) and is canted
// in the direction of travel. Spaced wider so the bigger footprints don't
// crowd each other.
type Step = { left: string; top: string; rot: number; flip?: boolean };
const footsteps: Step[] = [
  { left: "3%",  top: "6%",  rot: 28 },
  { left: "13%", top: "18%", rot: 28, flip: true },
  { left: "24%", top: "30%", rot: 28 },
  { left: "36%", top: "42%", rot: 28, flip: true },
  { left: "49%", top: "55%", rot: 28 },
  { left: "62%", top: "68%", rot: 28, flip: true },
  { left: "76%", top: "80%", rot: 28 },
  { left: "88%", top: "90%", rot: 28, flip: true },
];

export function OSCInAction() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section
      id="in-action"
      ref={ref}
      className="relative overflow-hidden bg-cream"
    >
      {/* Diagonal walking footsteps — looping, drifts top-left → bottom-right */}
      <FootstepsTrail />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
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
          className="mt-12 md:mt-16"
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
        className="relative z-10 mt-14 md:mt-20"
      >
        <PolaroidWall images={inAction.images} />
      </motion.div>

      <div className="relative z-10 pb-20 md:pb-28" />
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
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line-soft bg-burgundy-deep shadow-[0_30px_60px_-30px_rgba(63,16,25,0.45)]">
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
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-5 w-5 border-l border-t border-gold-light/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -bottom-3 h-5 w-5 border-b border-r border-gold-light/55"
      />
    </div>
  );
}

function VideoFramePlaceholder() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-line-soft bg-burgundy-deep shadow-[0_30px_60px_-30px_rgba(63,16,25,0.45)]">
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
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 h-5 w-5 border-l border-t border-gold-light/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -bottom-3 h-5 w-5 border-b border-r border-gold-light/55"
      />
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

      <ul className="polaroid-marquee flex w-max items-center gap-6 py-8 group-hover/wall:[animation-play-state:paused] md:gap-8 md:py-12">
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
        className="p-3 pb-10 shadow-[0_18px_40px_-18px_rgba(63,16,25,0.35)] ring-1 ring-burgundy/10 transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgba(63,16,25,0.50)]"
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

function FootstepsTrail() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {footsteps.map((s, i) => (
        // Outer wrapper handles position + rotation + L/R flip (static).
        // Inner span runs the keyframe (opacity + Y translate + scale) so
        // the two transforms don't fight each other.
        <span
          key={i}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            transform: `rotate(${s.rot}deg)${s.flip ? " scaleX(-1)" : ""}`,
            transformOrigin: "center",
          }}
        >
          <span
            className="footstep-walk block"
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            <FootprintIcon />
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Realistic sandal-print impression in sand. Layers:
 *   1. Cast shadow (CSS drop-shadow on the SVG)
 *   2. Sand-pile rim — soft warm halo around the outside
 *   3. Sole depression — radial gradient (darker center → lighter rim)
 *   4. Specular sand highlight on the upper-left rim
 *   5. Scattered grain specks (dark + light mixed) clipped to the sole
 *   6. Strap grooves — dark "deeper" indentations
 *   7. Hairline rim highlights on each groove edge
 */
function FootprintIcon() {
  // Sole silhouette path used for both the depression fill and the clip.
  const sole =
    "M 30,8 C 18,8 13,16 13,28 C 13,40 17,46 18,52 C 17,60 14,68 16,74 C 19,82 25,84 30,84 C 35,84 41,82 44,74 C 46,68 43,60 42,52 C 43,46 47,40 47,28 C 47,16 42,8 30,8 Z";

  // Deterministic grain positions — keeps SSR/CSR identical, never random.
  // Each entry: [x, y, r, dark?]  — dark=true uses earth tone, false uses light catch
  const grains: [number, number, number, boolean][] = [
    [20, 26, 0.7, true], [28, 20, 0.5, true], [38, 24, 0.6, true],
    [44, 32, 0.5, true], [22, 38, 0.6, true], [32, 42, 0.7, true],
    [40, 48, 0.5, true], [24, 52, 0.6, true], [34, 60, 0.7, true],
    [40, 66, 0.5, true], [22, 68, 0.6, true], [30, 74, 0.7, true],
    [42, 74, 0.5, true], [26, 80, 0.6, true], [36, 80, 0.7, true],
    // Light grains (sand catching highlights)
    [26, 30, 0.5, false], [34, 34, 0.6, false], [42, 40, 0.5, false],
    [28, 46, 0.6, false], [36, 54, 0.5, false], [22, 60, 0.6, false],
    [38, 68, 0.5, false], [32, 76, 0.6, false], [44, 56, 0.4, false],
    [18, 44, 0.5, false],
  ];

  return (
    <svg
      width="62"
      height="88"
      viewBox="0 0 60 90"
      fill="none"
      role="presentation"
      aria-hidden="true"
      style={{
        // Cast shadow under the print + a faint highlight where the rim
        // catches the sun. Two drop-shadows stacked = realistic edge.
        filter:
          "drop-shadow(2.5px 3.5px 4px rgba(60,32,12,0.32)) drop-shadow(0 0.5px 0 rgba(255,238,205,0.40))",
      }}
    >
      <defs>
        {/* Depression: dark center fading to the warmer rim color */}
        <radialGradient id="fp-depression" cx="0.5" cy="0.45" r="0.62">
          <stop offset="0%" stopColor="#4a3825" />
          <stop offset="35%" stopColor="#6a5238" />
          <stop offset="80%" stopColor="#9a7c5a" />
          <stop offset="100%" stopColor="#b39472" />
        </radialGradient>
        {/* Top-left specular highlight — sand catching sunlight on rim */}
        <radialGradient id="fp-rim-light" cx="0.35" cy="0.25" r="0.55">
          <stop offset="65%" stopColor="#fde8c4" stopOpacity="0" />
          <stop offset="88%" stopColor="#fde8c4" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#fde8c4" stopOpacity="0" />
        </radialGradient>
        <clipPath id="fp-clip">
          <path d={sole} />
        </clipPath>
      </defs>

      {/* Sand-pile rim — warm halo just outside the print, like the sand
          that got pushed up when the foot pressed down. */}
      <ellipse cx="30" cy="46" rx="26" ry="40" fill="#c8a472" opacity="0.20" />

      {/* The depression itself */}
      <path d={sole} fill="url(#fp-depression)" />

      {/* Specular rim highlight — clipped so it only shows on the print's
          upper-left edge */}
      <g clipPath="url(#fp-clip)">
        <rect x="0" y="0" width="60" height="90" fill="url(#fp-rim-light)" />
      </g>

      {/* Sand grains scattered inside the depression */}
      <g clipPath="url(#fp-clip)">
        {grains.map(([x, y, r, dark], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={dark ? "#2a1a0a" : "#fde8c4"}
            opacity={dark ? 0.4 + (i % 3) * 0.05 : 0.35 + (i % 3) * 0.05}
          />
        ))}
      </g>

      {/* Birkenstock-style strap grooves — two wide horizontal bands
          across the foot, each with a buckle on the outer edge. The
          grooves read as DEEPER than the sole depression because the
          strap pressed in harder along its width. */}
      <g clipPath="url(#fp-clip)">
        {/* FRONT strap — wider band over the ball of the foot */}
        <rect
          x="11"
          y="28"
          width="38"
          height="10"
          rx="2.2"
          fill="#2a1808"
          opacity="0.92"
        />
        {/* Subtle inner shading on front strap to suggest leather grain */}
        <rect
          x="11"
          y="32"
          width="38"
          height="2"
          rx="1"
          fill="#1a0e02"
          opacity="0.4"
        />

        {/* BACK strap — second band over the instep, slightly narrower */}
        <rect
          x="11"
          y="46"
          width="38"
          height="9.5"
          rx="2.2"
          fill="#2a1808"
          opacity="0.92"
        />
        <rect
          x="11"
          y="49.5"
          width="38"
          height="2"
          rx="1"
          fill="#1a0e02"
          opacity="0.4"
        />

        {/* Hairline cream rim highlights along the top edges — the lit lip
            of each groove, like the sand-rim of the sole depression. */}
        <path
          d="M 11,28 L 49,28"
          stroke="#e8cc9a"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.55"
          transform="translate(0, -0.6)"
        />
        <path
          d="M 11,46 L 49,46"
          stroke="#e8cc9a"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.55"
          transform="translate(0, -0.6)"
        />
      </g>

      {/* Buckles — sit ON TOP of each strap on the outer (right) edge.
          Drawn outside the clip so the metal can catch the light from the
          edge a touch beyond the sole. */}
      {/* Front buckle */}
      <g transform="translate(40, 29)">
        <rect
          x="0"
          y="0"
          width="7"
          height="8"
          rx="1.2"
          fill="#5a4530"
          stroke="#1a0e02"
          strokeWidth="0.5"
        />
        {/* Buckle prong slot */}
        <line
          x1="2"
          y1="4"
          x2="6.5"
          y2="4"
          stroke="#1a0e02"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Tiny metal catchlight */}
        <line
          x1="0.6"
          y1="0.8"
          x2="6.4"
          y2="0.8"
          stroke="#e8cc9a"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Back buckle */}
      <g transform="translate(40, 47)">
        <rect
          x="0"
          y="0"
          width="7"
          height="7.5"
          rx="1.2"
          fill="#5a4530"
          stroke="#1a0e02"
          strokeWidth="0.5"
        />
        <line
          x1="2"
          y1="3.7"
          x2="6.5"
          y2="3.7"
          stroke="#1a0e02"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <line
          x1="0.6"
          y1="0.8"
          x2="6.4"
          y2="0.8"
          stroke="#e8cc9a"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}
