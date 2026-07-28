"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { isAnalyticsExcluded } from "@/lib/analytics";
import { FB_PIXEL_ID, trackPageView } from "@/lib/fbpixel";

/**
 * Base Meta Pixel: loads fbevents.js, inits the pixel and tracks PageView.
 * Mounted once in the root layout. The admin dashboard is excluded so staff
 * traffic does not pollute the ad data.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const isAdmin = isAnalyticsExcluded(pathname);

  // The inline snippet tracks the first PageView itself, so only client-side
  // route changes after it need one.
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (isAdmin) return;
    if (lastTracked.current === null) {
      lastTracked.current = pathname;
      return;
    }
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackPageView();
  }, [pathname, isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
