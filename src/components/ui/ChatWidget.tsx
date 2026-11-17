"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Send, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/config";

type Message = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the AI assistant of this website. Ask me about Harshvardhan's skills, projects or experience.";

const SUGGESTIONS = [
  "What are your strongest skills?",
  "Tell me about your best project",
  "What's your work experience?",
];

const MAX_INPUT = 500;
const HINT_KEY = "ai-assistant-hint-seen";

/** Turns plain-text URLs in an answer into links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-deep underline underline-offset-2 break-all"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * The little robot. With `animated` it blinks, its antenna glows, and the sparkle twinkles.
 * Pass `still` (reduced motion) to draw it without any movement.
 */
function AiBotIcon({
  className,
  animated = false,
  still = false,
}: {
  className?: string;
  animated?: boolean;
  still?: boolean;
}) {
  const move = animated && !still;
  const box = { transformBox: "fill-box", transformOrigin: "center" } as const;

  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      {/* sparkle */}
      <motion.path
        d="M31 3.5 32.4 7.1 36 8.5 32.4 9.9 31 13.5 29.6 9.9 26 8.5 29.6 7.1Z"
        fill="#ffffff"
        style={box}
        animate={move ? { scale: [1, 1.35, 1], rotate: [0, 20, 0], opacity: [0.9, 1, 0.9] } : undefined}
        transition={move ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      {/* antenna */}
      <line x1="20" y1="7.8" x2="20" y2="11.5" stroke="#17130f" strokeWidth="2" strokeLinecap="round" />
      <motion.circle
        cx="20"
        cy="6"
        r="2.3"
        fill="#ffffff"
        stroke="#17130f"
        strokeWidth="1.6"
        style={box}
        animate={move ? { scale: [1, 1.35, 1] } : undefined}
        transition={move ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      {/* ears */}
      <rect x="3.5" y="18" width="3.5" height="7.5" rx="1.75" fill="#17130f" />
      <rect x="33" y="18" width="3.5" height="7.5" rx="1.75" fill="#17130f" />
      {/* head */}
      <rect x="7" y="11" width="26" height="21" rx="8" fill="#fdf9f3" stroke="#17130f" strokeWidth="2" />
      {/* cheeks */}
      <ellipse cx="11.4" cy="25.4" rx="2" ry="1.2" fill="#f59e0b" opacity="0.55" />
      <ellipse cx="28.6" cy="25.4" rx="2" ry="1.2" fill="#f59e0b" opacity="0.55" />
      {/* eyes (blink) */}
      <motion.g
        style={box}
        animate={move ? { scaleY: [1, 1, 0.1, 1, 1] } : undefined}
        transition={move ? { duration: 4, repeat: Infinity, times: [0, 0.88, 0.93, 0.98, 1] } : undefined}
      >
        <ellipse cx="14.5" cy="20.4" rx="2.2" ry="2.8" fill="#17130f" />
        <ellipse cx="25.5" cy="20.4" rx="2.2" ry="2.8" fill="#17130f" />
        <circle cx="15.2" cy="19.3" r="0.8" fill="#ffffff" />
        <circle cx="26.2" cy="19.3" r="0.8" fill="#ffffff" />
      </motion.g>
      {/* smile */}
      <path d="M16.5 25.6Q20 29.2 23.5 25.6" stroke="#17130f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ChatWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Keep the newest text in view while the answer streams in.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  // A small "Ask me anything" bubble that shows once per visit, a few seconds after load.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(HINT_KEY) === "1";
    } catch {
      /* storage can be blocked: just show the bubble */
    }
    if (seen) return;
    const show = window.setTimeout(() => setHint(true), 3500);
    const hide = window.setTimeout(() => {
      setHint(false);
      try {
        sessionStorage.setItem(HINT_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 10500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  function toggle() {
    setOpen((v) => !v);
    setHint(false);
    try {
      sessionStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const history: Message[] = [...messages, { role: "user", content: text }];
    // The empty assistant message is filled in as the answer streams.
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setMessages(history);
        setError(
          res.status === 429
            ? "You've sent a lot of messages. Please try again a little later."
            : res.status === 503
              ? "The assistant is not available right now."
              : "Something went wrong. Please try again.",
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }

      if (!answer.trim()) {
        setMessages(history);
        setError("I couldn't get an answer. Please try again.");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages(history);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = messages.length === 0;
  const still = Boolean(reduceMotion);

  return (
    <>
      {/* Launcher: sits right above the WhatsApp button */}
      <motion.div
        className="group fixed right-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] z-50 sm:right-6 sm:bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+4.75rem)]"
        initial={still ? false : { opacity: 0, scale: 0.4, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 260, damping: 18 }}
      >
        {/* "Ask me anything" bubble */}
        <AnimatePresence>
          {hint && !open && (
            <motion.span
              role="status"
              initial={still ? false : { opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="pointer-events-none absolute top-1/2 right-[calc(100%+0.75rem)] -translate-y-1/2 rounded-2xl rounded-br-sm border-2 border-ink bg-cream px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-ink shadow-[3px_3px_0_0_var(--color-ink)]"
            >
              Hi! Ask me anything
            </motion.span>
          )}
        </AnimatePresence>

        {/* Label on hover, like the WhatsApp button */}
        {!hint && !open && (
          <span
            role="tooltip"
            className="pointer-events-none absolute top-1/2 right-[calc(100%+0.75rem)] hidden -translate-y-1/2 translate-x-2 rounded-full bg-ink px-4 py-2 text-sm font-medium whitespace-nowrap text-cream opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
          >
            Ask my AI assistant
          </span>
        )}

        {/* gently floats up and down */}
        <motion.div
          animate={still || open ? undefined : { y: [0, -5, 0] }}
          transition={still || open ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* and gives a little wave every few seconds */}
          <motion.button
            type="button"
            onClick={toggle}
            aria-label={open ? "Close the AI assistant" : "Open the AI assistant"}
            aria-expanded={open}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            animate={still || open ? undefined : { rotate: [0, -10, 10, -7, 7, 0] }}
            transition={
              still || open
                ? undefined
                : { rotate: { duration: 0.9, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" } }
            }
            className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-amber text-ink shadow-[3px_3px_0_0_var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-deep sm:h-16 sm:w-16"
          >
            {!open && (
              <span
                className="animate-pulse-ring absolute inset-0 -z-10 rounded-full bg-amber"
                aria-hidden="true"
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="bot"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <AiBotIcon animated still={still} className="h-9 w-9 sm:h-10 sm:w-10" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI assistant"
            initial={still ? false : { opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed right-3 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.5rem)] z-50 flex h-[min(34rem,calc(100dvh-11rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-[6px_6px_0_0_rgba(23,19,15,0.9)] sm:right-6 sm:bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+9.5rem)] sm:h-[min(34rem,calc(100dvh-12rem))]"
          >
            <div className="flex items-center gap-3 border-b-2 border-ink bg-ink px-4 py-3 text-cream">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-amber">
                <AiBotIcon animated still={still} className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">AI Assistant</p>
                <p className="text-[11px] leading-tight text-cream/60">Answers about Harshvardhan&apos;s work</p>
              </div>
              <button
                type="button"
                onClick={toggle}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-cream/70 hover:bg-cream/10 hover:text-cream"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={listRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm leading-relaxed"
            >
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-ink/10 bg-paper px-3.5 py-2.5 text-ink">
                {GREETING}
              </div>

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-amber px-3.5 py-2.5 font-medium whitespace-pre-wrap text-ink"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="max-w-[90%] rounded-2xl rounded-tl-sm border border-ink/10 bg-paper px-3.5 py-2.5 whitespace-pre-wrap text-ink"
                  >
                    {m.content ? (
                      <Linkified text={m.content} />
                    ) : (
                      <span className="inline-flex gap-1" aria-label="Typing">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                ),
              )}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-amber"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-ink/15 bg-paper px-3 py-2 text-xs text-ink">
                  {error}{" "}
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-amber-deep underline underline-offset-2"
                  >
                    Message on WhatsApp
                  </a>
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t-2 border-ink bg-paper p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_INPUT}
                  placeholder="Ask a question..."
                  aria-label="Your question"
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-full border-2 border-ink bg-cream px-4 py-2 text-sm text-ink outline-none placeholder:text-mute focus-visible:border-amber-deep disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || input.trim().length === 0}
                  aria-label="Send"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-cream transition-colors hover:bg-amber hover:text-ink disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-mute">
                AI assistant: answers may be imperfect. To reach Harshvardhan, use the contact form.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
