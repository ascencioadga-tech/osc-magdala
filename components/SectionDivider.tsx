// Section separator — a small hand-set mosaic run (tesserae) between two
// tapering rules. Echoes the 1.5-million-stone Magdala Mosaic rather than a
// generic line-and-diamond, so the separation reads as ours.

// Graduated run: seven square tiles, largest at center, each nudged to its
// own angle like real hand-laid stone. Deterministic → no hydration drift.
const TILES = [
  { x: -27, s: 4.4, r: -16 },
  { x: -18, s: 5.4, r: 11 },
  { x: -9, s: 6.4, r: -7 },
  { x: 0, s: 7.6, r: 6 },
  { x: 9, s: 6.4, r: 13 },
  { x: 18, s: 5.4, r: -11 },
  { x: 27, s: 4.4, r: 15 },
];

export function SectionDivider({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "burgundy";
}) {
  const dark = variant === "burgundy";
  const rule = dark ? "to-cream/35" : "to-burgundy/25";
  const wrapperBg = dark ? "" : "bg-cream";
  // Tessera fills — wine / sienna / deep-wine on cream; warm creams on dark.
  const fills = dark
    ? ["#e9dec6", "#b19277", "#f0efec", "#b19277", "#f0efec", "#b19277", "#e9dec6"]
    : ["#54132e", "#633511", "#3f0e22", "#54132e", "#3f0e22", "#633511", "#54132e"];

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={[wrapperBg, className].join(" ")}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-5 px-6 py-6 md:py-9">
        <span
          className={`block h-px flex-1 bg-gradient-to-r from-transparent ${rule}`}
        />
        <svg
          viewBox="-38 -12 76 24"
          className="h-4 w-[76px] shrink-0 overflow-visible"
          role="presentation"
        >
          {TILES.map((t, i) => (
            <rect
              key={i}
              x={t.x - t.s / 2}
              y={-t.s / 2}
              width={t.s}
              height={t.s}
              rx="0.6"
              fill={fills[i]}
              opacity={0.55 + (3 - Math.abs(i - 3)) * 0.13}
              transform={`rotate(${t.r} ${t.x} 0)`}
            />
          ))}
        </svg>
        <span
          className={`block h-px flex-1 bg-gradient-to-l from-transparent ${rule}`}
        />
      </div>
    </div>
  );
}
