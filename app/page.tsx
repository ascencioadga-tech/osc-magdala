import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Vision } from "@/components/Vision";
import { SteppingStones } from "@/components/SteppingStones";
import { OnenessStone } from "@/components/OnenessStone";
import { Crossroads } from "@/components/Crossroads";
import { OSCInAction } from "@/components/OSCInAction";
import { Prayer } from "@/components/Prayer";
import { JournalGrid } from "@/components/JournalGrid";
import { TakeAStep } from "@/components/TakeAStep";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Vision />
        <SectionDivider />
        <SteppingStones />
        <OnenessStone />
        <Crossroads />
        <OSCInAction />
        <Prayer />
        <JournalGrid />
        <TakeAStep />
      </main>
      <Footer />
    </>
  );
}
