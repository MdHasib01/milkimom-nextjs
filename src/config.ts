/**
 * Site configuration — every knob you are meant to edit, in one file.
 *
 * This project ships without .env files on purpose. None of these values are
 * secrets (each one reaches the browser anyway), and keeping them in source
 * means they are diffable, reviewable, and identical in dev and production
 * instead of depending on what a host happens to have set. Real secrets belong
 * to the API server, not here — never put a credential in this file.
 *
 * next.config.ts imports this module too, so it must stay free of imports and
 * side effects.
 *
 * Deliberately not `as const`: these are settings meant to be edited, and
 * literal types would make e.g. `motherCount.fallback` typed `89746` rather
 * than `number`, which breaks the moment a value is used as component state.
 */
export const config = {
  /**
   * The backend API. Changing this line moves every request in the app: the
   * `/api/:path*` rewrite in next.config.ts and the mother-count route handler
   * both read it from here.
   *
   * No trailing slash — paths are appended directly.
   */
  backendOrigin: "https://milkimomapi.mdhasib.xyz",

  /**
   * Public origin of this site, used as the base for canonical URLs and social
   * card metadata. It serves from www; pointing metadata at the apex sends
   * every social crawler and ad-platform prefetch through a redirect hop first.
   */
  siteUrl: "https://www.milkimom.com",

  /** Brand identity. Merged into `siteConfig` in lib/content.ts. */
  brand: {
    name: "মিল্কিমম",
    nameEn: "Milkimom",
    tagline: "Make Mother Great Again",
  },

  /**
   * Where customers reach you. Rendered in the header, footer, floating call
   * button, order confirmations and the printed invoice — update here and every
   * surface follows.
   */
  contact: {
    /** Dialed by tel: links, so it needs the country code. */
    phone: "+8801517102603",
    /** Shown on screen. Free-form — formatting is copied verbatim. */
    phoneDisplay: "01517-102603",
    messenger: "https://www.facebook.com/milkimom?_rdr",
    email: "milkimominfo@gmail.com",
    address: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
  },

  /**
   * Product pricing, in BDT. `regularPrice` is the struck-through number shown
   * next to `salePrice`, and `salePrice` is what gets submitted with the order
   * and reported to the Meta Pixel.
   */
  pricing: {
    regularPrice: 8990,
    salePrice: 4990,
    /** Doses per jar, quoted next to the price. */
    perJarDays: 15,
  },

  analytics: {
    /** Meta (Facebook) Pixel. Empty string is not supported — remove <MetaPixel /> instead. */
    facebookPixelId: "1067546575776185",
    /** Microsoft Clarity project. */
    clarityProjectId: "xtgst4xcr4",

    /*
     * The Meta `Purchase` event is NOT fired from the browser. Orders can be
     * fake or get cancelled after confirmation/shipping, so the server reports
     * Purchase (with the real order value in BDT) via the Meta Conversions API
     * only when an order is marked Delivered — see server/utils/metaCapi.js.
     * The browser fires InitiateCheckout on successful order submission.
     */

    /**
     * Route prefixes third-party analytics must never run on. The admin
     * dashboard is staff-only and its pages render customer names, phone
     * numbers and addresses — it stays out of ad tracking and session
     * recordings.
     */
    excludedPathPrefixes: ["/admin"],
  },

  motherCount: {
    /** Shown until the API answers, and kept if it never does. */
    fallback: 89746,
    /**
     * How long the browser reuses one fetched count across the three sections
     * that display it. The number moves on a slow cron tick upstream, so
     * minutes of staleness cost nothing.
     */
    clientTtlSeconds: 300,
    /**
     * Edge cache for the same-origin proxy route. Kept short only so a manual
     * admin edit (PUT /api/stats/mother-count) shows up reasonably soon.
     */
    edgeCacheSeconds: 300,
    /** Upstream is down — cache the fallback briefly so a blip is not pinned for the full window. */
    errorCacheSeconds: 30,
  },
};
