"use client";

import { useEffect, useState } from "react";

import {
  flavors as fallbackFlavors,
  singleJarPrice,
  smoothflowSingleJarPrice,
} from "./content";
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
  /** Same two, for the different product sold on the /smoothflow landing. */
  smoothflowSalePrice: number;
  smoothflowRegularPrice: number;
  icon: (typeof fallbackFlavors)[number]["icon"];
  image: string;
  smoothflowImage?: string;
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
  smoothflowPrice?: number | null;
  smoothflowOfferPrice?: number | null;
  tag?: string;
  image?: string;
  smoothflowImage?: string;
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
  smoothflowSalePrice: smoothflowSingleJarPrice.salePrice,
  smoothflowRegularPrice: smoothflowSingleJarPrice.regularPrice,
  icon: f.icon,
  image: f.image,
  smoothflowImage: "",
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

  // The /smoothflow landing sells a different product at its own price. These
  // used to be guessed from the Milkimom price (`salePrice === 4990 ? 1999`),
  // which broke the moment an admin edited the Milkimom price.
  const sfRegular = Number(f.smoothflowPrice) || smoothflowSingleJarPrice.regularPrice;
  const sfOffer = Number(f.smoothflowOfferPrice);
  const sfSale =
    Number.isFinite(sfOffer) && sfOffer > 0 && sfOffer < sfRegular
      ? sfOffer
      : smoothflowSingleJarPrice.salePrice;

  return {
    id: f._id || visual.id,
    name: f.name || visual.name,
    // Never borrow the hardcoded English name: this is what gets stored on the
    // order, and the courier entry looks the product back up by it. Falling
    // back to the visual's nameEn would store a name that isn't in the catalog,
    // so the configured weight/invoice code would never be found.
    nameEn: f.nameEn || f.name,
    description: f.description || visual.description,
    tag: f.tag || "",
    popular: Boolean(f.tag),
    salePrice: sale,
    regularPrice: regular,
    smoothflowSalePrice: sfSale,
    smoothflowRegularPrice: sfRegular,
    icon: visual.icon,
    image: f.image ? f.image : visual.image,
    smoothflowImage: f.smoothflowImage || "",
    accentBg: visual.accentBg,
    accentGradient: visual.accentGradient,
  };
}

/**
 * Rewrites a catalog for the landing page that is rendering it.
 *
 * One flavour catalog serves both landings, but /smoothflow sells a different
 * product with its own price and image. Every consumer must go through this so
 * the price shown, the price submitted and the price the server charges cannot
 * drift apart.
 */
export function applyProductPricing(
  flavors: DisplayFlavor[],
  productSlug: string
): DisplayFlavor[] {
  if (productSlug === "smoothflow") {
    return flavors.map((f) => ({
      ...f,
      regularPrice: f.smoothflowRegularPrice,
      salePrice: f.smoothflowSalePrice,
      image: f.smoothflowImage || "/images/smoothflow.png",
    }));
  }

  if (productSlug === "milkready") {
    return flavors.map((f) => ({
      ...f,
      regularPrice: 5650,
      salePrice: 3399,
      image: "/images/milkready/product-jar.png",
    }));
  }

  return flavors;
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
