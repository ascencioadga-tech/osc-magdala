import Link from "next/link";
import { brand, nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-burgundy text-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-5 md:grid-cols-2 md:gap-10 md:px-10 md:py-6">
        <div>
          <div className="eyebrow text-gold-light">Explore</div>
          <ul className="mt-2 space-y-1 text-[13px]">
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
          <ul className="mt-2 space-y-1 text-[13px] text-cream/75">
            <li>
              <a
                href="mailto:hello@onestepcloser.org"
                className="transition hover:text-gold-light"
              >
                hello@onestepcloser.org
              </a>
            </li>
            <li>Magdala, Galilee</li>
          </ul>
          <div className="eyebrow mt-3.5 text-gold-light">From</div>
          <Link
            href={brand.parentUrl}
            className="mt-1.5 inline-flex items-center gap-1 text-[13px] text-cream/80 transition hover:text-gold-light"
          >
            magdala.org <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-2.5 text-[11px] text-cream/55 md:flex-row md:items-center md:justify-between md:px-10">
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
