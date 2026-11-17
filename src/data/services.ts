import { Bot, Globe, Smartphone } from "lucide-react";
import type { Service } from "@/types";

export const servicesIntro =
  "From database schema to deployment pipeline, I own features across the full stack, not just one layer.";

export const services: Service[] = [
  {
    id: "websites",
    index: "01",
    title: "Full-Stack Web Development",
    tagline: "From the UI to the API to the database.",
    description:
      "Fast, responsive web applications built with React and Next.js on the front end, and Node.js and Express APIs behind them.",
    capabilities: [
      "React.js & Next.js",
      "Node.js & Express.js REST APIs",
      "JWT authentication & role-based access",
      "MongoDB, MySQL & Redis",
      "Responsive, performance-minded interfaces",
    ],
    tone: "cream",
    icon: Globe,
  },
  {
    id: "mobile",
    index: "02",
    title: "Mobile App Development",
    tagline: "One codebase, native feel.",
    description:
      "Cross-platform apps built with React Native (Expo) and Flutter, connected to Node.js backends and shipped as real installable builds.",
    capabilities: [
      "React Native (Expo)",
      "Flutter & Dart",
      "Firebase Authentication",
      "Android APK builds & distribution",
      "App performance optimisation",
    ],
    tone: "dark",
    icon: Smartphone,
  },
  {
    id: "ai",
    index: "03",
    title: "AI Integration & Deployment",
    tagline: "LLM features grounded in real data, shipped properly.",
    description:
      "RAG pipelines and Gemini API integrations that answer from a document instead of guessing, plus the Docker, AWS and CI/CD setup to get them live.",
    capabilities: [
      "RAG: chunking, embeddings and cosine-similarity retrieval",
      "Gemini API integration",
      "Prompt engineering to reduce hallucination",
      "Docker & AWS EC2 deployment",
      "CI/CD with GitHub Actions",
    ],
    tone: "orange",
    icon: Bot,
  },
];
