"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertCircle, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

interface Brief {
  title: string;
  summary: string;
  projectType: string;
  pages: string[];
  mustHave: string[];
  later: string[];
  phases: { name: string; duration: string; work: string }[];
  totalTime: string;
  firstStep: string;
}

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; brief: Brief };

const MAX_IDEA = 600;

const EXAMPLES = [
  "A restaurant website with online ordering and table booking",
  "A mobile app where gym members book classes and pay online",
  "A dashboard where managers assign tasks and track team progress",
];

const fieldBase =
  "w-full rounded-2xl border-2 bg-paper px-4 py-3.5 text-base text-ink placeholder:text-mute-light transition-[border-color,box-shadow] duration-200 focus:border-ink focus:shadow-[3px_3px_0_0_var(--color-amber)] focus:outline-none";

const panel = "rounded-2xl border-2 border-ink/15 bg-paper p-5";
const panelTitle = "mb-3 font-display text-sm font-bold tracking-tight";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AiBrief() {
  const reduceMotion = useReducedMotion();
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);

  const loading = status.state === "loading";
  const tooShort = idea.trim().length < 15;

  async function generate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    if (tooShort) {
      setStatus({ state: "error", message: "Please write a bit more about your idea (a line or two)." });
      return;
    }
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        code?: string;
        brief?: Brief;
        message?: string;
      };

      if (res.ok && body.code === "ok" && body.brief) {
        setStatus({ state: "done", brief: body.brief });
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }), 150);
        return;
      }
      if (body.code === "off_topic") {
        setStatus({
          state: "error",
          message: "That doesn't look like a website or app idea. Tell me what you'd like to build and the AI will scope it.",
        });
        return;
      }
      if (body.code === "not_configured") {
        setStatus({
          state: "error",
          message: "The AI demo isn't connected right now. Please check back later.",
        });
        return;
      }
      setStatus({
        state: "error",
        message: body.message ?? "Couldn't generate the brief just now. Please try again in a moment.",
      });
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  const grow = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="ai-demo" aria-labelledby="ai-brief-title" className="px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="ai-brief-title"
          eyebrow="Live AI Demo"
          title={
            <>
              Idea in. <Accent>Mini proposal</Accent> out.
            </>
          }
          description="A working demo of my Gemini API integration. Write two lines about an app or website idea and AI turns it into pages, features, a rough timeline and what to build first."
          className="mb-8 sm:mb-10"
        />

        <div className="rounded-[2rem] border-2 border-ink bg-cream p-6 shadow-[8px_8px_0_0_var(--color-amber)] sm:p-9">
          <form onSubmit={generate} noValidate>
            <label htmlFor="ai-brief-idea" className="mb-2 block font-display text-sm font-bold tracking-tight">
              Your idea
            </label>
            <textarea
              id="ai-brief-idea"
              rows={3}
              maxLength={MAX_IDEA}
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                if (status.state === "error") setStatus({ state: "idle" });
              }}
              placeholder="e.g. A restaurant website with online ordering and table booking"
              className={`${fieldBase} resize-y`}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-mute">Try one:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setIdea(ex)}
                    className="rounded-full border border-ink/25 px-3 py-1.5 text-left text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <p className="text-xs text-mute" aria-hidden="true">
                {idea.length}/{MAX_IDEA}
              </p>
            </div>

            {status.state === "error" && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-5 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-ink bg-amber px-7 font-display text-base font-bold shadow-[3px_3px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-ink)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_var(--color-ink)] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Reading your idea…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Generate my brief
                </>
              )}
            </button>
          </form>

          {status.state === "done" && (
            <div ref={resultRef} aria-live="polite" className="mt-8 border-t-2 border-dashed border-ink/25 pt-8">
              <motion.div {...grow(0)}>
                <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-ink px-3 py-1 text-cream">{status.brief.projectType}</span>
                  <span className="inline-flex items-center gap-1.5 text-mute">
                    <Sparkles className="h-3.5 w-3.5 text-amber-deep" aria-hidden="true" />
                    Made by AI just now. A rough estimate.
                  </span>
                </p>
                <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{status.brief.title}</h3>
                <p className="mt-2 max-w-2xl text-base text-mute">{status.brief.summary}</p>
              </motion.div>

              <motion.div {...grow(0.12)} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className={panel}>
                  <h4 className={panelTitle}>Pages and screens</h4>
                  <Bullets items={status.brief.pages} />
                </div>
                <div className={panel}>
                  <h4 className={panelTitle}>Needed for launch</h4>
                  <Bullets items={status.brief.mustHave} />
                </div>
                <div className={panel}>
                  <h4 className={panelTitle}>Can wait for later</h4>
                  <Bullets items={status.brief.later} />
                </div>
              </motion.div>

              <motion.div {...grow(0.24)} className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className={panel}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h4 className="font-display text-sm font-bold tracking-tight">Rough timeline</h4>
                    <p className="font-display text-lg font-extrabold text-amber-deep">{status.brief.totalTime}</p>
                  </div>
                  <ol className="space-y-3">
                    {status.brief.phases.map((p, i) => (
                      <li key={p.name} className="flex gap-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-cream">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-snug">
                          <span className="font-bold">{p.name}</span>
                          <span className="text-mute"> · {p.duration}</span>
                          <span className="mt-0.5 block text-mute">{p.work}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-2xl border-2 border-ink bg-amber-soft p-5">
                  <h4 className={panelTitle}>Start with this</h4>
                  <p className="text-sm leading-relaxed text-ink">{status.brief.firstStep}</p>
                </div>
              </motion.div>

              <motion.div {...grow(0.36)} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setStatus({ state: "idle" });
                    setIdea("");
                  }}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full border-2 border-ink px-6 font-display text-base font-bold transition-colors duration-300 hover:bg-ink hover:text-cream sm:w-auto"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  Try another idea
                </button>
              </motion.div>
              <p className="mt-4 text-xs text-mute">
                Generated live by the Gemini API, through a route in this site&apos;s own Next.js backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
