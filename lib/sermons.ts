// The One Step Closer film library — what the email composer can drop into a
// message. These are the videos that already exist on onestepcloser.org.
//
// PROVISIONAL: titles and running order are taken from the site as built.
// Confirm with Fr. Eamon which film should be "featured" at any given moment,
// and whether new footage from the shore should be added here first.

export type Film = {
  id: string;
  title: string;
  part: string;
  parts: number;
  art: string;
  href: string;
};

export const SERIES: Film[] = [
  {
    id: "intro",
    title: "One Step Closer",
    part: "The invitation",
    parts: 5,
    art: "/osc-intro-poster.jpg",
    href: "https://onestepcloser.org/#vision",
  },
  {
    id: "crossroads",
    title: "A culture of encounter",
    part: "Magdala Crossroads",
    parts: 5,
    art: "/hero-galilee.jpg",
    href: "https://onestepcloser.org/#crossroads",
  },
  {
    id: "fr-juan",
    title: "Why Magdala",
    part: "Fr. Juan Solana",
    parts: 5,
    art: "/fr-juan-osc-poster.jpg",
    href: "https://onestepcloser.org/#vision",
  },
];

export const FEATURED: Film = SERIES[0];
