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
  /** Optional softer line shown beneath the panel title. */
  subtitle?: string;
  body?: string;
  /** Structured panel body — when present, rendered instead of `body`. */
  bodyBlocks?: ({ paragraph: string } | { bullets: string[] })[];
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
  /** Optional dropdown of further detail; the CTA becomes a toggle.
      Each section is rendered as an animated block with its own heading
      and an ordered list of paragraphs / bulleted lists. */
  expand?: {
    sections: {
      heading: string;
      /** Short label used by the chip navigation (falls back to heading). */
      label?: string;
      blocks: ({ paragraph: string } | { bullets: string[] })[];
    }[];
  };
};

export const stones: Stone[] = [
  {
    number: 1,
    label: "Restaurant",
    oneLine: "The kickoff — a restaurant at Magdala, built and run together.",
    title: "More than a restaurant",
    subtitle: "Building together a living sign of John 17",
    body: "Christians from various confessions of faith build a restaurant together as an irrefutable monument to Christ’s oneness prayer motivating us all to continue responding 2000 years later.",
    cta: { label: "Learn More", href: "#" },
    expand: {
      sections: [
        {
          label: "Living Monument",
          heading: "A Living Monument to Jesus’ Oneness Prayer (John 17)",
          blocks: [
            {
              paragraph:
                "At the Last Supper, Jesus prayed for all who would believe in him, “that they may all be one” (John 17:20–23). At Magdala, One Step Closer – Hospitality Together gives that prayer a visible and practical form.",
            },
            {
              paragraph:
                "Christians from diverse traditions are building this restaurant together.",
            },
            { paragraph: "That fact is the message." },
            {
              paragraph:
                "Before the first meal is served, the restaurant already proclaims something simple and powerful: by God’s grace, disciples of Jesus, still marked by centuries of division, can move from inherited prejudice to friendship, from rivalry to partnership, and from separation to shared service.",
            },
          ],
        },
        {
          label: "Training Ground",
          heading:
            "A training ground for OSC-HT volunteers to grow closer together",
          blocks: [
            {
              paragraph:
                "The restaurant will speak silently to every volunteer who offers hospitality:",
            },
            {
              bullets: [
                "Christians built this together.",
                "Christians can serve together.",
                "Christians can return home and continue working together.",
              ],
            },
            {
              paragraph:
                "Volunteers from different Christian traditions serving together learn and practice the spirit of oneness for which Jesus prayed.",
            },
          ],
        },
        {
          label: "Oasis of Togetherness",
          heading:
            "An oasis of togetherness to experience Jesus’ Oneness Prayer through hospitality",
          blocks: [
            {
              paragraph:
                "The restaurant will speak silently to every guest who enters:",
            },
            {
              bullets: [
                "It was built together by Christians from diverse traditions.",
                "It serves as a place where hospitality becomes witness.",
                "It invites every visitor to carry this same spirit home.",
              ],
            },
            {
              paragraph:
                "The restaurant will welcome the hungry, the thirsty, the tired, the pilgrim, the visitor, and the exhausted who experience a tangible sign that inherited prejudice can give way to friendship, and a school of oneness where hospitality becomes a pathway toward reconciliation.",
            },
          ],
        },
      ],
    },
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
    cta: { label: "Learn More", href: "#" },
    youtube: "https://www.youtube.com/watch?v=YTih2pqq7V4&t=4s",
    expand: {
      sections: [
        {
          label: "An Invitation",
          heading: "An Invitation to Serve at Magdala",
          blocks: [
            {
              paragraph:
                "Since 2010, thousands of volunteers have blessed Magdala with a spirit of service. We now seek to extend this to our restaurant hospitality.",
            },
            {
              paragraph:
                "Our staff does great work, but hundreds of tired, thirsty, and hungry pilgrims deeply appreciate a personal welcome and touches of attention inspired by Jesus’ example.",
            },
            {
              paragraph:
                "We invite your Church to send volunteers regularly to serve pilgrims at Magdala for extended periods.",
            },
            {
              paragraph:
                "Learn more about our existing volunteer program at Magdala Volunteers.",
            },
          ],
        },
        {
          label: "The Impact",
          heading: "Renewed in Body, Mind, and Soul",
          blocks: [
            {
              paragraph:
                "Imagine the impact on those who come to dine at Magdala, leaving refreshed in body and renewed in mind and soul.",
            },
            {
              paragraph:
                "Volunteers, their families, and home Churches will be enriched by the experiences, promoting new waves of volunteers.",
            },
          ],
        },
        {
          label: "Together",
          heading: "One Step Closer, Across Traditions",
          blocks: [
            {
              paragraph:
                "Picture volunteers from different Christian faith communities serving Holy Land pilgrims together.",
            },
            {
              paragraph:
                "Despite our differences, we can provide hospitality together, impacting countless visitors, including those who are not Christians.",
            },
            {
              paragraph:
                "We aim to walk closer together, beyond prejudices and judgmental attitudes, heeding Jesus’ call, “Give them some food yourselves” (Matthew 14; Mark 6; Luke 9.)",
            },
            {
              paragraph:
                "Regardless of our Christian affiliations we can grow one step closer.",
            },
            {
              paragraph:
                "To date, around 3,000 volunteers from various Christian confessions have served in Magdala.",
            },
          ],
        },
      ],
    },
  },
  {
    number: 3,
    label: "Artwork",
    oneLine: "An iconic artwork of Christian unity rising in Galilee.",
    title: "An iconic artwork of unity",
    bodyBlocks: [
      {
        paragraph:
          "The artwork becomes a teaching place for the next generation of pilgrims.",
      },
      { paragraph: "Magdala is blessed by inspiring art." },
      {
        bullets: [
          "Second Temple period mosaics, frescoes, sculpture, and architecture",
          "21st century interpretations of Gospel texts in icons, paintings, mosaics, sculptures, architecture",
        ],
      },
    ],
    cta: { label: "Learn More", href: "#" },
    expand: {
      sections: [
        {
          label: "Call to Artists",
          heading: "Call to artists",
          blocks: [
            {
              paragraph:
                "Expect a worldwide call to artists to submit proposals for the ambitious desire to see a major art piece presenting John 17:20–23 to the world.",
            },
          ],
        },
      ],
    },
    video: "/artist.mp4",
  },
  {
    number: 4,
    label: "Worldwide",
    oneLine: "Pilgrims carry the encounter home — leaven for their neighborhoods.",
    title: "Worldwide Resonance",
    body: "From the shores of Galilee, OSC-HT invites churches, pastors, volunteers, pilgrims, and donors to carry this witness into their own communities: partnership over divisiveness, hospitality over hostility, and long-term friendship over inherited prejudice.",
    cta: { label: "Learn More", href: "#" },
    expand: {
      sections: [
        {
          label: "Hearts Stirred",
          heading: "Hearts Stirred Worldwide",
          blocks: [
            {
              paragraph:
                "One Step Closer already stirs many hearts throughout the world.",
            },
            {
              paragraph:
                "Visitors and volunteers return to families and churches changed.",
            },
            {
              paragraph:
                "Encounter, mutual appreciation, and teamwork replace prejudice.",
            },
          ],
        },
        {
          label: "Leaven from Galilee",
          heading: "Leaven Changes the World",
          blocks: [
            {
              paragraph:
                "Around the globe Christians from different churches in the same locality tackle together the ever new challenges facing the most needy.",
            },
            {
              paragraph:
                "Leaven from Galilee changes the world, one community at a time.",
            },
          ],
        },
      ],
    },
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
