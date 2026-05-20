import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { OnenessStone } from "@/components/OnenessStone";
import { MagdalaMosaic } from "@/components/MagdalaMosaic";

export const metadata: Metadata = {
  title: "Benefactors · One Step Closer",
  description:
    "The Oneness Stone and the Magdala Mosaic — two ways friends, churches, and benefactors take part in One Step Closer at Magdala, Galilee.",
};

export default function BenefactorsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-cream">
        <OnenessStone />
        <MagdalaMosaic />
      </main>
      <Footer />
    </>
  );
}
