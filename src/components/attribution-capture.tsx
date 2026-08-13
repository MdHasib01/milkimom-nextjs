"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { isAnalyticsExcluded } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records the ad click that brought the visitor in, as early as possible.
 *
 * Mounted once in the root layout, alongside <MetaPixel />. It has to run
 * before any client-side navigation drops the query string, because the
 * Purchase this eventually attributes is not sent until an admin confirms the
 * order — long after the URL is gone. The admin dashboard is excluded so staff
 * traffic never overwrites a real visitor's stored attribution.
 */
export function AttributionCapture() {
  const pathname = usePathname();
  const isAdmin = isAnalyticsExcluded(pathname);

  useEffect(() => {
    if (isAdmin) return;
    captureAttribution();
  }, [pathname, isAdmin]);

  return null;
}
