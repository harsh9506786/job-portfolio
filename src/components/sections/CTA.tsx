import { Button } from "@/components/ui/Button";

const band = "LET'S TALK • LET'S TALK • LET'S TALK • LET'S TALK • LET'S TALK • ";

export function CTA() {
  return (
    <section
      id="start"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-amber px-5 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-24"
    >
      {/* Giant outlined type that drifts sideways as you scroll */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none" aria-hidden="true">
        <p
          data-scrub-x="-18"
          className="text-outline w-max font-display text-[clamp(5rem,16vw,12rem)] leading-none font-extrabold whitespace-nowrap opacity-25"
        >
          {band}
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h2
          id="cta-title"
          data-reveal
          className="font-display text-[clamp(1.9rem,4.8vw,3.5rem)] leading-[1.05] font-extrabold tracking-tighter text-balance text-ink"
        >
          Looking for a Full Stack{" "}
          <em className="font-serif font-normal text-cream italic">Developer?</em>
        </h2>
        <p
          data-reveal
          data-reveal-delay="0.1"
          className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ink/80 sm:text-base"
        >
          I can take a feature from database to deployment. Let&apos;s talk about your team.
        </p>
        <div data-reveal data-reveal-delay="0.2" className="mt-7 flex justify-center">
          <Button href="#contact" variant="dark">
            Get In Touch
          </Button>
        </div>
      </div>

      {/* Scalloped edge: a visual hand-off into the portfolio section */}
      <div
        className="absolute inset-x-0 bottom-0 h-6 sm:h-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 100%, var(--color-cream) 0 1.15rem, transparent 1.2rem)",
          backgroundSize: "2.4rem 100%",
          backgroundRepeat: "repeat-x",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
