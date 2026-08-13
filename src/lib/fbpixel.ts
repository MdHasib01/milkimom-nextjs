/**
 * Meta (Facebook) Pixel helpers.
 *
 * The base pixel and the initial PageView are injected once from the root
 * layout by <MetaPixel />. The browser never fires Purchase: submitting the
 * order form fires InitiateCheckout and the thank-you page fires Lead, because
 * a freshly placed order may still be fake or get cancelled. The real Purchase
 * is reported server-side via the Meta Conversions API once an admin confirms
 * the order in the dashboard (see server/utils/metaCapi.js).
 */

import { getAttribution } from "./attribution";

export const FB_PIXEL_ID: string =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1067546575776185";

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Fires a standard Meta Pixel event. No-op if the pixel has not loaded. */
export function trackFbEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

export function trackPageView() {
  trackFbEvent("PageView");
}

/**
 * Fires InitiateCheckout once the backend accepts the order (HTTP 201 from
 * POST /api/orders). This keeps a browser-side mid-funnel signal for Meta
 * while the actual Purchase waits for delivery confirmation.
 */
export function trackInitiateCheckout(params?: Record<string, unknown>) {
  trackFbEvent("InitiateCheckout", params);
}

/**
 * Fires Lead on the thank-you page — the order exists but is not yet a
 * confirmed sale. Gives Meta a same-session conversion signal to optimize on
 * while Purchase waits on admin confirmation.
 */
export function trackLead(params?: Record<string, unknown>) {
  trackFbEvent("Lead", params);
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Browser identifiers sent along with the order so the server-side Purchase
 * (fired on confirmation, days later) can still be matched to this browser and
 * the ad click.
 *
 * `_fbc` only exists after an ad click. When the cookie is missing it is
 * rebuilt in the `fb.1.<click_time_ms>.<fbclid>` format Meta expects, from the
 * fbclid captured on the *landing* page — not from the current URL, which by
 * checkout time has usually lost the query string. The timestamp is the real
 * landing time for the same reason.
 */
export function getFbBrowserIds(): { fbp: string; fbc: string } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc) {
    const attribution = getAttribution();
    const clickMs = attribution?.firstSeenAt
      ? Date.parse(attribution.firstSeenAt)
      : NaN;

    if (attribution?.fbclid && Number.isFinite(clickMs)) {
      fbc = `fb.1.${clickMs}.${attribution.fbclid}`;
    }
  }

  return { fbp, fbc };
}
