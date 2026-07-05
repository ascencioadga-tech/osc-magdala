"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;
const CONTACT = "mailto:development@onestepcloser.org";

// A content block is a paragraph, a scripture pull-quote, or a soft
// "aside" callout (a personalization invitation).
type Block =
  | { p: string }
  | { scripture: string }
  | { aside: { heading: string; p: string } };

type Page = { label: string; blocks: Block[] };

type Level = {
  title: string;
  audience: string;
  subtitle: string;
  ctaLabel: string;
  pages: Page[];
};

const levels: Level[] = [
  {
    title: "Christian Tradition",
    audience: "For traditions & confessions",
    subtitle: "The Oneness Stone *",
    ctaLabel: "Enquire",
    pages: [
      {
        label: "Why we build",
        blocks: [
          {
            p: "In response to Jesus’ prayer “that they may all be one” (John 17:20–23), Christians from many traditions are choosing to build together.",
          },
          {
            p: "We do not minimize our real and sometimes significant differences. Yet in Christ, we can still take concrete steps together — building a lasting witness at Magdala that proclaims our shared desire to answer Jesus’ prayer and to serve, bless, and walk closer.",
          },
        ],
      },
      {
        label: "A public sign",
        blocks: [
          {
            p: "The Restaurant Built Together highlights Jesus’ prayer at the Last Supper. It stands as a public sign that Orthodox, Presbyterians, Methodists, Lutherans, Evangelicals, Armenians, Copts, Anglicans, Baptists, Pentecostals, Catholics, and many others can join in a visible act of collaboration.",
          },
          {
            scripture:
              "“By this everyone will know that you are my disciples, if you love one another.” — John 13:35",
          },
        ],
      },
      {
        label: "Your tradition’s place",
        blocks: [
          {
            p: "A leadership gift at this level gives visible expression to your Christian tradition’s participation on the Oneness Stone, alongside the names of the traditions and confessions represented in this shared effort.",
          },
          {
            p: "Visitors will pause and ask: <em>Did Christians from all these traditions really build this together? Why? How?</em> They will be led back to John 17 — Jesus prayed for our oneness, and we are responding.",
          },
        ],
      },
    ],
  },
  {
    title: "Local Church",
    audience: "For churches & communities",
    subtitle: "A Galilee witness carried home",
    ctaLabel: "Enquire",
    pages: [
      {
        label: "Your church at Galilee",
        blocks: [
          {
            p: "Your local church can become part of the visible response to Jesus’ prayer “that they may all be one” (John 17:20–23).",
          },
          {
            p: "By helping build the Restaurant Built Together at Magdala, your faith community places a concrete sign of its faith on the shores of the Sea of Galilee. Pilgrims will see that your church did not merely speak about Christian oneness — it helped build a public witness to it.",
          },
        ],
      },
      {
        label: "Carried home",
        blocks: [
          {
            p: "Rooted anew in Galilee, your church is invited to carry the same One Step Closer spirit home: serving locally, blessing neighboring churches, and helping your region discover new possibilities of friendship and collaboration in Christ — a real contribution to overcoming damaging divisiveness.",
          },
          {
            scripture:
              "“Go into all the world and proclaim the Gospel.” — cf. Mark 16:15",
          },
        ],
      },
      {
        label: "A seed of renewal",
        blocks: [
          {
            p: "What begins in Galilee is meant to go worldwide. Your church’s participation at Magdala can become a seed of John 17 renewal in your own community.",
          },
          {
            aside: {
              heading: "Make this witness more personal",
              p: "Some churches may wish to shape their recognition around a founding story, mission emphasis, pastoral anniversary, pilgrimage, or local service initiative. The Magdala Development team would be glad to explore a personalized path that honors your church’s identity while keeping the focus on Jesus’ prayer for oneness.",
            },
          },
        ],
      },
    ],
  },
  {
    title: "Family Legacy",
    audience: "For families & households",
    subtitle: "A witness for your children’s children",
    ctaLabel: "Enquire",
    pages: [
      {
        label: "A footprint at Galilee",
        blocks: [
          {
            p: "A family legacy is handed on not only by words, but by deeds of love.",
          },
          {
            p: "By helping build the Restaurant Built Together at Magdala, your family becomes part of a lasting response to Jesus’ prayer “that they may all be one” (John 17:20–23). Your gift leaves a footprint at the Sea of Galilee, where future generations may come, pray, and remember: our family chose to help Christians walk one step closer in Christ.",
          },
        ],
      },
      {
        label: "Across generations",
        blocks: [
          {
            p: "A family bond with the Holy Land can resonate for generations. Your children, grandchildren, and their children may one day retrace your steps at Magdala and discover the witness you helped build.",
          },
          { scripture: "“Come, follow me.” — cf. Mark 1:17" },
        ],
      },
      {
        label: "Remember & continue",
        blocks: [
          {
            p: "In Christ, love crosses generations. What you offer today can become an invitation for those who come after you: remember what the Lord has done, cherish the oneness for which Jesus prayed, and continue the journey.",
          },
          {
            scripture:
              "“Tell the coming generation the glorious deeds of the Lord.” — Psalm 78:4; cf. Joel 1:3",
          },
          {
            aside: {
              heading: "Honor your family at Magdala",
              p: "Would you like to honor your parents, grandparents, children, or grandchildren through a family recognition at Magdala? We would be glad to speak with you about this possibility.",
            },
          },
        ],
      },
    ],
  },
];

