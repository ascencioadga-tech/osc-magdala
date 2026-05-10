import Link from "next/link";
import { brand, nav } from "@/lib/content";
import { Medallion } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-burgundy text-cream">
      <div
        className="absolute inset-0 -z-10"
        style={{
          // Soft radial in the same Magdala burgundy hue — gives a hint of
          // depth without leaving the brand color.
          background:
            "radial-gradient(120% 80% at 30% 20%, #7A2C53 0%, #6A2045 55%, #501833 100%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-14 md:px-10 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <Medallion size={120} idPrefix="osc-footer" />
          <div>
            <div className="font-display text-2xl text-cream md:text-[28px]">
              One Step Closer
            </div>
            <div className="eyebrow mt-2 text-gold-light">
              Hospitality · Together
            </div>
            <p className="font-serif mt-5 max-w-md text-base italic leading-relaxed text-cream/75">
              An ecumenical hospitality initiative at Magdala — Christians of
              every tradition, around one table, in one hope.
            </p>
          </div>
        </div>

        <div>
          <div className="eyebrow text-gold-light">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cream/75 transition hover:text-gold-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold-light">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>
              <a
                href="mailto:hello@onestepcloser.org"
                className="hover:text-gold-light"
              >
                hello@onestepcloser.org
              </a>
            </li>
            <li>Magdala, Galilee</li>
          </ul>
          <div className="eyebrow mt-6 text-gold-light">From</div>
          <Link
            href={brand.parentUrl}
            className="mt-2 inline-flex items-center gap-1 text-sm text-cream/85 hover:text-gold-light"
          >
            magdala.org <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-cream/55 md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {new Date().getFullYear()} One Step Closer · A Magdala initiative.
          </span>
          <span className="font-serif italic text-cream/65">
            “That they may all be one.” — John 17 : 21
          </span>
        </div>
      </div>
    </footer>
  );
}
