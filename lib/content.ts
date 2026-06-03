export const brand = {
  name: "One Step Closer",
  parent: "Magdala",
  parentUrl: "https://www.magdala.org",
  tagline: "Hospitality Together",
};

export const hero = {
  eyebrow: "Hospitality Together",
  title: "One Step Closer",
  tagline: "What starts at the Sea of Galilee goes worldwide.",
  intro:
    "Christians of many traditions serving pilgrims together, so the world may believe.",
  primaryCta: { label: "Join the Journey", href: "#take-a-step" },
  secondaryCta: { label: "Donate", href: "#donate" },
  attribution: "from magdala.org",
};

export const vision = {
  eyebrow: "The Vision",
  body:
    "At Magdala — the Galilean crossroads where Jesus walked from synagogue to synagogue — Christians of every tradition are stepping closer to one another by serving pilgrims together. One Step Closer is a shared work of hospitality: a restaurant, a volunteer program, an iconic artwork, and the pilgrims who carry the encounter home. From Galilee, leaven changes the world.",
};

export type Stone = {
  number: 1 | 2 | 3 | 4;
  label: string;
  oneLine: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  /** Optional video for the expanded panel (autoplay-loop-muted with full controls) */
  video?: string;
  /** Optional YouTube URL or video ID. Takes precedence over `video` / `images`. */
  youtube?: string;
  /** Optional still image for the expanded panel (used when no video / no images carousel) */
  image?: string;
  /** Optional rotating carousel of photos for the expanded panel. Takes precedence over `image`.
      Natural width/height let the frame adapt to each image's aspect so every shot is shown
      in full with no cropping. */
  images?: {
    src: string;
    alt?: string;
    caption?: string;
    width: number;
    height: number;
  }[];
};

export const stones: Stone[] = [
  {
    number: 1,
    label: "Restaurant",
    oneLine: "The kickoff — a restaurant at Magdala, built and run together.",
    title: "A restaurant at Magdala, built together",
    body: "The inaugural shot of One Step Closer: a restaurant at Magdala, built and run by Christians of many denominations. Pilgrims share meals and fellowship; the witness begins at table.",
    cta: { label: "Help build the restaurant", href: "#donate" },
    images: [
      {
        src: "/restaurant/restaurant-1.jpg",
        alt: "Magdala Restaurant — exterior view (1)",
        caption: "Magdala Restaurant · 1",
        width: 1800,
        height: 1005,
      },
      {
        src: "/restaurant/restaurant-2.jpg",
        alt: "Magdala Restaurant — exterior view (2)",
        caption: "Magdala Restaurant · 2",
        width: 1800,
        height: 1101,
      },
      {
        src: "/restaurant/restaurant-3.jpg",
        alt: "Magdala Restaurant — exterior view (3)",
        caption: "Magdala Restaurant · 3",
        width: 1800,
        height: 1194,
      },
    ],
  },
  {
    number: 2,
    label: "Volunteers",
    oneLine: "Volunteers from Catholic, Orthodox, and Reformation churches serving side by side.",
    title: "Volunteers serving side by side",
    body: "A shared volunteer program where Christians from different faith communities welcome pilgrims together. Mutual respect, real cooperation — hospitality as a sign of the unity we still hope for.",
    cta: { label: "Volunteer with us", href: "#take-a-step" },
    youtube: "https://www.youtube.com/watch?v=YTih2pqq7V4&t=4s",
  },
  {
    number: 3,
    label: "Artwork",
    oneLine: "An iconic artwork of Christian unity rising in Galilee.",
    title: "An iconic artwork of unity",
    body: "Sculptures and paintings — created by artists across traditions — that celebrate and teach Christian oneness. The artwork becomes a teaching place for the next generation of pilgrims.",
    cta: { label: "Support the artwork", href: "#donate" },
    video: "/artist.mp4",
  },
  {
    number: 4,
    label: "Worldwide",
    oneLine: "Pilgrims carry the encounter home — leaven for their neighborhoods.",
    title: "Worldwide resonance",
    body: "Visitors and volunteers return to families and churches changed. Encounter, mutual appreciation, and teamwork replace prejudice. Leaven from Galilee changes the world, one neighborhood at a time.",
    cta: { label: "Bring it home", href: "#take-a-step" },
  },
];

/**
 * "ONE STEP CLOSER IN ACTION" — progress section.
 * Drop video and image files into /public/in-action/ and reference them here.
 */
