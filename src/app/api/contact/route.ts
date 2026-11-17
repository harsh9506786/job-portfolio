import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { validateContact, type ContactValues } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Contact form endpoint.
 *
 * Environment variables (see .env.example):
 *   RESEND_API_KEY      REQUIRED. API key from https://resend.com
 *   CONTACT_TO_EMAIL    Optional. Where enquiries are delivered (default: the contact email in lib/config.ts)
 *   CONTACT_FROM_EMAIL  Optional. Sender address (default: Resend's onboarding@resend.dev, which can
 *                       only deliver to the email you signed up to Resend with)
 *
 *   N8N_WEBHOOK_URL     Optional. n8n Webhook URL. Every enquiry is also POSTed there so n8n can
 *                       append it to a Google Sheet. If it is not set, nothing is sent to n8n.
 *   N8N_WEBHOOK_SECRET  Optional. Sent as the `x-webhook-secret` header (use n8n Header Auth).
 *
 * The enquiry counts as received if the email OR the n8n save worked. If both fail, the route
 * answers 502 and the form says the message was not sent.
 *
 * Without RESEND_API_KEY the route answers 503 `not_configured`, and the form says so
 * honestly. It never pretends a message was sent.
 *
 * Spam protection: honeypot field, minimum-fill-time check, same-origin check, body-size
 * cap, strict validation and a per-IP rate limit. For stronger protection add a CAPTCHA
 * such as Cloudflare Turnstile and verify its token here.
 */

const MAX_BODY_BYTES = 12_000;
const MIN_FILL_MS = 2_500;
const RATE_LIMIT = 5; // requests
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

// In-memory limiter: fine for a single instance. Use Redis/Upstash for multi-instance deploys.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Same-origin only
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ code: "forbidden" }, 403);
    } catch {
      return json({ code: "forbidden" }, 403);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return json({ code: "rate_limited", message: "Too many messages. Please try again later." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ code: "too_large" }, 413);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ code: "bad_request" }, 400);
  }

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const values: ContactValues = {
    name: str(data.name),
    email: str(data.email),
    phone: str(data.phone),
    projectType: str(data.projectType),
    details: str(data.details),
  };

  // Honeypot: only bots fill this hidden field. Drop silently and send nothing.
  if (str(data.company) !== "") return json({ code: "ok" }, 200);

  // Submitted faster than a human could type: ask for a retry rather than pretend success.
  const elapsed = Number(data.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json({ code: "too_fast" }, 422);
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return json({ code: "invalid", errors }, 422);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  if (!apiKey || !to) return json({ code: "not_configured" }, 503);

  const html = `
    <h2>New portfolio enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
    <p><strong>Contact number:</strong> ${escapeHtml(values.phone.trim())}</p>
    <p><strong>Reaching out about:</strong> ${escapeHtml(values.projectType)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(values.details.trim() || "No message provided")}</p>`;

  // Email to the owner. Returns true when Resend accepted it.
  async function sendEmail(): Promise<boolean> {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: values.email.trim(),
          subject: `Portfolio enquiry (${values.projectType}) from ${values.name.trim().slice(0, 60)}`,
          html,
        }),
      });
      if (!res.ok) {
        // Visible in the host's function logs (Netlify: Logs → Functions) to debug delivery problems.
        console.error("Resend rejected the email:", res.status, await res.text().catch(() => ""));
        return false;
      }
      return true;
    } catch (err) {
      console.error("Could not reach Resend:", err);
      return false;
    }
  }

  // Save the enquiry through n8n (-> Google Sheet). Returns true when n8n accepted it.
  async function saveToSheet(): Promise<boolean> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) return false;
    // A cell that starts with = @ or - could run as a formula in a spreadsheet: neutralise it.
    const cell = (v: string) => (/^[=@\-\t\r]/.test(v) ? `'${v}` : v);
    const secret = process.env.N8N_WEBHOOK_SECRET;
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-webhook-secret": secret } : {}),
        },
        body: JSON.stringify({
          submittedAt: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }),
          name: cell(values.name.trim()),
          email: cell(values.email.trim()),
          phone: values.phone.trim(),
          projectType: cell(values.projectType),
          details: cell(values.details.trim()),
          source: "portfolio-contact-form",
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) {
        console.error("n8n rejected the enquiry:", res.status, await res.text().catch(() => ""));
        return false;
      }
      return true;
    } catch (err) {
      console.error("Could not reach n8n:", err);
      return false;
    }
  }

  const [emailed, saved] = await Promise.all([sendEmail(), saveToSheet()]);
  if (emailed || saved) return json({ code: "ok" }, 200);
  return json({ code: "send_failed" }, 502);
}
