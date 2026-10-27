import type { MetadataRoute } from "next";
import { config } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Staff dashboard, API proxy, and per-order pages that render customer
      // names, phones and addresses — none of these belong in search results.
      disallow: ["/admin", "/api/", "/invoice", "/thank-you", "/track/"],
    },
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
