import type { Metadata } from "next";
import WelcomeForm from "../../components/WelcomeForm";

/*
  Public, on purpose. This is the page you hand someone on a tablet after a
  Stone evening, or QR onto a card at the end of a pilgrimage. It sits outside
  /workspace so it needs no login — the console is for the team, this is for
  the person.
*/

export const metadata: Metadata = {
  title: "One Step Closer — Become a friend of the work",
  description:
    "Christians of every tradition, building one house on the shore of the Sea of Galilee.",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <main className="min-h-[100svh] bg-[#faf8f2]">
      <header className="relative overflow-hidden bg-[#54132e] px-6 pb-16 pt-12 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 20% 15%, rgba(160,55,75,0.45) 0%, rgba(84,19,46,0) 62%), radial-gradient(80% 70% at 92% 95%, rgba(41,8,24,0.75) 0%, rgba(84,19,46,0) 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.png"
            alt="One Step Closer — Hospitality Together"
            width={1400}
            height={320}
            className="h-11 w-auto"
          />
          <h1 className="font-display mt-10 text-[38px] leading-[1.05] text-[#faf8f2] sm:text-[46px]">
            Come and be counted
            <br />
            among the friends.
          </h1>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-[#faf8f2]/75">
            Christians of many traditions are building one house on the shore of
            the Sea of Galilee. Tell us who you are and where you pray, and we
            will keep you close to the work.
          </p>
          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b19277]">
            At Magdala · Sea of Galilee
          </p>
        </div>
      </header>

      <div className="px-6 pt-12 sm:px-10">
        <WelcomeForm />
      </div>
    </main>
  );
}
