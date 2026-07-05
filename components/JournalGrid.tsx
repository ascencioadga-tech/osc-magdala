import Link from "next/link";
import Image from "next/image";
import { fetchMagdalaArticles, type MagdalaArticle } from "@/lib/journal";
import { journalPosts } from "@/lib/content";

export async function JournalGrid() {
  // Pull the latest "Magdala Crossroads" articles only (cached 1h).
  // Fallback to local seed posts if the fetch fails.
  const remote = await fetchMagdalaArticles({
    limit: 3,
    category: "Magdala Crossroads",
  });
  const articles =
    remote.length > 0
      ? remote
      : journalPosts.map((p) => ({
          url: `/journal/${p.slug}`,
          slug: p.slug,
          title: p.title,
          image: p.cover,
          category: p.category,
          excerpt: p.excerpt,
        }));

  // Make the grid adapt to the number of articles so 1 or 2 stay centered
  // and don't leave an empty slot in a 3-col row.
  const gridClass =
    articles.length === 1
      ? "mx-auto max-w-md"
      : articles.length === 2
        ? "mx-auto max-w-4xl md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section id="journal" className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-terracotta">
              Magdala Crossroads · Monthly Journal
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] text-burgundy md:text-[56px]">
              Reflections from Galilee.
            </h2>
          </div>
          <Link
            href="https://www.magdala.org/journal"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-burgundy/40 px-5 py-2.5 text-sm text-burgundy transition hover:border-burgundy hover:bg-burgundy hover:text-cream"
          >
            Read the Journal <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div
          className={[
            "mt-12 grid gap-8 md:mt-16 md:gap-10",
            gridClass,
          ].join(" ")}
        >
          {articles.map((post) => (
            <JournalCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JournalCard({ post }: { post: MagdalaArticle }) {
  // Open magdala.org articles in a new tab (we don't host the article body
  // ourselves yet). Internal slugs remain relative.
  const isExternal = /^https?:\/\//.test(post.url);

  return (
    <Link
      href={post.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(41,8,24,0) 55%, rgba(41,8,24,0.45) 100%)",
          }}
        />
      </div>
      <div className="mt-5">
        <p className="eyebrow text-terracotta">{post.category}</p>
        <h3 className="font-display mt-3 text-2xl leading-tight text-burgundy transition group-hover:text-terracotta md:text-[28px]">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="font-serif mt-3 text-base italic leading-relaxed text-ink/75">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
