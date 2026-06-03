import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Partners · One Step Closer",
  description:
    "Formal partnerships with churches and communities serving pilgrims together at Magdala.",
};

export default function PartnersPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-cream">
        {/* Intentionally blank for now — content TBD. */}
      </main>
      <Footer />
    </>
  );
}
