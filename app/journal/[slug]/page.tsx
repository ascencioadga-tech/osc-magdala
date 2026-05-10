import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { journalPosts } from "@/lib/content";

export default async function JournalEntry(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <article className="bg-cream">
          <div className="mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
            <Link
              href="/journal"
              className="eyebrow text-ink/55 hover:text-burgundy"
            >
              ← Back to Journal
            </Link>
            <p className="eyebrow mt-10 text-terracotta">{post.category}</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.02] text-burgundy md:text-[72px]">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-2 text-sm text-ink/55">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <span>{post.date}</span>
            </div>
            <div className="mt-12 space-y-6 text-lg leading-[1.85] text-ink/85 md:text-xl">
              <p className="font-serif italic text-burgundy/85">
                {post.excerpt}
              </p>
              <p>
                Full article copy will live here once we wire the CMS — for
                now this is a placeholder so the route renders.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
