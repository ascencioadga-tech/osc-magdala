// Quiet visual separator between major sections.
// Two thin gold rules flanking a centered ✦ ornament — on-brand seal cue.

export function SectionDivider({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "burgundy";
}) {
  const lineColor =
    variant === "burgundy" ? "bg-cream/30" : "bg-burgundy/25";
  const ornamentColor =
    variant === "burgundy" ? "text-gold-light" : "text-gold";
  const wrapperBg =
    variant === "burgundy" ? "" : "bg-cream";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={[wrapperBg, className].join(" ")}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-5 md:py-7">
        <span className={`block h-px flex-1 ${lineColor}`} />
        <span
          className={`font-display text-2xl leading-none ${ornamentColor}`}
        >
          ✦
        </span>
        <span className={`block h-px flex-1 ${lineColor}`} />
      </div>
    </div>
  );
}
