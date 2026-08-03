/**
 * A verse reference inside a tracked, uppercase eyebrow.
 *
 * The eyebrow style adds letter-spacing after every glyph, including the
 * colon and the range dash. At 0.22em that turns a perfectly correct en
 * dash in "17:20–23" into what reads as a spaced em dash, and pushes the
 * colon off the numbers. Cancelling the tracking on just those two
 * characters keeps the reference tight while the words around it stay
 * spaced as designed.
 */
export function ScriptureRef({ children }: { children: string }) {
  const parts = children.split(/([:–—-])/);
  return (
    <>
      {parts.map((part, i) =>
        /^[:–—-]$/.test(part) ? (
          <span key={i} className="tracking-normal">
            {part === ":" ? ":" : "–"}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
