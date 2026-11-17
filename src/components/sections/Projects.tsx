import dynamic from "next/dynamic";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

// Code-split the interactive showcase; the markup is still server-rendered for SEO.
const ProjectShowcase = dynamic(() =>
  import("@/components/sections/ProjectShowcase").then((m) => m.ProjectShowcase),
);

export function Projects() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="work-title"
          eyebrow="My Work"
          title={
            <>
              Selected Work. <Accent>Real</Accent> Experiences.
            </>
          }
          description="Web, mobile and AI projects I've built, with the stack and the engineering decisions behind each."
          className="mb-8 sm:mb-10"
        />
        <ProjectShowcase />

        <div
          data-reveal
          className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] border-2 border-dashed border-ink/40 p-5 sm:flex-row sm:items-center sm:p-6"
        >
          <p className="max-w-md font-display text-lg font-bold tracking-tight sm:text-xl">
            Want to talk through any of these projects? I&apos;d love to.
          </p>
          <Button href="#contact">Get In Touch</Button>
        </div>
      </div>
    </section>
  );
}
