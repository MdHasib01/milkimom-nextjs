"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

import { isAnalyticsExcluded } from "@/lib/analytics";

export const CLARITY_PROJECT_ID: string =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "xtgst4xcr4";

/**
 * Microsoft Clarity — heatmaps and session recordings. Mounted once in the
 * root layout. Clarity tracks route changes on its own, so unlike the Meta
 * Pixel it needs no per-navigation call.
 */
export function ClarityAnalytics() {
  const pathname = usePathname();
  if (isAnalyticsExcluded(pathname)) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
