import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MagdalaMosaic } from "@/components/MagdalaMosaic";
import { RecognitionLevels } from "@/components/RecognitionLevels";

export const metadata: Metadata = {
  title: "Benefactors · One Step Closer",
  description:
    "The Magdala Mosaic and three levels of recognition — how friends, churches, and families take part in One Step Closer at Magdala, Galilee.",
};

export default function BenefactorsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-cream">
        <MagdalaMosaic />
        <RecognitionLevels />
      </main>
      <Footer />
    </>
  );
}
