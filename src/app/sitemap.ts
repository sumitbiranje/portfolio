import type { MetadataRoute } from "next";
import { SITE_URL, projects } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
