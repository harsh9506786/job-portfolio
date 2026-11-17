import { Brain, Cloud, Code, Database, Layout, Network, Server } from "lucide-react";
import type { SkillGroup } from "@/types";

/** `familiar: true` marks working knowledge (shown with a dashed outline). */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: Layout,
    items: [
      { name: "React.js", short: "Re" },
      { name: "Next.js", short: "Nx" },
      { name: "React Native", short: "RN" },
      { name: "HTML/CSS", short: "Ht" },
      { name: "Tailwind CSS", short: "Tw" },
      { name: "Flutter", short: "Fl", familiar: true },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: Server,
    items: [
      { name: "Node.js", short: "No" },
      { name: "Express.js", short: "Ex" },
      { name: "REST APIs", short: "Rs" },
      { name: "GraphQL", short: "Gq" },
      { name: "Firebase", short: "Fb" },
    ],
  },
  {
    id: "ai",
    title: "AI / GenAI",
    icon: Brain,
    items: [
      { name: "Gemini API", short: "Ge" },
      { name: "RAG", short: "Rg" },
      { name: "Embeddings", short: "Em" },
      { name: "Vector Search", short: "Vs" },
      { name: "Prompt Engineering", short: "Pe" },
    ],
  },
  {
    id: "database",
    title: "Databases",
    icon: Database,
    items: [
      { name: "MongoDB", short: "Mo" },
      { name: "MySQL", short: "My" },
      { name: "Redis", short: "Rd" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: Cloud,
    items: [
      { name: "AWS (EC2, S3, IAM, CloudFront)", short: "Aw" },
      { name: "Docker", short: "Dk" },
      { name: "GitHub Actions", short: "GA" },
      { name: "Vercel", short: "Ve" },
      { name: "Railway", short: "Ry" },
      { name: "Render", short: "Rn" },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    icon: Network,
    items: [
      { name: "Load Balancing", short: "Lb" },
      { name: "Caching", short: "Ca" },
      { name: "DB Sharding", short: "Sh" },
      { name: "Replication", short: "Rp" },
      { name: "CAP Theorem", short: "Cp" },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    icon: Code,
    items: [
      { name: "JavaScript", short: "JS" },
      { name: "TypeScript", short: "TS" },
      { name: "Python", short: "Py" },
      { name: "C++", short: "C+" },
      { name: "Dart", short: "Da", familiar: true },
    ],
  },
];
