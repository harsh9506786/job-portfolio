import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

/** Section ids observed for the active nav indicator, in page order. */
export const sectionIds = [
  "home",
  "services",
  "about",
  "start",
  "work",
  "skills",
  "experience",
  "ai-demo",
  "contact",
] as const;

/** Sections that don't have their own nav link map to the closest one. */
export const sectionToNav: Record<string, string> = {
  home: "home",
  services: "home",
  about: "about",
  start: "about",
  work: "work",
  skills: "work",
  experience: "experience",
  "ai-demo": "experience",
  contact: "contact",
};
