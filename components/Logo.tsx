// One Step Closer medallion — sourced from public/osc-medallion.svg
// (the official artwork copied from osc-website).

const C = {
  burgundy: "#6A2045",
};

type MedallionProps = {
  size?: number;
  /** Kept for backward compatibility; currently unused. */
  title?: string;
  subtitle?: string;
  /** Kept for backward compatibility; currently unused. */
  idPrefix?: string;
  className?: string;
  /** Kept for backward compatibility; currently unused. */
  showText?: "auto" | "always" | "none";
};

export function Medallion({
  size = 96,
  className,
}: MedallionProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/osc-medallion.svg"
      alt="One Step Closer — Hospitality Together"
      width={size}
      height={size}
      className={className}
      // Hold dimensions inside flex containers — without this, SVG-as-image
      // can be squished horizontally by flex-shrink and clip into an oval.
      style={{ flexShrink: 0, minWidth: size, minHeight: size, display: "block" }}
    />
  );
}

/** Decorative Greek-key band — full-width strip used as a section divider. */
export function GreekKeyBand({
  color = C.burgundy,
  background = "transparent",
  height = 28,
  count = 60,
  className,
}: {
  color?: string;
  background?: string;
  height?: number;
  count?: number;
  className?: string;
}) {
  const w = 1200 / count;
  const h = height;
  const m = w * 0.08;
  const inner = h * 0.55;
  const unit = `
    M ${-w / 2 + m} ${-h / 2}
    L ${w / 2 - m} ${-h / 2}
    M ${-w / 2 + m} ${h / 2}
    L ${w / 2 - m} ${h / 2}
    M ${-w / 2 + m + w * 0.18} ${-h / 2}
    L ${-w / 2 + m + w * 0.18} ${h / 2 - inner * 0.45}
    L ${w / 2 - m - w * 0.18} ${h / 2 - inner * 0.45}
    L ${w / 2 - m - w * 0.18} ${-h / 2 + inner * 0.45}
    L ${-w / 2 + m + w * 0.36} ${-h / 2 + inner * 0.45}
    L ${-w / 2 + m + w * 0.36} ${h / 2 - inner * 0.18}
  `;
  return (
    <svg
      viewBox={`0 0 1200 ${height + 4}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      width="100%"
      height={height + 4}
      role="presentation"
      aria-hidden="true"
      style={{ background, display: "block" }}
    >
      <line
        x1={0}
        y1={2}
        x2={1200}
        y2={2}
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <line
        x1={0}
        y1={height + 2}
        x2={1200}
        y2={height + 2}
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      {Array.from({ length: count }).map((_, i) => (
        <g
          key={i}
          transform={`translate(${i * w + w / 2} ${height / 2 + 2})`}
        >
          <path
            d={unit}
            stroke={color}
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </g>
      ))}
    </svg>
  );
}