// Hand-set tessera run — the brand's quiet ornament, on the light ground.
const TESSERAE = [
  { w: 5, h: 5, fill: "#54132e", o: 0.7, r: 8 },
  { w: 4, h: 4, fill: "#8a6746", o: 0.55, r: -6 },
  { w: 6, h: 6, fill: "#3f0e22", o: 0.8, r: 3 },
  { w: 4, h: 4, fill: "#8a6746", o: 0.5, r: -10 },
  { w: 5, h: 5, fill: "#54132e", o: 0.6, r: 12 },
];

export function RecognitionLevels() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);

  const level = levels[active];
  const pageCount = level.pages.length;
  const safePage = Math.min(page, pageCount - 1);
  const current = level.pages[safePage];

  const selectLevel = (i: number) => {
    setActive(i);
    setPage(0);
  };

  return (
    <section
      id="recognition"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-4 md:px-10 md:pb-20 md:pt-6">
        {/* ── Intro ── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: reverentEase }}
            className="eyebrow text-terracotta"
          >
            Recognition at Magdala
          </motion.p>

          {/* Tessera run */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: reverentEase }}
            aria-hidden="true"
            className="mt-4 flex items-center justify-center gap-2.5"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-burgundy/25" />
            {TESSERAE.map((t, i) => (
              <span
                key={i}
                className="block"
                style={{
                  width: t.w,
                  height: t.h,
                  background: t.fill,
                  opacity: t.o,
                  transform: `rotate(${t.r}deg)`,
                }}
              />
            ))}
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-burgundy/25" />
          </motion.div>

        </div>

        {/* ── Level tabs — who is this step for? ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: reverentEase }}
          role="tablist"
          aria-label="Recognition levels"
          className="mt-8 flex items-stretch justify-center divide-x divide-line-soft md:mt-10"
        >
          {levels.map((lv, i) => {
            const isActive = i === active;
            return (
              <button
                key={lv.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectLevel(i)}
                className="group flex flex-1 flex-col items-center px-3 py-1 text-center transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burgundy/40 md:flex-none md:px-10"
              >
                <span
                  className={[
                    "eyebrow text-[9px] transition-colors duration-300",
                    isActive ? "text-terracotta" : "text-ink/40 group-hover:text-ink/60",
                  ].join(" ")}
                >
                  {lv.audience}
                </span>
                <span
                  className={[
                    "font-display mt-1 text-lg leading-tight transition-colors duration-300 md:text-[22px]",
                    isActive
                      ? "text-burgundy"
                      : "text-ink/35 group-hover:text-ink/65",
                  ].join(" ")}
                >
                  {lv.title}
                </span>
                {/* tessera marker settles under the chosen level */}
                <span
                  aria-hidden="true"
                  className={[
                    "mt-2 block h-[6px] w-[6px] rotate-45 bg-gold transition-all duration-500",
                    isActive ? "scale-100 opacity-90" : "scale-0 opacity-0",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </motion.div>

        {/* ── The sheet — one compact ivory card, chapters within ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.42, ease: reverentEase }}
          className="mt-6 md:mt-7"
        >
          <div
            className="relative rounded-xl bg-[#faf8f2] ring-1 ring-black/5 shadow-[0_30px_70px_-35px_rgba(84,19,46,0.35)]"
            style={{ borderTop: "3px solid #54132e" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: reverentEase }}
                className="p-6 md:p-8"
              >
                {/* Header row — title, subtitle, enquire */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-burgundy md:text-[28px]">
                      {level.title} Recognition
                    </h3>
                    <p className="font-serif mt-0.5 text-[15px] italic text-ink/60">
                      {level.subtitle}
                    </p>
                  </div>
                  <Link
                    href={CONTACT}
                    className="group inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-2 text-[13px] font-medium text-cream transition hover:bg-burgundy-deep"
                  >
                    {level.ctaLabel}
                    <span
                      aria-hidden="true"
                      className="transition group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>

                {/* Chapter chips */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {level.pages.map((pg, i) => {
                    const isOn = i === safePage;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        aria-pressed={isOn}
                        className={[
                          "rounded-full border px-4 py-1.5 text-[12px] font-medium tracking-wide transition",
                          isOn
                            ? "border-burgundy bg-burgundy text-cream shadow-[0_6px_18px_-8px_rgba(84,19,46,0.55)]"
                            : "border-burgundy/25 text-burgundy/70 hover:border-burgundy/55 hover:text-burgundy",
                        ].join(" ")}
                      >
                        {pg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Chapter content — crossfades, holds its footprint */}
                <div className="relative mt-5 min-h-[210px] md:min-h-[170px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safePage}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.45, ease: reverentEase }}
                      className="space-y-4"
                    >
                      {current.blocks.map((block, bi) => (
                        <BlockView key={bi} block={block} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress + next */}
                <div className="mt-5 flex items-center justify-between border-t border-burgundy/10 pt-4">
                  <span className="flex items-center gap-2">
                    {level.pages.map((_, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className={[
                          "block h-1.5 w-1.5 rotate-45 transition-colors duration-300",
                          i === safePage ? "bg-burgundy" : "bg-burgundy/20",
                        ].join(" ")}
                      />
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((c) => (c + 1) % pageCount)}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy/85 transition hover:text-terracotta"
                  >
                    {safePage === pageCount - 1 ? "Begin again" : "Next"}
                    <span
                      aria-hidden="true"
                      className="transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Oneness Stone footnote — only where it applies */}
          {level.subtitle.includes("*") && (
            <p className="font-serif mt-3 text-[13px] italic leading-relaxed text-ink/50">
              * The Oneness Stone is a placeholder — its exact form will be
              closely tied to the art project, which is still in early
              conceptual development.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  if ("scripture" in block) {
    return (
      <div className="flex items-start gap-3 py-1">
        <span
          aria-hidden="true"
          className="mt-3 block h-px w-8 shrink-0 bg-gold/70"
        />
        <p className="font-serif text-base italic leading-relaxed text-burgundy/90 md:text-lg">
          {block.scripture}
        </p>
      </div>
    );
  }
  if ("aside" in block) {
    return (
      <div className="rounded-lg border border-gold/30 bg-[#f0e8d8]/45 p-4 md:p-5">
        <p className="font-display text-lg text-burgundy">
          {block.aside.heading}
        </p>
        <p className="font-serif mt-1.5 text-[15px] leading-[1.65] text-ink/85">
          {block.aside.p}
        </p>
      </div>
    );
  }
  return (
    <p
      className="font-serif text-[15px] leading-[1.7] text-ink/85 md:text-base"
      dangerouslySetInnerHTML={{ __html: block.p }}
    />
  );
}
