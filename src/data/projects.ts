import type { Project, ProjectCategory, Screen } from "@/types";

/**
 * ADD A PROJECT: append an object to `projects` below.
 *
 * - Screenshots are required: put them in /public/screenshots/<project> and set `desktopImage`
 *   (websites, AI apps) and `mobileImage` (when `hasMobileView` is true). Mobile apps
 *   need `mobileImage` and `mobileImageSecondary`. TypeScript flags any that are missing.
 * - Only fill `links.*` with real URLs. Missing links show as "coming soon".
 * - Everything below comes from details of your actual projects. Nothing is invented.
 *
 * DETAIL PAGE (/work/<slug>) — optional extras on any project:
 *   screens: {
 *     desktop: [{ src: "/projects/x.png", alt: "DriveGo checkout page", caption: "Checkout" }],
 *     mobile:  [{ src: "/projects/drivego-mobile-2.png", alt: "DriveGo booking on mobile", caption: "Booking" }],
 *   },
 *   // 5–6 second looping preview. Prefer an .mp4 (kind: "video"): it is far smaller than a .gif.
 *   demo: { src: "/projects/drivego-demo.mp4", kind: "video", poster: "/projects/drivego-desktop.jpeg", caption: "Search → book in 6 seconds" },
 *   The main desktop/mobile images above are always shown first; anything in `screens` is added after them.
 */
