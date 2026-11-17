import Image from "next/image";
import { Brain, Briefcase, GraduationCap, Gauge, MapPin, Rocket, ShieldCheck } from "lucide-react";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Avatar shown in the portrait panel (transparent WebP in /public/avatar).
 * Set to undefined to fall back to the illustrated developer visual below.
 */
const PORTRAIT_SRC: string | undefined = "/avatar/about-crossed.webp";

const highlights = [
  {
    icon: Rocket,
    title: "Ships end-to-end",
    text: "From database schema to deployment pipeline, I own features across the full stack, not just one layer.",
  },
  {
    icon: ShieldCheck,
    title: "Production discipline",
    text: "JWT auth, role-based access, Docker and CI/CD with GitHub Actions, built with real deployment constraints in mind.",
  },
  {
    icon: Gauge,
    title: "Systems-level thinking",
    text: "A solid grip on DSA and System Design (caching, sharding, replication, load balancing) so apps scale, not just run.",
  },
  {
    icon: Brain,
    title: "AI in real apps",
    text: "RAG and Gemini API features, built into projects like DocChat and DriveGo.",
  },
];

const facts = [
  {
    icon: Briefcase,
    title: "Full Stack Developer @ Printonia Soft",
    text: "Remote · July 2026 – Present (Intern: July 2025 – June 2026)",
  },
  {
    icon: GraduationCap,
    title: "B.Tech, Information Technology",
    text: "RGPV, Bhopal · 2022 – 2026 · CGPA 7.11/10",
  },
  {
    icon: MapPin,
    title: "Based in India",
    text: "Open to Remote, Hybrid & Relocation",
  },
];

const roleTags = [
  { label: "Full Stack", rotate: "-6deg", style: "bg-ink text-cream" },
  { label: "React Native", rotate: "4deg", style: "bg-cream text-ink" },
  { label: "Node.js", rotate: "-3deg", style: "bg-ink text-amber" },
  { label: "AWS", rotate: "5deg", style: "bg-paper text-ink" },
];

function PortraitPanel() {
  return (
    <div className="relative mx-auto w-full max-w-md" data-reveal>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-2 border-cream bg-amber [clip-path:polygon(0_0,calc(100%-3rem)_0,100%_3rem,100%_100%,3rem_100%,0_calc(100%-3rem))]">
        {PORTRAIT_SRC ? (
          <Image
            src={PORTRAIT_SRC}
            alt="Portrait of Harshvardhan, Full Stack Developer"
            fill
            sizes="(min-width: 1024px) 28rem, 90vw"
            quality={90}
            className="object-contain object-bottom"
          />
        ) : (
          <div className="absolute inset-0" role="img" aria-label="Illustration of a code editor with the letter H">
            {/* Editor window */}
            <div className="absolute inset-x-[10%] top-[12%] rounded-2xl border-2 border-ink bg-ink shadow-[6px_6px_0_0_rgba(23,19,15,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-cream/15 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                <span className="h-2.5 w-2.5 rounded-full bg-cream/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-cream/30" />
                <span className="ml-3 text-[11px] font-medium tracking-wide text-cream/50">
                  role.tsx
                </span>
              </div>
              <div className="space-y-2.5 px-4 py-5 font-mono text-[12px] leading-none sm:text-[13px]">
                <p className="text-cream/50">
                  <span className="text-amber">const</span> role ={" "}
                  <span className="text-cream">&quot;Full Stack Developer&quot;</span>;
                </p>
                <p className="text-cream/50">
                  <span className="text-amber">await</span> ship(role);
                </p>
                <p className="text-cream/50">
                  <span className="text-amber">return</span>{" "}
                  <span className="text-cream">&quot;production&quot;</span>;
                </p>
              </div>
            </div>
            {/* Monogram */}
            <div className="absolute bottom-[14%] left-1/2 grid aspect-square w-[40%] -translate-x-1/2 place-items-center rounded-full border-2 border-ink bg-cream font-display text-[clamp(2.75rem,8vw,4.75rem)] leading-none font-extrabold text-ink">
              H
            </div>
          </div>
        )}
      </div>

      {/* Rotated role tags, in the spirit of a sticker sheet */}
      <ul className="absolute -bottom-3 -left-2 flex max-w-[95%] flex-wrap gap-2 sm:-left-6" aria-label="What I do">
        {roleTags.map((tag) => (
          <li
            key={tag.label}
            className={`rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-bold ${tag.style}`}
            style={{ rotate: tag.rotate }}
          >
            {tag.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative bg-ink px-5 py-14 text-cream sm:px-8 sm:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-amber" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <PortraitPanel />

        <div>
          <SectionHeading
            id="about-title"
            tone="dark"
            eyebrow="About Me"
            title={
              <>
                More Than Just <Accent tone="dark">Writing</Accent> Code.
              </>
            }
          />
          <p
            data-reveal
            className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
          >
            I&apos;m Harshvardhan, a passionate and results-driven Development Engineer
            with a solid full-stack background, building everything from clean,
            user-friendly interfaces to fast, scalable backends. I enjoy working in
            collaborative, Agile teams, and I&apos;m always keen to take on challenges that
            push what&apos;s possible.
          </p>
          <p
            data-reveal
            className="mt-4 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
          >
            I started at Printonia Soft as a Full Stack Developer Intern in July 2025
            and moved into a full-time Full Stack Developer role in July 2026. Working
            remotely has taught me to own my features end to end, communicate clearly,
            and ship reliably.
          </p>

          <ul className="mt-8 grid max-w-xl grid-cols-1 gap-3" data-stagger>
            {facts.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3 text-cream">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber text-ink">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{title}</span>
                  <span className="block text-sm text-cream/65">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2" data-stagger>
            {highlights.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="group rounded-2xl border border-cream/15 p-5 transition-colors duration-300 hover:border-amber hover:bg-cream/5"
              >
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-amber text-ink transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream/65">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
