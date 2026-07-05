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
  // First-play smoothing: the poster cross-fades into the footage and the
  // audio ramps up from silence, so the video never starts abruptly.
  const [started, setStarted] = useState(false);
  const [veilDone, setVeilDone] = useState(false);
  const rampRaf = useRef<number | null>(null);
  const hasRampedRef = useRef(false);

  const rampVolume = (v: HTMLVideoElement) => {
    if (hasRampedRef.current) return;
    hasRampedRef.current = true;
    const DURATION = 2200;
    const t0 = performance.now();
    v.volume = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / DURATION);
      v.volume = 1 - (1 - k) * (1 - k); // ease-out
      rampRaf.current = k < 1 ? requestAnimationFrame(step) : null;
    };
    rampRaf.current = requestAnimationFrame(step);
  };

  const cancelRamp = (v: HTMLVideoElement | null) => {
    if (rampRaf.current !== null) {
      cancelAnimationFrame(rampRaf.current);
      rampRaf.current = null;
      if (v) v.volume = 1;
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onLoadedMetadata = () => setDuration(v.duration || 0);
    const onDurationChange = () => setDuration(v.duration || 0);
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
    };
    const onPause = () => {
      setPlaying(false);
      // If paused mid-ramp, settle the volume so later plays are full.
      cancelRamp(v);
    };
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
      if (rampRaf.current !== null) cancelAnimationFrame(rampRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Ease the audio in on the very first play.
      rampVolume(v);
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
        "group relative overflow-hidden rounded-xl bg-[#16090f] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.55)]",
        // Hold the 16:9 ratio normally, but go full-window in fullscreen
        fullscreen ? "h-screen w-screen rounded-none" : "aspect-video",
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

      {/* Poster cross-fade — the still dissolves into the moving footage on
          first play instead of snapping to it. */}
      <AnimatePresence>
        {poster && !started ? (
          <motion.img
            key="poster-still"
            src={poster}
            alt=""
            aria-hidden="true"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.8, 0.32, 1] }}
            className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] object-cover"
          />
        ) : null}
      </AnimatePresence>

      {/* First-play veil — the frame starts dimmed and the light lifts over
          ~1.6s, like house lights coming up. This is the part of the smooth
          intro the eye actually feels (the poster is a frame of the footage,
          so a poster crossfade alone reads as nothing). */}
      {started && !veilDone ? (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 0.8, 0.32, 1] }}
          onAnimationComplete={() => setVeilDone(true)}
          className="pointer-events-none absolute inset-0 bg-[#16090f]"
        />
      ) : null}

      {/* Liquid-glass edge — a single hairline inset ring, like screen glass */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/12"
      />

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
            className="absolute inset-0 grid place-items-center focus:outline-none"
            aria-label="Play video"
          >
            {/* Quiet vignette for contrast — no blur, no heavy wash */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/15"
            />
            <motion.span
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 0.8, 0.32, 1] }}
              className="relative grid h-16 w-16 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/20 md:h-[72px] md:w-[72px]"
              style={{ boxShadow: "0 10px 36px rgba(0,0,0,0.35)" }}
            >
              <PlayIcon className="ml-[2px] h-5 w-5 text-white/95 md:h-6 md:w-6" />
            </motion.span>
          </motion.button>
        ) : null}
      </AnimatePresence>

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
        <div className="bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-3.5 pt-9 md:px-5 md:pb-4 md:pt-12">
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
            {/* Track — hairline that thickens slightly on hover */}
            <div className="relative h-[3px] rounded-full bg-white/20 transition-[height] group-hover/seek:h-[5px]">
              {/* Buffered indicator */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                style={{ width: `${buffered}%` }}
              />
              {/* Played indicator */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/90"
                style={{ width: `${progress}%` }}
              />
              {/* Scrub handle — small white dot */}
              <div
                className={[
                  "absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-opacity",
                  scrubbing
                    ? "opacity-100"
                    : "opacity-0 group-hover/seek:opacity-100",
                ].join(" ")}
                style={{ left: `calc(${progress}% - 5px)` }}
              />
            </div>
          </div>

          {/* Buttons row — small, thin, quiet */}
          <div className="mt-1.5 flex items-center justify-between text-white/85">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => { stop(e); togglePlay(); }}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10 hover:text-white"
              >
                {playing ? <PauseIcon /> : <PlayIcon className="ml-[2px]" />}
              </button>
              <span className="text-[11px] tabular-nums tracking-[0.06em] text-white/65">
                {fmt(currentTime)} <span className="text-white/35">/</span>{" "}
                {fmt(duration)}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={(e) => { stop(e); toggleMute(); }}
                aria-label={muted ? "Unmute" : "Mute"}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10 hover:text-white"
              >
                {muted ? <MutedIcon /> : <UnmutedIcon />}
              </button>
              <button
                type="button"
                onClick={(e) => { stop(e); toggleFullscreen(); }}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10 hover:text-white"
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
      className="h-[18px] w-[18px]"
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <polyline points="9 4 9 9 4 9" />
      <polyline points="15 4 15 9 20 9" />
      <polyline points="9 20 9 15 4 15" />
      <polyline points="15 20 15 15 20 15" />
    </svg>
  );
}