export const projects: Project[] = [
  {
    slug: "drivego",
    name: "DriveGo",
    category: "website",
    categories: ["website", "ai"],
    status: "Full-stack web platform",
    tagline: "An AI-powered car rental platform, deployed end to end on AWS.",
    overview:
      "A full-stack car rental platform with role-based access, vehicle management and booking, plus a Gemini AI assistant that gives personalised car recommendations from natural-language filters. Beyond the app, I containerised and deployed it on AWS with a fully automated CI/CD pipeline.",
    features: [
      "Role-based access, vehicle management and booking flow on Next.js + Express.js",
      "JWT authentication and REST APIs across a Next.js frontend and Node.js backend",
      "Gemini AI integration for personalised, filter-aware car recommendations",
      "Search, filter and sort across the cars catalogue, with reviews and email booking confirmations",
      "Redis caching and distributed locking to prevent double bookings",
      "Docker (multi-stage builds) on AWS EC2 behind an Nginx reverse proxy, with a custom domain and free SSL",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Gemini AI",
      "Redis",
      "Docker",
      "AWS EC2",
      "Nginx",
      "GitHub Actions",
    ],
    desktopImage: "/screenshots/drivego/carrentalimg.jpeg",
    mobileImage: "/screenshots/drivego/carrentalmobile.jpeg",
    hasMobileView: true,
    links: {
      live: "https://car-rental-application-gray.vercel.app/",
      repo: "https://github.com/harsh9506786",
    },
    caseStudy: {
      challenge:
        "A 1 GB t3.micro ran out of memory during Next.js production builds, so the build moved off the server: first to my machine, then to GitHub Actions runners.",
      highlights: [
        "Three Docker containers on one EC2 instance: Next.js frontend, Express backend and an Nginx reverse proxy that is the only public entry point, terminating SSL and routing / and /api/*.",
        "GitHub Actions pipeline: on every push to main it builds both images, pushes them to Docker Hub, then SSHes into EC2 to pull and restart the containers.",
        "Diagnosed a stale-deploy bug: CI images were tagged with a Docker Hub namespace while docker-compose.yml still used the old local tag, so Compose kept running old code.",
        "Redis cache-aside (5-minute TTL) for catalogue reads, and distributed locking so two users cannot book the same car at once.",
        "Fixed CORS across localhost, a raw EC2 IP, a DuckDNS domain and finally HTTPS, each of which was a new origin.",
        "The AWS instance is not kept running 24/7 to avoid billing. Happy to spin it up live during a call.",
      ],
    },
  },
  {
    slug: "shrutika",
    name: "Shrutika",
    category: "mobile",
    categories: ["mobile"],
    status: "Cross-platform mobile app",
    tagline: "A social home for reading and writing stories, in Hindi and English.",
    overview:
      "A React Native (Expo) app where users read stories across genres, publish their own and bookmark favourites, with a Node.js/Express backend handling auth, content and search. Distributed as a standalone Android APK.",
    features: [
      "Infinite-scroll story feed",
      "Follows, bookmarks and comments, with notifications",
      "Debounced search screen with genre-based discovery",
      "Hindi / English smart font detection",
      "Animated Lottie splash screen",
      "Google Sign-In and Firebase Auth with AsyncStorage persistence",
    ],
    stack: [
      "React Native",
      "Expo Router",
      "TypeScript",
      "NativeWind",
      "React Query",
      "Node.js",
      "Express",
      "MongoDB",
      "Firebase Auth",
      "Cloudinary",
    ],
    mobileImage: "/screenshots/shrutika/home.jpeg",
    mobileImageSecondary: "/screenshots/shrutika/explore.jpeg",
    hasMobileView: true,
    screens: {
      mobile: [
        { src: "/screenshots/shrutika/library.jpeg", alt: "Shrutika library screen", caption: "Library" },
        { src: "/screenshots/shrutika/profile.jpeg", alt: "Shrutika profile screen", caption: "Profile" },
        { src: "/screenshots/shrutika/storydetail.jpeg", alt: "Shrutika story detail screen", caption: "Story detail" },
        { src: "/screenshots/shrutika/write.jpeg", alt: "Shrutika write a story screen", caption: "Write" },
      ],
    },
    links: {
      repo: "https://github.com/harsh9506786/Story-App",
      download:
        "https://github.com/harsh9506786/Story-App/releases/download/v2.0.0/app-release.apk",
    },
    caseStudy: {
      challenge:
        "react-native-reanimated v4 conflicted with NativeWind (which needed v3) under Hermes/Babel, so I pinned dependency versions until both worked together.",
      highlights: [
        "Backend on Node.js/Express with MongoDB Atlas, deployed on Render, with a /health endpoint and a scheduled keep-alive ping against free-tier cold starts.",
        "Release APK built locally with Gradle (./gradlew assembleRelease) after the EAS free tier ran out, signed with my own keystore and published on GitHub Releases.",
        "Environment-aware API config switches between a local IP in development and the live Render URL in production builds.",
        "Debounced search so a request is not fired on every keystroke, plus a dedicated backend search endpoint.",
        "A full performance pass across screens and media loading.",
      ],
    },
  },
  {
    slug: "docchat",
    name: "DocChat",
    category: "ai",
    categories: ["ai"],
    status: "AI application",
    tagline: "Ask questions of any PDF and get answers grounded in the document.",
    overview:
      "An end-to-end Retrieval-Augmented Generation (RAG) app: upload a PDF and ask questions about it, with answers grounded strictly in the document rather than the model's general knowledge, to minimise hallucination.",
    features: [
      "Full RAG pipeline: PDF parsing, chunking, embeddings and cosine-similarity retrieval",
      "Gemini API for embeddings (gemini-embedding-001) and answers (gemini-2.5-flash)",
      "Prompt engineering that limits answers to the retrieved context",
      "React (Vite) chat interface that shows the matched source chunks",
    ],
    stack: ["React", "Vite", "Node.js", "Express", "Gemini API", "RAG", "Vector Search"],
    desktopImage: "/screenshots/docchat/docchat.png",
    hasMobileView: false,
    links: { repo: "https://github.com/harsh9506786/DocChat" },
    caseStudy: {
      challenge:
        "Keep answers relevant to the uploaded document instead of generic model output.",
      highlights: [
        "Documents are split into chunks and embedded once.",
        "Each question is matched to the closest chunks with cosine similarity (Top-K).",
        "Only the top matches are passed to the model as context, and the prompt tells it to answer only from them.",
      ],
    },
  },
  {
    slug: "brew-and-bliss",
    name: "Brew & Bliss",
    category: "mobile",
    categories: ["mobile"],
    status: "Flutter mobile app",
    tagline: "A coffee ordering app, built to learn Flutter beyond React Native.",
    overview:
      "A coffee-only ordering app I built in Flutter to take my frontend skills beyond React and React Native: a curated menu, favourites, orders and rewards in an animation-rich UI, with a focus on how it feels and performs.",
    features: [
      "Five tabs (Home, Menu, Orders, Favorites, Profile) with a custom floating bottom nav, animated drawer and an auto-sliding promo carousel",
      "One data file feeds Home, Menu and All Products, with category chips derived from the data",
      "Shared ChangeNotifier wishlist so hearts on Home and the Favorites tab stay in sync",
      "Custom shimmer skeleton loaders (no packages), pull-to-refresh and a pinned category bar on Menu",
      "Checkout loader that blocks double submits, and haptic feedback on key interactions",
    ],
    stack: ["Flutter", "Dart", "Material 3", "Slivers", "ChangeNotifier", "Google Fonts"],
    mobileImage: "/screenshots/breu&bliss/01-home.webp",
    mobileImageSecondary: "/screenshots/breu&bliss/02-menu.webp",
    hasMobileView: true,
    screens: {
      mobile: [
        { src: "/screenshots/breu&bliss/03-product-detail.webp", alt: "Brew & Bliss product detail screen", caption: "Product detail" },
        { src: "/screenshots/breu&bliss/04-favorites.webp", alt: "Brew & Bliss favorites screen", caption: "Favorites" },
        { src: "/screenshots/breu&bliss/05-orders.webp", alt: "Brew & Bliss orders screen", caption: "Orders" },
        { src: "/screenshots/breu&bliss/06-drawer.webp", alt: "Brew & Bliss navigation drawer", caption: "Drawer" },
      ],
    },
    links: { repo: "https://github.com/harsh9506786/Brew-Bliss" },
    caseStudy: {
      challenge:
        "The IndexedStack built all five tabs at launch and a scroll listener rebuilt the whole Home screen every frame.",
      highlights: [
        "Tabs are built lazily on first visit, then kept alive so scroll position and state survive switching.",
        "Home rebuilt as a sliver-based CustomScrollView so sections are built only as they near the viewport; scroll state moved to ValueNotifiers.",
        "A shared image widget decodes at display size, shows a shimmer, fades in and falls back to an icon on error.",
        "Traced silent drawer shortcuts to a route that bypassed the tab shell and routed everything through MainScreen.",
        "Frontend-only with local sample data. Backend, auth and payments are the natural next step.",
      ],
    },
  },
  {
    slug: "biotech",
    name: "BioTech",
    category: "website",
    categories: ["website"],
    status: "Client website",
    tagline: "Agriculture solutions and products, built for lead generation.",
    overview:
      "A website built during my internship for an agri-biotech client, showcasing their agriculture solutions and product range across agriculture and public health, with a category-wise catalogue and an enquiry system designed for lead generation.",
    features: [
      "Multi-page site (Home, Products, Public Health, Gallery, About, Contact) on the Next.js App Router with TypeScript",
      "Category-wise product catalogue (biofertilizers, biopesticides, biofungicides, bionematicides and more) with filtering and detail pages",
      "Dedicated Public Health vertical for vector-control products, with its own hero, context and strategy sections",
      "Enquiry and contact forms with Framer Motion micro-interactions",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React Icons"],
    desktopImage: "/screenshots/biotech/biotechdesktop.webp",
    mobileImage: "/screenshots/biotech/biotechmobile.webp",
    hasMobileView: true,
    links: {
      live: "https://bio-tech-xgye.vercel.app/",
      repo: "https://github.com/harsh9506786/Bio-Tech",
    },
    caseStudy: {
      challenge:
        "Present a large range of agri-biotech products clearly, and turn visitors into enquiries.",
      highlights: [
        "Products grouped by type with filtering and dedicated detail pages.",
        "A separate Public Health vertical for vector-control products.",
        "Enquiry and contact forms built for lead generation.",
      ],
    },
  },
  {
    slug: "agnee",
    name: "Agnee",
    category: "website",
    categories: ["website"],
    status: "Agency website",
    tagline: "Website for an AI-driven branding and growth agency.",
    overview:
      "The marketing website for the agency I interned with, an AI-driven branding and growth agency. Beyond building the frontend, I containerised and deployed the app myself, setting up the full path from code to production server.",
    features: [
      "Hero, services, team, testimonials and contact sections",
      "Custom Three.js hero animation",
      "Framer Motion transitions across the site",
      "Dockerised build, deployed on AWS EC2",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
      "Docker",
      "AWS EC2",
      "GitHub Actions",
    ],
    desktopImage: "/screenshots/agnee/desktopview.jpeg",
    mobileImage: "/screenshots/agnee/mobileview.jpeg",
    hasMobileView: true,
    links: {
      live: "https://www.agneeagency.com/",
      repo: "https://github.com/harsh9506786/agnee-web1",
    },
    caseStudy: {
      highlights: [
        "Containerised with Docker for a consistent, reproducible build.",
        "Production build served from an AWS EC2 instance.",
        "GitHub Actions pipeline automates builds and deployments on every push.",
      ],
    },
  },
  // User & Task Manager is ready to add once its screenshots are in
  // /public/screenshots/user-task-manager/ (a desktop image is required).
  // Then remove the comment markers below.
  // {
  //   slug: "user-task-manager",
  //   name: "User & Task Manager",
  //   category: "website",
  //   categories: ["website"],
  //   status: "SaaS dashboard",
  //   tagline: "Role-based dashboard where admins assign work and employees track it.",
  //   overview:
  //     "A role-based SaaS dashboard where admins manage team members and assign tasks, " +
  //     "while employees track and update their own work in real time.",
  //   features: [
  //     "Firebase Authentication with Admin / Employee roles and protected routes",
  //     "Admin dashboard: search users, manage roles, assign tasks, live stats",
  //     "Employee dashboard: real-time task tracking, mark complete, delete, filter by title",
  //     "Firestore real-time sync with a Material UI + Tailwind CSS interface",
  //   ],
  //   stack: ["React", "Vite", "Firebase Auth", "Firestore", "Material UI", "Tailwind CSS"],
  //   desktopImage: "/screenshots/user-task-manager/desktop.png",
  //   hasMobileView: false,
  //   links: {
  //     live: "https://uand-t-saa-s-system.vercel.app/",
  //     repo: "https://github.com/harsh9506786/UandT-SaaS-system",
  //   },
  //   caseStudy: {
  //     highlights: [
  //       "Role-based access control for Admin and Employee accounts.",
  //       "Real-time data sync with Firestore.",
  //     ],
  //   },
  // },
];

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All Projects" },
  { id: "website", label: "Websites" },
  { id: "mobile", label: "Mobile Applications" },
  { id: "ai", label: "AI Apps" },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  website: "Website",
  mobile: "Mobile App",
  ai: "AI App",
};

