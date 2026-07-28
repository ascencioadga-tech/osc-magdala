"use client";

import { motion } from "framer-motion";

/*
  CrossPulse — the signature mark.

  A thin Latin cross that breathes: it swells and contracts on a slow loop,
  the way the amber dot used to. It appears wherever the site has a pulse —
  the footer's Sunday line, the hero's watch link, the service invite, and
  the workspace's care panels — so one motif carries across public site and
  staff tools alike.

  `live` speeds the rhythm and deepens the colour, for when a service is
  actually underway.
*/

export default function CrossPulse({
  size = 13,
  live = false,
  className = "",
}: {
  size?: number;
  live?: boolean;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.28 }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.7, 1, 0.7] }}
      transition={{
        duration: live ? 1.5 : 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 12 16"
        fill="none"
        width={size}
        height={size * 1.28}
        style={{ display: "block" }}
      >
        {/* upright */}
        <path
          d="M6 0.6V15.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {/* crossbar, set high the way a Latin cross sits */}
        <path
          d="M1.1 5.1H10.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  );
}