export const inAction = {
  eyebrow: "One Step Closer in Action",
  title: "Progress on the path.",
  intro:
    "The work as it unfolds — restaurant, volunteers, artwork, and the encounters along the way.",
  /** Self-hosted video file path (e.g. "/motb-recap.mp4"). */
  video: "/motb-recap.mp4" as string | undefined,
  /** YouTube URL or ID. Takes precedence over `video` if both are set. */
  youtube: undefined as string | undefined,
  /** Carousel images shown in the right column. */
  images: [
    { src: "/in-action/dc1.jpg", alt: "OSC progress · DC 1", caption: "Washington D.C. Event" },
    { src: "/in-action/dc2.jpg", alt: "OSC progress · DC 2", caption: "Washington D.C. Event" },
    { src: "/in-action/dc3.jpg", alt: "OSC progress · DC 3", caption: "Washington D.C. Event" },
    { src: "/in-action/dc4.jpg", alt: "OSC progress · DC 4", caption: "Washington D.C. Event" },
    { src: "/in-action/dc5.jpg", alt: "OSC progress · DC 5", caption: "Washington D.C. Event" },
    { src: "/in-action/dc6.jpg", alt: "OSC progress · DC 6", caption: "Washington D.C. Event" },
    { src: "/in-action/dc7.jpg", alt: "OSC progress · DC 7", caption: "Washington D.C. Event" },
    { src: "/in-action/dc8.jpg", alt: "OSC progress · DC 8", caption: "Washington D.C. Event" },
    { src: "/in-action/dc9.jpg", alt: "OSC progress · DC 9", caption: "Washington D.C. Event" },
    { src: "/in-action/osc-summit-1.jpg", alt: "OSC Summit · February 2026 (1)", caption: "OSC Summit" },
    { src: "/in-action/osc-summit-2.jpg", alt: "OSC Summit · February 2026 (2)", caption: "OSC Summit" },
    { src: "/in-action/osc-summit-3.jpg", alt: "OSC Summit · February 2026 (3)", caption: "OSC Summit" },
  ] as { src: string; alt?: string; caption?: string }[],
};

export const crossroads = {
  eyebrow: "Magdala Crossroads",
  paragraphs: [
    "Magdala has been favored with superlatively-labeled archeological findings, gifted artists, and open-minded leadership. Standing around a 2,000-year-old synagogue in the area where Jesus traveled from synagogue to synagogue, Christians realize that here in Galilee — the fountainhead of that stream animating billions worldwide — they stand again side by side, where once no divisions fractured their blessed discipleship.",
    "Without our intentional planning, Providence has surprised us with world-ranking artists from Reformation, Catholic, and Eastern churches who decorated Duc in Altum. A culture of encounter flourishes for everyone of faith or no faith. Interfaith prejudice subsides. Fresh acquaintances spark developing friendships. Each one builds with their neighbor on what they share in common.",
    "Cherished Magdala vocabulary includes crossroads, culture of encounter, commonality. No wonder One Step Closer — Hospitality Together sprouted on this fertile terrain for our shared treasures of humanity.",
  ],
};

export const prayer = {
  epigraph: "John 17:20–23",
  title: "One Step Closer Prayer",
  body: [
    "Jesus, You built the Church on the twelve foundation stones together with the names of the apostles. At Your last meal with the twelve before You suffered, You prayed to Abba, Your Father, that we might all be one so the world would believe that He sent You.",
    "You welcomed Samaritans and Gentiles, Greeks and Syrophoenicians, Romans and Ethiopians, and so brought together Jew and Gentile. After so many painful and damaging divisions we yearn for a unity that seems almost impossible — but, with You, nothing is impossible.",
    "Show us how to bring together our five loaves and two fish, our six jars full of water — even a mere cup of water — so You can reveal Your Kingdom. Help us take one possible step closer together and offer hospitality together, so all can recognize You in the breaking of the Bread.",
  ],
};

export type JournalPost = {
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  cover: string; // /public path
};

export const journalPosts: JournalPost[] = [
  {
    slug: "stones-into-bread",
    category: "Reflection",
    title: "Stones into bread: a kitchen at the crossroads",
    author: "Fr. Eamon Kelly",
    date: "April 2026",
    excerpt:
      "What does it mean to break bread together, when our churches still struggle to share a table?",
    cover: "/hero-galilee.jpg",
  },
  {
    slug: "the-fourth-stone",
    category: "Project Update",
    title: "The fourth stone: bringing Magdala home",
    author: "Magdala Crossroads",
    date: "March 2026",
    excerpt:
      "Pilgrims who served together in Galilee are starting hospitality circles in their parishes back home.",
    cover: "/hero-galilee.jpg",
  },
  {
    slug: "side-by-side",
    category: "Encounter",
    title: "Side by side: a Reformation pastor at Duc in Altum",
    author: "Magdala Crossroads",
    date: "February 2026",
    excerpt:
      "A first visit to Magdala — and a discovery that the artwork was painted by a brother from his own tradition.",
    cover: "/hero-galilee.jpg",
  },
];

export const takeAStep = {
  eyebrow: "How to Take a Step",
  title: "Three ways to walk with us",
  paths: [
    {
      key: "denominations",
      title: "For Partner Denominations",
      body: "Bring your tradition into the shared work. We welcome formal partnerships with churches and communities ready to send volunteers, artists, and clergy.",
      cta: { label: "Partner with us", href: "/partners" },
    },
    {
      key: "pilgrims",
      title: "For Pilgrims",
      body: "Plan a pilgrimage that includes serving alongside Christians from other traditions. Stay, encounter, and carry the leaven home.",
      cta: { label: "Plan your pilgrimage", href: "mailto:pilgrim@onestepcloser.org" },
    },
    {
      key: "donors",
      title: "For Friends and Supporters",
      body: "Help build the restaurant, fund volunteers, commission the artwork. Every gift is a stone laid in the path.",
      cta: { label: "Donate", href: "/benefactors" },
    },
  ],
};

export const nav = {
  primary: [
    { label: "Vision", href: "#vision" },
    { label: "Stepping Stones", href: "#stepping-stones" },
    { label: "Crossroads", href: "#crossroads" },
    { label: "Journal", href: "#journal" },
    { label: "Take a Step", href: "#take-a-step" },
  ],
  cta: { label: "Donate", href: "#donate" },
};
