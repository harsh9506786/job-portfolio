/**
 * Lets other sections (e.g. the AI Project Brief) fill in the contact form.
 * The brief sets a pending value and fires an event; the form applies it, even if the form
 * finished loading after the event was fired.
 */
export const CONTACT_PREFILL_EVENT = "contact:prefill";

export interface ContactPrefill {
  projectType?: string;
  details?: string;
}

declare global {
  interface Window {
    __contactPrefill?: ContactPrefill;
  }
}

export function prefillContact(data: ContactPrefill) {
  window.__contactPrefill = data;
  window.dispatchEvent(new CustomEvent(CONTACT_PREFILL_EVENT));
}

export function takePendingPrefill(): ContactPrefill | undefined {
  const data = window.__contactPrefill;
  delete window.__contactPrefill;
  return data;
}
