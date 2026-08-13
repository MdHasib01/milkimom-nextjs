/**
 * First-touch ad attribution.
 *
 * The Purchase for an order is not reported to Meta at checkout — it waits
 * until an admin confirms the order, which can be days later. By then the
 * browser, the URL and often the session are long gone, so everything needed
 * to attribute that sale has to be captured the moment the visitor lands and
 * carried through to the order record.
 *
 * Captured on the landing page, persisted in localStorage, attached to the
 * order payload, and topped up once more from the thank-you page.
 */

const STORAGE_KEY = "milkimom_attribution";

export interface Attribution {
  /** Meta click id. Also used to rebuild the `_fbc` cookie when it is missing. */
  fbclid: string;
  /** Google Ads click ids. gbraid/wbraid replace gclid on iOS app/web journeys. */
  gclid: string;
  gbraid: string;
  wbraid: string;
  /** TikTok and Microsoft Ads click ids, captured for completeness. */
  ttclid: string;
  msclkid: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  landingUrl: string;
  landingPath: string;
  /** ISO timestamp of the landing, used to rebuild `_fbc` with the real click time. */
  firstSeenAt: string;
}

/** URL params that identify a paid click, in Attribution key order. */
const CLICK_ID_PARAMS: Array<[keyof Attribution, string]> = [
  ["fbclid", "fbclid"],
  ["gclid", "gclid"],
  ["gbraid", "gbraid"],
  ["wbraid", "wbraid"],
  ["ttclid", "ttclid"],
  ["msclkid", "msclkid"],
];

const UTM_PARAMS: Array<[keyof Attribution, string]> = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmTerm", "utm_term"],
  ["utmContent", "utm_content"],
];

const EMPTY: Attribution = {
  fbclid: "",
  gclid: "",
  gbraid: "",
  wbraid: "",
  ttclid: "",
  msclkid: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  referrer: "",
  landingUrl: "",
  landingPath: "",
  firstSeenAt: "",
};

/** Values are stored verbatim but capped — the server caps them again at 500. */
function clean(value: string | null): string {
  return (value || "").trim().slice(0, 500);
}

function readFromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const record: Attribution = { ...EMPTY };

  for (const [key, param] of [...CLICK_ID_PARAMS, ...UTM_PARAMS]) {
    record[key] = clean(params.get(param));
  }

  record.referrer = clean(document.referrer);
  record.landingUrl = clean(window.location.href);
  record.landingPath = clean(window.location.pathname);
  record.firstSeenAt = new Date().toISOString();

  return record;
}

function hasClickId(record: Attribution): boolean {
  return CLICK_ID_PARAMS.some(([key]) => Boolean(record[key]));
}

/**
 * Records the current visit.
 *
 * Arriving with a click id means a fresh ad click, so it replaces whatever was
 * stored — that click is what any resulting sale should be credited to.
 * Without one, an existing record is left alone so an organic return visit
 * cannot erase the ad click that actually brought the customer in.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const current = readFromUrl();
    if (hasClickId(current)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return;
    }

    if (window.localStorage.getItem(STORAGE_KEY)) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Private mode / storage disabled — attribution is best-effort.
  }
}

/** The stored attribution, or null when nothing was ever captured. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<Attribution>;
    return { ...EMPTY, ...parsed };
  } catch {
    return null;
  }
}
