"use client";

import { useEffect, useState } from "react";

import { fetchMotherCount } from "@/lib/api";

/**
 * Shared access to the live "মা" counter.
 *
 * Three sections display this number (hero, testimonials carousel, guarantee
 * banner) and each one used to own a `useEffect` that fetched it on mount and
 * re-polled every 30s — six-plus requests to a ~800ms endpoint per page load.
 * Everything now goes through one module-level cache: the first caller starts
 * the request, later callers await the same promise, and the resolved value is
 * reused for TTL_MS.
 */

/** Shown until the API answers, and kept if it never does. */
export const FALLBACK_MOTHER_COUNT = 89746;

/** The number moves on a slow cron tick upstream, so minutes of staleness are fine. */
const TTL_MS = 5 * 60 * 1000;

type CacheEntry = { count: number; fetchedAt: number };

let cache: CacheEntry | null = null;
let inFlight: Promise<number> | null = null;

function isFresh(entry: CacheEntry | null): entry is CacheEntry {
  return entry !== null && Date.now() - entry.fetchedAt < TTL_MS;
}

/**
 * Resolves the mother count, hitting the network at most once per page load.
 * Never rejects — a failed request resolves to the last known or fallback count.
 */
export function getMotherCount(): Promise<number> {
  if (isFresh(cache)) return Promise.resolve(cache.count);
  if (inFlight) return inFlight;

  inFlight = fetchMotherCount()
    .then((result) => {
      const count = result?.data?.count;
      if (result?.success && typeof count === "number" && count > 0) {
        cache = { count, fetchedAt: Date.now() };
        return count;
      }
      return cache?.count ?? FALLBACK_MOTHER_COUNT;
    })
    .catch(() => cache?.count ?? FALLBACK_MOTHER_COUNT)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * The live mother count. Renders FALLBACK_MOTHER_COUNT on the server and on the
 * first client paint (so hydration matches), then swaps in the real value.
 */
export function useMotherCount(): number {
  const [count, setCount] = useState(FALLBACK_MOTHER_COUNT);

  useEffect(() => {
    let active = true;
    getMotherCount().then((value) => {
      if (active) setCount(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return count;
}
