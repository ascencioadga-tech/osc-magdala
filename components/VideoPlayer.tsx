"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type VideoPlayerProps = {
  src: string;
  type?: string;
  /** Optional second source path (e.g. fallback MP4). */
  fallbackSrc?: string;
  fallbackType?: string;
  poster?: string;
  label?: string;
  className?: string;
};

export function VideoPlayer({
  src,
  type = "video/mp4",
  fallbackSrc,
  fallbackType,
  poster,
  label = "Video player",
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  // Default to unmuted so the first click plays both video and audio.
  const [muted, setMuted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0); // 0–100 %
  const [fullscreen, setFullscreen] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onLoadedMetadata = () => setDuration(v.duration || 0);
    const onDurationChange = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolumeChange = () => setMuted(v.muted);
    const onProgress = () => {
      if (!v.duration || !v.buffered.length) return;
      const end = v.buffered.end(v.buffered.length - 1);
      setBuffered(Math.min(100, (end / v.duration) * 100));
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("durationchange", onDurationChange);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVolumeChange);
    v.addEventListener("progress", onProgress);

    // Pick up duration if metadata was loaded before listeners attached.
    if (
      v.readyState >= 1 &&
      Number.isFinite(v.duration) &&
      v.duration > 0
    ) {
      setDuration(v.duration);
    } else if (v.readyState === 0) {
      // Some browsers ignore preload="metadata" until told to load — nudge
      // it so the duration appears without waiting for the visitor's click.
      try {
        v.load();
      } catch {
        /* ignore */
      }
    }

    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("durationchange", onDurationChange);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVolumeChange);
      v.removeEventListener("progress", onProgress);
    };
  }, []);

  // Fullscreen state — track both standard and webkit-prefixed APIs (Safari)
  useEffect(() => {
    const onFsChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      setFullscreen(
        !!document.fullscreenElement || !!doc.webkitFullscreenElement,
      );
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {
          // Some browsers (and embedded preview iframes) block unmuted
          // autoplay even after a click. Retry muted so the visitor's tap
          // is never a dead-end; they can unmute from the controls.
          v.muted = true;
          v.play().catch(() => {
            /* genuinely unplayable — leave the overlay in place */
          });
        });
      }
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  const seekAt = (clientX: number, rect: DOMRect) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const ratio = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    v.currentTime = ratio * duration;
  };

  const seekRef = useRef<HTMLDivElement>(null);

  const onSeekPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const el = seekRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    setScrubbing(true);
    seekAt(e.clientX, el.getBoundingClientRect());
  };
  const onSeekPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    e.stopPropagation();
    const el = seekRef.current;
    if (!el) return;
    seekAt(e.clientX, el.getBoundingClientRect());
  };
  const onSeekPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const el = seekRef.current;
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    setScrubbing(false);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current as
      | (HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void> | void;
        })
      | null;
    const v = videoRef.current as
      | (HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        })
      | null;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    if (!el) return;

    const isFs = !!document.fullscreenElement || !!doc.webkitFullscreenElement;

    try {
      if (isFs) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (v?.webkitEnterFullscreen) {
        // iOS Safari: only the <video> element supports fullscreen
        v.webkitEnterFullscreen();
      }
    } catch {
      // Silently ignore — some browsers reject fullscreen requests outside
      // direct user gestures or with permission errors.
    }
  };

  const fmt = (t: number) => {
    if (!isFinite(t) || t < 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showOverlay = !playing;
  // Always keep controls visible while scrubbing so the pointer doesn't lose
  // the bar if the user drags slightly outside the controls region.
  const showControls = hovered || !playing || scrubbing;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      ref={containerRef}
      className={[
        "group relative overflow-hidden rounded-xl border border-cream/15 bg-burgundy-deep shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]",
        // Hold the 16:9 ratio normally, but go full-window in fullscreen
        fullscreen
          ? "h-screen w-screen rounded-none border-0"
          : "aspect-video",
        className,
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* No autoPlay — the visitor's click on the play overlay is what
          starts the video, and (since `muted` is bound to state and defaults
          to false) plays audio along with it. */}
      <video
        ref={videoRef}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        poster={poster}
        className="h-full w-full cursor-pointer object-cover"
        aria-label={label}
        onClick={togglePlay}
      >
        <source src={src} type={type} />
        {fallbackSrc ? (
          <source src={fallbackSrc} type={fallbackType ?? "video/mp4"} />
        ) : null}
      </video>

      {/* Big centered play overlay when paused */}
      <AnimatePresence>
        {showOverlay ? (
          <motion.button
            key="overlay"
            type="button"
            onClick={togglePlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center bg-burgundy-ink/35 backdrop-blur-[1.5px] focus:outline-none"
            aria-label={
              duration > 0 ? `Play video (${fmt(duration)})` : "Play video"
            }
          >
            <div className="flex flex-col items-center gap-3">
              <motion.span
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 0.8, 0.32, 1] }}
                className="grid h-16 w-16 place-items-center rounded-full bg-cream text-burgundy shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-gold-light/50 transition-transform group-hover:scale-105 md:h-20 md:w-20"
              >
                <PlayIcon className="ml-[2px] h-7 w-7 md:h-8 md:w-8" />
              </motion.span>
              {duration > 0 ? (
                <span
                  className="eyebrow text-[10px] text-cream/90"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
                >
                  {fmt(duration)}
                </span>
              ) : null}
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Top-left label strip — visible alongside the controls */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -6 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-x-0 top-0"
      >
        <div className="bg-gradient-to-b from-burgundy-ink/70 via-burgundy-ink/15 to-transparent px-4 pb-12 pt-3 md:px-6 md:pb-14 md:pt-4">
          <div className="flex items-center gap-2 text-cream/90">
            <span aria-hidden="true" className="block h-px w-6 bg-gold-light" />
            <span className="text-[10px] uppercase tracking-[0.28em] md:text-[11px]">
              {label}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom controls bar */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 6 }}
        transition={{ duration: 0.25 }}
        className={[
          "absolute inset-x-0 bottom-0",
          showControls ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        onClick={stop}
      >
        <div className="bg-gradient-to-t from-burgundy-ink/85 via-burgundy-ink/45 to-transparent px-4 pb-4 pt-10 md:px-6 md:pb-5 md:pt-14">
          {/* Seek hit zone — generous vertical padding so the bar is easy
              to click; pointer-capture handles drag-to-scrub. */}
          <div
            ref={seekRef}
            className="group/seek relative cursor-pointer py-2.5 select-none"
            onPointerDown={onSeekPointerDown}
            onPointerMove={onSeekPointerMove}
            onPointerUp={onSeekPointerUp}
            onPointerCancel={onSeekPointerUp}
            onClick={stop}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Track */}
            <div className="relative h-1.5 rounded-full bg-cream/20 transition-[height] group-hover/seek:h-2">
              {/* Buffered indicator */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-cream/30"
                style={{ width: `${buffered}%` }}
              />
              {/* Played indicator */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gold-light"
                style={{ width: `${progress}%` }}
              />
              {/* Scrub handle */}
              <div
                className={[
                  "absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-cream shadow-[0_2px_6px_rgba(0,0,0,0.45)] ring-2 ring-burgundy-deep/55 transition-opacity",
                  scrubbing
                    ? "opacity-100"
                    : "opacity-0 group-hover/seek:opacity-100",
                ].join(" ")}
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>
          </div>

          {/* Buttons row */}
          <div className="mt-2 flex items-center justify-between text-cream">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { stop(e); togglePlay(); }}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-cream/15"
              >
                {playing ? <PauseIcon /> : <PlayIcon className="ml-[2px]" />}
              </button>
              <span className="font-mono text-[11px] tabular-nums text-cream/80 md:text-xs">
                {fmt(currentTime)} <span className="text-cream/40">/</span>{" "}
                {fmt(duration)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { stop(e); toggleMute(); }}
                aria-label={muted ? "Unmute" : "Mute"}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-cream/15"
              >
                {muted ? <MutedIcon /> : <UnmutedIcon />}
              </button>
              <button
                type="button"
                onClick={(e) => { stop(e); toggleFullscreen(); }}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-cream/15"
              >
                {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={["h-5 w-5", className].join(" ")}
    >
      <path d="M7 4.5v15a.75.75 0 0 0 1.16.62l11.5-7.5a.75.75 0 0 0 0-1.24l-11.5-7.5A.75.75 0 0 0 7 4.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect x="6" y="4.5" width="4" height="15" rx="1" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <line x1="16" y1="9" x2="22" y2="15" />
      <line x1="22" y1="9" x2="16" y2="15" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <polyline points="4 9 4 4 9 4" />
      <polyline points="20 9 20 4 15 4" />
      <polyline points="4 15 4 20 9 20" />
      <polyline points="20 15 20 20 15 20" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <polyline points="9 4 9 9 4 9" />
      <polyline points="15 4 15 9 20 9" />
      <polyline points="9 20 9 15 4 15" />
      <polyline points="15 20 15 15 20 15" />
    </svg>
  );
}
