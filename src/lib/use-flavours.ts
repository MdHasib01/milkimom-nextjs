"use client";

import { useEffect, useState } from "react";

import { flavors as fallbackFlavors, singleJarPrice } from "./content";
import { API_ENDPOINTS } from "./api-config";

/**
 * Flavour catalog for display: admin-managed via /api/flavours with the
 * original hardcoded content as the guaranteed fallback (API down, empty
 * catalog, first render). Visual styling (icon, image, accent colors) is not
 * admin-configurable — it is borrowed from the matching hardcoded flavour,
 * or cycled through the palette for newly added flavours.
 */
export interface DisplayFlavor {
  id: string;
  /** Display name (Bangla) shown on the card and in the order summary. */
  name: string;
  /** English name stored on the order and sent to the courier. */
  nameEn: string;
  description: string;
  tag: string;
  popular: boolean;
  /** What the customer pays (offer price when set, else regular). */
  salePrice: number;
  /** Regular price, shown struck through when higher than salePrice. */
  regularPrice: number;
  icon: (typeof fallbackFlavors)[number]["icon"];
  image: string;
  accentBg: string;
  accentGradient: string;
}

interface ApiFlavour {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  offerPrice?: number | null;
  tag?: string;
}

export const FALLBACK_FLAVORS: DisplayFlavor[] = fallbackFlavors.map((f) => ({
  id: f.id,
  name: f.name,
  nameEn: f.nameEn,
  description: f.description,
  tag: "tag" in f && f.tag ? f.tag : "",
  popular: f.popular,
  salePrice: singleJarPrice.salePrice,
  regularPrice: singleJarPrice.regularPrice,
  icon: f.icon,
  image: f.image,
  accentBg: f.accentBg,
  accentGradient: f.accentGradient,
}));

function mapApiFlavour(f: ApiFlavour, index: number): DisplayFlavor {
  const visual =
    fallbackFlavors.find((v) => v.nameEn === f.nameEn || v.name === f.name) ??
    fallbackFlavors[index % fallbackFlavors.length];

  const regular = Number(f.price) || 0;
  const offer = Number(f.offerPrice);
  const sale = Number.isFinite(offer) && offer > 0 && offer < regular ? offer : regular;

  return {
    id: f._id || visual.id,
    name: f.name || visual.name,
    nameEn: f.nameEn || visual.nameEn,
    description: f.description || visual.description,
    tag: f.tag || "",
    popular: Boolean(f.tag),
    salePrice: sale,
    regularPrice: regular,
    icon: visual.icon,
    image: visual.image,
    accentBg: visual.accentBg,
    accentGradient: visual.accentGradient,
  };
}

export function useFlavors(): DisplayFlavor[] {
  const [flavorList, setFlavorList] = useState<DisplayFlavor[]>(FALLBACK_FLAVORS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(API_ENDPOINTS.flavours);
        const json = await response.json();
        if (!cancelled && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: DisplayFlavor[] = json.data.map(mapApiFlavour);
          // A catalog with no tagged flavour still needs a default selection.
          if (!mapped.some((f) => f.popular)) mapped[0].popular = true;
          setFlavorList(mapped);
        }
      } catch {
        // Keep the hardcoded fallback.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return flavorList;
}
