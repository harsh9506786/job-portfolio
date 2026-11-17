import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export function buildMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
    creator: siteConfig.fullName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/** Person structured data. */
export function buildJsonLd() {
  const sameAs = siteConfig.socials.map((s) => s.href);
  const personId = `${siteConfig.url}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.fullName,
        alternateName: siteConfig.name,
        jobTitle: siteConfig.jobTitle,
        url: siteConfig.url,
        description: siteConfig.description,
        knowsAbout: [
          "Full stack development",
          "React",
          "Next.js",
          "React Native",
          "Node.js",
          "AWS",
          "Docker",
          "Retrieval-augmented generation",
        ],
        worksFor: { "@type": "Organization", name: "Printonia Soft" },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
    ],
  };
}
