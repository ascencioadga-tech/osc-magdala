import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { journalPosts } from "@/lib/content";

export default function JournalIndex() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-line-soft bg-parchment">
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
            <p className="eyebrow text-terracotta">Magdala Crossroads</p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.02] text-burgundy md:text-[88px]">
              The Journal
            </h1>
            <p className="font-serif mt-6 max-w-2xl text-xl italic leading-relaxed text-ink/80 md:text-2xl">
              Reflections from One Step Closer — stories from Galilee, voices
              from across traditions, field notes from the path.
            </p>
          </div>
        </section>

        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 md:grid-cols-3 md:gap-12">
              {journalPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/journal/${post.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="eyebrow mt-5 text-terracotta">
                    {post.category}
                  </p>
                  <h2 className="font-display mt-3 text-2xl leading-tight text-burgundy transition group-hover:text-terracotta md:text-[28px]">
                    {post.title}
                  </h2>
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink/55">
                    <span>{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-burgundy/40 px-6 py-3 text-sm text-burgundy transition hover:border-burgundy hover:bg-burgundy hover:text-cream"
              >
                Load more articles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
