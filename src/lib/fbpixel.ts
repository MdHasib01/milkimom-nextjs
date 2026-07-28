/**
 * Meta (Facebook) Pixel helpers.
 *
 * The base pixel and the initial PageView are injected once from the root
 * layout by <MetaPixel />. Conversion events are fired by the component that
 * owns the action — the order form fires Purchase only after
 * POST /api/orders responds 201.
 */

export const FB_PIXEL_ID: string =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1067546575776185";

/**
 * Amount reported with Purchase. There is no payment gateway on the site — a
 * confirmed order landing in the dashboard is what counts as a purchase — so
 * the value is reported as 0. Change these two constants to report the real
 * order amount instead (e.g. singleJarPrice.salePrice / "BDT").
 */
export const PURCHASE_VALUE = 0.0;
export const PURCHASE_CURRENCY = "USD";

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
 * Fires the Purchase conversion. Call this only once the backend has
 * confirmed the order (HTTP 201 from POST /api/orders).
 */
export function trackPurchase(params?: Record<string, unknown>) {
  trackFbEvent("Purchase", {
    value: PURCHASE_VALUE,
    currency: PURCHASE_CURRENCY,
    ...params,
  });
}
