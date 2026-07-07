import { crossroads } from "@/lib/content";
import { VideoPlayer } from "@/components/VideoPlayer";

const embers = [
  { left: "6%",  top: "20%", size: 3, delay: 0,  dur: 15, dx: 14,  rise: 380, op: 0.85, spark: true  },
  { left: "13%", top: "78%", size: 2, delay: 6,  dur: 19, dx: -10, rise: 320, op: 0.7,  spark: false },
  { left: "20%", top: "62%", size: 2, delay: 5,  dur: 17, dx: 8,   rise: 300, op: 0.75, spark: false },
  { left: "27%", top: "34%", size: 4, delay: 11, dur: 21, dx: 20,  rise: 420, op: 0.9,  spark: true  },
  { left: "35%", top: "50%", size: 3, delay: 8,  dur: 16, dx: -14, rise: 360, op: 0.8,  spark: false },
  { left: "42%", top: "82%", size: 2, delay: 3,  dur: 18, dx: 10,  rise: 340, op: 0.7,  spark: false },
  { left: "50%", top: "28%", size: 3, delay: 13, dur: 20, dx: -8,  rise: 400, op: 0.85, spark: false },
  { left: "56%", top: "70%", size: 2, delay: 2,  dur: 15, dx: 16,  rise: 320, op: 0.72, spark: true  },
  { left: "63%", top: "44%", size: 3, delay: 9,  dur: 17, dx: -18, rise: 380, op: 0.82, spark: false },
  { left: "70%", top: "24%", size: 4, delay: 7,  dur: 22, dx: 12,  rise: 440, op: 0.9,  spark: true  },
  { left: "76%", top: "66%", size: 2, delay: 14, dur: 18, dx: -12, rise: 300, op: 0.7,  spark: false },
  { left: "83%", top: "40%", size: 3, delay: 4,  dur: 16, dx: 18,  rise: 360, op: 0.8,  spark: false },
  { left: "89%", top: "74%", size: 2, delay: 10, dur: 19, dx: -6,  rise: 320, op: 0.72, spark: false },
  { left: "94%", top: "32%", size: 3, delay: 1,  dur: 20, dx: 10,  rise: 400, op: 0.85, spark: true  },
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

      {/* Living glow — two large soft lights that slowly drift & breathe */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="crossroads-glow absolute -left-[10%] top-[8%] h-[70%] w-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(178,62,86,0.55) 0%, rgba(122,40,58,0.18) 42%, rgba(63,14,34,0) 72%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="crossroads-glow-alt absolute -right-[8%] bottom-[4%] h-[65%] w-[55%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(177,146,119,0.28) 0%, rgba(138,103,70,0.12) 45%, rgba(63,14,34,0) 72%)",
            filter: "blur(36px)",
          }}
        />
      </div>

      {/* Slow drifting gold embers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {embers.map((e, i) => (
          <span
            key={i}
            className={`${e.spark ? "ember-spark" : "ember"} absolute rounded-full bg-gold-light/85`}
            style={{
              left: e.left,
              top: e.top,
              width: e.size,
              height: e.size,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px rgba(177,146,119,0.50)",
              animationDuration: `${e.dur}s`,
              animationDelay: `${e.delay}s`,
              ["--dx" as string]: `${e.dx}px`,
              ["--rise" as string]: `${e.rise}px`,
              ["--ember-opacity" as string]: `${e.op}`,
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
