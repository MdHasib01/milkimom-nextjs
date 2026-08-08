/**
 * Meta (Facebook) Pixel helpers.
 *
 * The base pixel and the initial PageView are injected once from the root
 * layout by <MetaPixel />. The browser never fires Purchase: submitting the
 * order form only fires InitiateCheckout, because a freshly placed order may
 * still be fake or get cancelled. The real Purchase is reported server-side
 * via the Meta Conversions API when the order is marked Delivered in the
 * admin dashboard (see server/utils/metaCapi.js).
 */

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

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Browser identifiers sent along with the order so the server-side Purchase
 * (fired on delivery, days later) can still be matched to this browser and
 * the ad click. `_fbc` only exists after an ad click (fbclid); when the
 * cookie is missing but fbclid is in the URL, it is reconstructed in the
 * `fb.1.<timestamp>.<fbclid>` format Meta expects.
 */
export function getFbBrowserIds(): { fbp: string; fbc: string } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp, fbc };
}
