import { Award, Cloud, Layout, Network, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Current employer. The bullets below describe the work done there. */
export const job = {
  title: "Full Stack Developer",
  company: "Printonia Soft",
  place: "Pune (Remote)",
  roles: [
    { period: "July 2026 – Present", title: "Full Stack Developer" },
    { period: "July 2025 – June 2026", title: "Full Stack Developer Intern" },
  ],
  points: [
    "Built and shipped features for both web and mobile applications using React.js, Next.js, React Native, Node.js, and Express.js, working across the full stack from UI to backend APIs.",
    "Contributed directly to live, production-grade projects: writing, testing, and deploying code that real users interacted with, not just isolated demos or prototypes.",
    "Implemented JWT-based authentication and secure REST APIs, handling session management, protected routes, and role-based access across both web and mobile clients.",
    "Worked across the complete development lifecycle: frontend UI, backend integration, database design, and production optimization for performance and reliability.",
    "Containerized services with Docker and deployed applications on AWS, ensuring consistent environments from local development through to production.",
    "Built and maintained CI/CD pipelines using GitHub Actions to automate testing and deployment, reducing manual release effort and catching issues before they reached production.",
    "Collaborated closely with cross-functional teams (design, backend, and product) in an agile workflow to plan, build, and ship scalable features on schedule.",
  ],
};

export const achievements: { icon: LucideIcon; text: string }[] = [
  {
    icon: Award,
    text: "Consistent competitive programmer: solved 150+ DSA problems on LeetCode, sharpening problem-solving speed and interview readiness.",
  },
  {
    icon: Layout,
    text: "Designs and builds pixel-perfect, fully responsive web interfaces with React and Next.js, optimized for performance across devices.",
  },
  {
    icon: Smartphone,
    text: "Ships production-ready, cross-platform mobile applications using React Native, from UI to backend integration.",
  },
  {
    icon: Cloud,
    text: "Owns the full deployment pipeline: containerizing apps with Docker, hosting on AWS EC2, and automating releases with GitHub Actions CI/CD.",
  },
  {
    icon: Network,
    text: "Applies core System Design principles (load balancing, caching, database sharding and replication) to architect systems that scale.",
  },
];
