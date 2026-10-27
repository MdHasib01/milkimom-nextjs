import type { MetadataRoute } from "next";
import { config } from "@/config";
import { OG_IMAGE } from "@/lib/seo";

// Only the indexable landing pages. /milkready and /smoothflow redirect to
// their own subdomains, so they are left to those sites.
export default function sitemap(): MetadataRoute.Sitemap {
  const images = [`${config.siteUrl}${OG_IMAGE.url}`, `${config.siteUrl}/images/product-jar.webp`];

  return [
    {
      url: config.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
    {
      url: `${config.siteUrl}/milkimom`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images,
    },
  ];
}
