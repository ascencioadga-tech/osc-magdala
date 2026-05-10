// Fetch and parse the latest articles from magdala.org/journal.
// Server-side only. Cached for 1 hour via Next.js fetch revalidation.

import * as cheerio from "cheerio";

export type MagdalaArticle = {
  /** Article URL (absolute, points to magdala.org) */
  url: string;
  /** Slug — the path segment after /journal/ */
  slug: string;
  /** Article title */
  title: string;
  /** Cover image URL (Webflow CDN) */
  image: string;
  /** Category label (e.g. "Archaeology", "A Letter from Fr. Juan") */
  category: string;
  /** Optional excerpt extracted from the card body */
  excerpt?: string;
};

const JOURNAL_URL = "https://www.magdala.org/journal";
// Webflow CMS pagination key as it appears on magdala.org/journal.
// If they ever change this, fetching falls back to page 1 only.
const PAGE_QUERY = "1918d7de_page";
const MAX_PAGES = 4;

type FetchArticlesOptions = {
  limit?: number;
  /** If provided, only return articles whose category matches (case-insensitive) */
  category?: string;
};

async function fetchJournalPage(page: number): Promise<MagdalaArticle[]> {
  const url = page === 1 ? JOURNAL_URL : `${JOURNAL_URL}?${PAGE_QUERY}=${page}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OSC-Site/1.0)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return parseMagdalaJournal(await res.text());
  } catch {
    return [];
  }
}

/**
 * Fetch the latest N articles from the Magdala journal, optionally filtered
 * by category. Walks subsequent pages until we have enough matches or run
 * out (capped at MAX_PAGES). Each page is independently cached for 1 hour.
 * Falls back to an empty array if all fetches fail.
 */
export async function fetchMagdalaArticles(
  optsOrLimit?: number | FetchArticlesOptions,
): Promise<MagdalaArticle[]> {
  const opts: FetchArticlesOptions =
    typeof optsOrLimit === "number" ? { limit: optsOrLimit } : optsOrLimit ?? {};
  const limit = opts.limit ?? 3;
  const wantCat = opts.category?.toLowerCase();

  const collected: MagdalaArticle[] = [];
  const seenSlugs = new Set<string>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageArticles = await fetchJournalPage(page);
    if (pageArticles.length === 0) break; // no more pages

    for (const a of pageArticles) {
      if (seenSlugs.has(a.slug)) continue;
      if (wantCat && a.category.toLowerCase() !== wantCat) continue;
      seenSlugs.add(a.slug);
      collected.push(a);
      if (collected.length >= limit) break;
    }
    if (collected.length >= limit) break;
  }

  return collected.slice(0, limit);
}

/**
 * Parse the HTML of magdala.org/journal and return every article on the page.
 * Caller is responsible for filtering / slicing.
 */
export function parseMagdalaJournal(html: string): MagdalaArticle[] {
  const $ = cheerio.load(html);
  const articles: MagdalaArticle[] = [];

  $(".journal_article_item").each((_, el) => {
    const $el = $(el);
    const $link = $el.find("a[href^='/journal/']").first();
    const href = $link.attr("href") ?? "";
    if (!href || href === "/journal") return;

    // Webflow has a decorative category image (sometimes inside
    // `.w-condition-invisible`) and the actual article image. Skip the
    // invisible one when present.
    const $imgs = $el.find("img");
    let imgSrc = "";
    $imgs.each((__, img) => {
      const $img = $(img);
      // skip images inside an invisible block
      if ($img.closest(".w-condition-invisible").length) return;
      const src = $img.attr("src") || "";
      if (src && !imgSrc) imgSrc = src;
    });
    // Fallback: use the first image we found
    if (!imgSrc && $imgs.length) {
      imgSrc = $imgs.first().attr("src") || "";
    }

    const category = $el.find(".journal_category_layout .u-text-small")
      .first()
      .text()
      .trim();
    // The featured article uses .u-text-h5; the smaller cards use .u-text-h6.
    const title =
      $el.find(".u-text-h5").first().text().trim() ||
      $el.find(".u-text-h6").first().text().trim();
    // Excerpt / byline — pick the first .u-text-small that's NOT the
    // category label and isn't the literal "Read the article" CTA.
    const excerpt = $el
      .find(".u-text-small")
      .filter((__, n) => {
        const $n = $(n);
        if ($n.closest(".journal_category_layout").length) return false;
        const t = $n.text().trim().toLowerCase();
        return !!t && t !== "read the article";
      })
      .first()
      .text()
      .trim();

    if (!title || !imgSrc) return;

    const slug = href.replace(/^\/journal\//, "").replace(/\/$/, "");

    articles.push({
      url: href.startsWith("http")
        ? href
        : `https://www.magdala.org${href}`,
      slug,
      title,
      image: imgSrc,
      category: category || "Magdala Journal",
      excerpt: excerpt || undefined,
    });
  });

  return articles;
}
