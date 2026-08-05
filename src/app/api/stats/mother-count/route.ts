import { NextResponse } from "next/server";

/**
 * Same-origin proxy for the live mother count.
 *
 * The counter used to be fetched straight from the API host, which costs every
 * first-time visitor a fresh DNS lookup + TLS handshake to a second origin
 * before a single byte of the number arrives (~800ms on mobile data). Serving
 * it from this project means the request rides the connection the browser has
 * already opened for the page, and the response is cacheable at the Vercel
 * edge, so most visitors never touch the API host at all.
 *
 * Array-form `rewrites()` in next.config.ts run *after* the filesystem is
 * checked, so this handler wins over the `/api/:path*` passthrough.
 */

const UPSTREAM_BASE_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/** Mirrors FALLBACK_MOTHER_COUNT on the client so the counter never renders empty. */
const FALLBACK_COUNT = 89746;

/**
 * The upstream count is bumped by a cron job once a day at midnight, so
 * staleness costs nothing. Kept at five minutes only so a manual admin edit
 * (PUT /api/stats/mother-count) shows up reasonably soon.
 */
const CACHE_SECONDS = 300;

/** Upstream is down — cache the fallback briefly so a blip is not pinned for 5 minutes. */
const ERROR_CACHE_SECONDS = 30;

type MotherCountPayload = {
  success: boolean;
  data?: { count?: number; lastUpdated?: string };
};

function cacheHeaders(seconds: number) {
  return {
    // max-age=0 keeps the browser honest about the "LIVE" label while
    // s-maxage lets the edge absorb the traffic.
    "Cache-Control": `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=600`,
  };
}

export async function GET() {
  try {
    const upstream = await fetch(`${UPSTREAM_BASE_URL}/api/stats/mother-count`, {
      headers: { Accept: "application/json" },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!upstream.ok) throw new Error(`Upstream responded ${upstream.status}`);

    const payload = (await upstream.json()) as MotherCountPayload;
    const count = payload?.data?.count;

    if (!payload?.success || typeof count !== "number" || count <= 0) {
      throw new Error("Upstream returned no usable count");
    }

    return NextResponse.json(
      { success: true, data: { count, lastUpdated: payload.data?.lastUpdated } },
      { headers: cacheHeaders(CACHE_SECONDS) }
    );
  } catch (error) {
    console.error("[mother-count] upstream fetch failed", error);
    return NextResponse.json(
      { success: true, data: { count: FALLBACK_COUNT } },
      { headers: cacheHeaders(ERROR_CACHE_SECONDS) }
    );
  }
}
