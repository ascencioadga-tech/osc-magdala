// Gatherings the workspace can put into an email.
//
// PROVISIONAL: these are the campaign's own moments — the donor pilgrimage,
// the evenings with the Magdala Stone replica, the private dinners. Dates are
// placeholders until Fr. Eamon fixes the calendar. Nothing here is scraped
// from a public feed; when the Events app is built these move to Supabase and
// this file goes away.

export type OscEvent = {
  id: string;
  title: string;
  date: string;          // ISO
  time: string;
  location: string;
  dateLabel: string;
  cadence?: string;      // set when it recurs
  blurb?: string;
};

export const EVENTS: OscEvent[] = [
  {
    id: "pilgrimage",
    title: "Donor pilgrimage to Magdala",
    date: "2026-10-12",
    time: "Four days",
    location: "Magdala, Sea of Galilee",
    dateLabel: "October 12–16",
    blurb: "For the closest friends of the campaign and their spouses.",
  },
  {
    id: "stone-evening",
    title: "An evening with the Magdala Stone",
    date: "2026-09-19",
    time: "6:30 PM",
    location: "Host home",
    dateLabel: "September 19",
    cadence: "Monthly",
    blurb: "First-century Galilee brought into the room.",
  },
  {
    id: "dinner",
    title: "Private dinner circuit",
    date: "2026-09-05",
    time: "7:00 PM",
    location: "By invitation",
    dateLabel: "September 5",
    blurb: "Ten to twenty guests, one table, one ask.",
  },
];

export function formatEventDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

/** Events still ahead of today — the list should never advertise the past. */
export function upcomingEvents(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return EVENTS.filter((e) => e.cadence || e.date >= today);
}
