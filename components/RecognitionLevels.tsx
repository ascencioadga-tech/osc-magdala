"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";

const reverentEase = [0.22, 0.8, 0.32, 1] as const;
const CONTACT = "mailto:development@onestepcloser.org";

// A detail block is a paragraph, a scripture pull-quote, or a soft
// "aside" callout (a personalization invitation).
type Block =
  | { p: string }
  | { scripture: string }
  | { aside: { heading: string; p: string } };

type Level = {
  numeral: string;
  title: string;
  audience: string;
  subtitle: string;
  summary: string;
  ctaLabel: string;
  blocks: Block[];
};

const levels: Level[] = [
  {
    numeral: "I",
    title: "Christian Tradition",
    audience: "For traditions & confessions",
    subtitle: "The Oneness Stone *",
    summary:
      "Your tradition named on the Oneness Stone, alongside the others building together.",
    ctaLabel: "Enquire about a tradition gift",
    blocks: [
      {
        p: "In response to Jesus’ prayer “that they may all be one” (John 17:20–23), Christians from many traditions are choosing to build together.",
      },
      {
        p: "We do not minimize our real and sometimes significant differences. Yet in Christ, we can still take concrete steps together — building a lasting witness at Magdala that proclaims our shared desire to answer Jesus’ prayer and to serve, bless, and walk closer.",
      },
      {
        p: "The Restaurant Built Together highlights Jesus’ prayer at the Last Supper. It stands as a public sign that Orthodox, Presbyterians, Methodists, Lutherans, Evangelicals, Armenians, Copts, Anglicans, Baptists, Pentecostals, Catholics, and many others can join in a visible act of collaboration.",
      },
      {
        scripture:
          "“By this everyone will know that you are my disciples, if you love one another.” — John 13:35",
      },
      {
        p: "A leadership gift at this level gives visible expression to your Christian tradition’s participation on the Oneness Stone, alongside the names of the traditions and confessions represented in this shared effort.",
      },
      {
        p: "Visitors will pause and ask: <em>Did Christians from all these traditions really build this together? Why? How?</em> They will be led back to John 17 — Jesus prayed for our oneness, and we are responding.",
      },
    ],
  },
  {
    numeral: "II",
    title: "Local Church",
    audience: "For churches & communities",
    subtitle: "A Galilee witness carried home",
    summary:
      "Your church’s witness placed on the shores of Galilee — and carried home.",
    ctaLabel: "Enquire about church recognition",
    blocks: [
      {
        p: "Your local church can become part of the visible response to Jesus’ prayer “that they may all be one” (John 17:20–23).",
      },
      {
        p: "By helping build the Restaurant Built Together at Magdala, your faith community places a concrete sign of its faith on the shores of the Sea of Galilee. Pilgrims will see that your church did not merely speak about Christian oneness — it helped build a public witness to it.",
      },
      {
        p: "Rooted anew in Galilee, your church is invited to carry the same One Step Closer spirit home: serving locally, blessing neighboring churches, and helping your region discover new possibilities of friendship and collaboration in Christ — a real contribution to overcoming damaging divisiveness.",
      },
      {
        scripture: "“Go into all the world and proclaim the Gospel.” — cf. Mark 16:15",
      },
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
  {
    numeral: "III",
    title: "Family Legacy",
    audience: "For families & households",
    subtitle: "A witness for your children’s children",
    summary:
      "A lasting footprint at Galilee for your children, and their children.",
    ctaLabel: "Enquire about a family legacy",
    blocks: [
      {
        p: "A family legacy is handed on not only by words, but by deeds of love.",
      },
      {
        p: "By helping build the Restaurant Built Together at Magdala, your family becomes part of a lasting response to Jesus’ prayer “that they may all be one” (John 17:20–23). Your gift leaves a footprint at the Sea of Galilee, where future generations may come, pray, and remember: our family chose to help Christians walk one step closer in Christ.",
      },
      {
        p: "A family bond with the Holy Land can resonate for generations. Your children, grandchildren, and their children may one day retrace your steps at Magdala and discover the witness you helped build.",
      },
      { scripture: "“Come, follow me.” — cf. Mark 1:17" },
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
];

export function RecognitionLevels() {
  const sectionRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [active, setActive] = useState(0);

  const select = (i: number) => {
    setActive(i);
    // On small screens, bring the detail into view so the tap feels connected.
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      requestAnimationFrame(() =>
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  const level = levels[active];

  return (
    <section
      id="recognition"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream"
    >
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-4 md:px-10 md:pb-32">
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

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: reverentEase }}
            className="font-display mt-4 text-4xl leading-[1.06] text-burgundy md:text-[50px]"
          >
            Built Together. Recognized Together. Sent Together.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.22, ease: reverentEase }}
            className="font-serif mt-6 text-lg leading-[1.75] text-ink/80 md:text-xl"
          >
            Every recognized gift becomes part of a public witness — that
            Christians from diverse traditions refuse to let their differences
            prevent one concrete step together in Christ.{" "}
            <span className="text-burgundy">Division is not our destiny.</span>{" "}
            Choose how you, your church, or your family take part.
          </motion.p>
        </div>

        {/* ── Tier selector — three scannable cards ── */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {levels.map((lv, i) => {
            const isActive = i === active;
            return (
              <motion.button
                key={lv.numeral}
                type="button"
                onClick={() => select(i)}
                aria-pressed={isActive}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.08,
                  ease: reverentEase,
                }}
                className={[
                  "group relative flex flex-col rounded-2xl border p-6 text-left transition md:p-7",
                  isActive
                    ? "border-burgundy bg-cream shadow-[0_24px_50px_-30px_rgba(84,19,46,0.45)]"
                    : "border-line-soft bg-sand/30 hover:border-burgundy/40 hover:bg-sand/50",
                ].join(" ")}
              >
                {/* active accent bar */}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-x-6 top-0 h-0.5 origin-left rounded-full bg-gold transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0",
                  ].join(" ")}
                />
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-[10px] text-terracotta">
                    Level {i + 1}
                  </span>
                  <span className="font-display text-2xl text-gold/80">
                    {lv.numeral}
                  </span>
                </div>
                <span className="font-display mt-3 text-2xl leading-tight text-burgundy">
                  {lv.title}
                </span>
                <span className="eyebrow mt-1 text-[10px] text-ink/55">
                  {lv.audience}
                </span>
                <span className="font-serif mt-4 text-[15px] leading-relaxed text-ink/80">
                  {lv.summary}
                </span>
                <span
                  className={[
                    "eyebrow mt-5 inline-flex items-center gap-1.5 text-[10px] transition-colors",
                    isActive ? "text-burgundy" : "text-ink/45 group-hover:text-burgundy",
                  ].join(" ")}
                >
                  {isActive ? "Viewing" : "View details"}
                  <span aria-hidden="true">→</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ── Detail panel for the selected tier ── */}
        <div
          ref={detailRef}
          className="mt-6 scroll-mt-24 rounded-2xl border border-line-soft bg-sand/30 p-7 md:p-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.45, ease: reverentEase }}
            >
              <p className="eyebrow text-terracotta">
                Level {active + 1} · {level.audience}
              </p>
              <h3 className="font-display mt-3 text-3xl leading-tight text-burgundy md:text-[38px]">
                {level.title} Recognition
              </h3>
              <p className="font-serif mt-2 text-lg italic text-ink/70 md:text-xl">
                {level.subtitle}
              </p>

              <div className="mt-7 space-y-5">
                {level.blocks.map((block, bi) => (
                  <BlockView key={bi} block={block} />
                ))}
              </div>

              <Link
                href={CONTACT}
                className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-cream transition hover:bg-burgundy-deep"
              >
                {level.ctaLabel}
                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Asterisk footnote */}
        <p className="font-serif mt-6 max-w-2xl text-sm italic leading-relaxed text-ink/55">
          * The Oneness Stone is a placeholder — its exact form will be closely
          tied to the art project, which is still in early conceptual
          development.
        </p>
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
        <p className="font-serif text-lg italic leading-relaxed text-burgundy/90 md:text-xl">
          {block.scripture}
        </p>
      </div>
    );
  }
  if ("aside" in block) {
    return (
      <div className="mt-2 rounded-xl border border-gold/30 bg-cream/70 p-5 md:p-6">
        <p className="font-display text-xl text-burgundy">
          {block.aside.heading}
        </p>
        <p className="font-serif mt-2 text-base leading-[1.7] text-ink/85">
          {block.aside.p}
        </p>
      </div>
    );
  }
  return (
    <p
      className="font-serif text-base leading-[1.75] text-ink/85 md:text-lg"
      dangerouslySetInnerHTML={{ __html: block.p }}
    />
  );
}
