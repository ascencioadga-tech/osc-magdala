import { crossroads } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Medallion } from "@/components/Logo";

const embers = [
  { left: "8%",  top: "22%", size: 3, delay: 0,  dur: 15 },
  { left: "20%", top: "62%", size: 2, delay: 5,  dur: 17 },
  { left: "35%", top: "38%", size: 3, delay: 8,  dur: 16 },
  { left: "55%", top: "78%", size: 2, delay: 2,  dur: 15 },
  { left: "72%", top: "28%", size: 3, delay: 10, dur: 18 },
  { left: "88%", top: "65%", size: 2, delay: 4,  dur: 16 },
];

export function Crossroads() {
  return (
    <section
      id="crossroads"
      className="relative overflow-hidden bg-burgundy"
    >
      {/* Layered gradient depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 22% 18%, rgba(160,55,75,0.50) 0%, rgba(107,36,64,0) 60%), radial-gradient(80% 70% at 90% 90%, rgba(41,8,24,0.85) 0%, rgba(63,14,34,0) 70%), radial-gradient(60% 50% at 50% 50%, rgba(122,40,58,0.25) 0%, rgba(63,14,34,0) 70%)",
        }}
      />

      {/* Faint medallion watermark — bottom-right (desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-32 hidden opacity-[0.06] md:block"
      >
        <Medallion size={460} idPrefix="crossroads-watermark" showText="none" />
      </div>

      {/* Slow drifting gold embers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {embers.map((e, i) => (
          <span
            key={i}
            className="ember absolute rounded-full bg-gold-light/85"
            style={{
              left: e.left,
              top: e.top,
              width: e.size,
              height: e.size,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px rgba(177,146,119,0.50)",
              animationDuration: `${e.dur}s`,
              animationDelay: `${e.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12 lg:gap-16">
          {/* LEFT — video */}
          <div className="relative">
            <VideoPlayer
              src="/osc-intro.mp4"
              type="video/mp4"
              poster="/osc-intro-poster.jpg"
              label="One Step Closer intro video"
              className="rounded-xl shadow-[0_24px_60px_-25px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* RIGHT — eyebrow + headline + body */}
          <div>
            <p className="eyebrow text-gold-light">{crossroads.eyebrow}</p>
            <h2 className="font-display mt-3 text-[32px] leading-[1.05] text-cream md:text-[42px] lg:text-[46px]">
              A culture of encounter.
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-12 bg-gold/70"
            />

            <div className="mt-7 space-y-5 text-[15px] leading-[1.8] text-cream/85 md:text-base md:leading-[1.85]">
              {crossroads.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:font-serif first-letter:text-[48px] first-letter:font-medium first-letter:leading-[0.85] first-letter:mr-2 first-letter:mt-1 first-letter:float-left first-letter:text-gold-light"
                      : ""
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
