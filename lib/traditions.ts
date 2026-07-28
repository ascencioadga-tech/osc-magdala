/*
  The Christian traditions, as One Step Closer would name them.

  This list is a courtesy, not a taxonomy. It exists so someone can tap rather
  than type, and every entry is also free text — because the work at Magdala
  is precisely that the traditions are more numerous and more particular than
  any list. A Copt, a Syro-Malabar Catholic and a Ukrainian Greek Catholic are
  not "Other".

  Order is deliberate: oldest communions first, then the churches of the
  Reformation roughly in historical order, then the newer movements — rather
  than sorting by how many of them we happen to know. "Still finding my way"
  sits last and is offered without qualification, because a work whose prayer
  is "that they may all be one" cannot ask a seeker to pick a side at the door.
*/

export const TRADITIONS = [
  "Catholic",
  "Orthodox",
  "Oriental Orthodox",
  "Anglican / Episcopal",
  "Lutheran",
  "Reformed / Presbyterian",
  "Methodist",
  "Baptist",
  "Pentecostal / Charismatic",
  "Evangelical",
  "Messianic Jewish",
  "Still finding my way",
] as const;

export type Tradition = (typeof TRADITIONS)[number] | string;

/** What to call the community, in the words that tradition actually uses. */
export function communityWord(tradition?: string): string {
  if (!tradition) return "church or community";
  const t = tradition.toLowerCase();
  if (t.includes("catholic") || t.includes("orthodox") || t.includes("anglican") || t.includes("episcopal"))
    return "parish";
  if (t.includes("messianic")) return "congregation";
  if (t.includes("still finding")) return "community, if you have one";
  return "church";
}