/* ——— Helpers used by the cards and the detail pages ——— */

export interface ProjectTone {
  hex: string;
  dark: boolean;
  bg: string;
  ring: string;
}

/** Card/detail colours, assigned by position so the transition colour always matches the card. */
export const projectTones: ProjectTone[] = [
  { hex: "#f59e0b", dark: false, bg: "bg-amber", ring: "border-ink/20" },
  { hex: "#261f19", dark: true, bg: "bg-ink-soft", ring: "border-amber/40" },
  { hex: "#fcd68a", dark: false, bg: "bg-amber-soft", ring: "border-ink/20" },
  { hex: "#e3d9c3", dark: false, bg: "bg-[#e3d9c3]", ring: "border-ink/20" },
];

export const toneFor = (index: number): ProjectTone => projectTones[index % projectTones.length];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function getProjectNeighbours(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  const count = projects.length;
  return {
    index,
    prev: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}

/** Every screenshot of a project: the primary images first, then anything added under `screens`. */
export function getScreens(p: Project): { desktop: Screen[]; mobile: Screen[] } {
  const desktop: Screen[] = [];
  const mobile: Screen[] = [];

  if (p.category === "mobile") {
    mobile.push({ src: p.mobileImage, alt: `${p.name} on mobile`, caption: "Screen 1" });
    mobile.push({ src: p.mobileImageSecondary, alt: `${p.name} on mobile, second screen`, caption: "Screen 2" });
  } else {
    desktop.push({ src: p.desktopImage, alt: `${p.name} on desktop`, caption: "Main screen" });
    if (p.hasMobileView) {
      mobile.push({ src: p.mobileImage, alt: `${p.name} on mobile`, caption: "Mobile view" });
    }
  }

  const seen = new Set([...desktop, ...mobile].map((s) => s.src));
  for (const s of p.screens?.desktop ?? []) {
    if (!seen.has(s.src)) {
      desktop.push(s);
      seen.add(s.src);
    }
  }
  for (const s of p.screens?.mobile ?? []) {
    if (!seen.has(s.src)) {
      mobile.push(s);
      seen.add(s.src);
    }
  }
  return { desktop, mobile };
}
