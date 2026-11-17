import { Briefcase } from "lucide-react";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, job } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="bg-cream-deep px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <Accent>Worked.</Accent>
            </>
          }
          className="mb-8 sm:mb-10"
        />

        <article
          data-reveal
          className="rounded-[1.75rem] border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-9"
        >
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-amber"
                aria-hidden="true"
              >
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm text-mute sm:text-base">
                  {job.company} · {job.place}
                </p>
              </div>
            </div>

            <ol className="space-y-2 sm:text-right" aria-label="Roles held">
              {job.roles.map((r) => (
                <li key={r.period} className="text-sm">
                  <span className="block font-bold">{r.title}</span>
                  <span className="block text-mute">{r.period}</span>
                </li>
              ))}
            </ol>
          </header>

          <ul className="mt-7 space-y-3.5 border-t-2 border-dashed border-ink/20 pt-7">
            {job.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </article>

        <h3
          data-reveal
          className="mt-14 mb-6 font-display text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          What I&apos;ve <Accent>achieved.</Accent>
        </h3>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" data-stagger>
          {achievements.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex gap-4 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_var(--color-ink)]"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-ink"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
