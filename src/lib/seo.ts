import { benefits } from "@/lib/content";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBengaliNumber = (num: number) =>
  num.toString().replace(/\d/g, (d) => bengaliDigits[Number(d)]);

export const SEO_TITLE =
  "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™";

/**
 * Search/social summary: the hero title followed by the five উপকারিতা exactly
 * as the benefits section renders them. Built from `benefits` so the snippet
 * never drifts from what is on the page — Google prefers descriptions that
 * match visible content.
 */
export const SEO_DESCRIPTION = `১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! একটি ডোজে ৫টি উপকারিতা: ${benefits
  .map((b, i) => `${toBengaliNumber(i + 1)}. ${b.accent} ${b.rest}`)
  .join(" ")}।`;

/**
 * A real 1200x630 card (product-jar.webp is 612x880 portrait, which crawlers
 * crop or reject when it is declared as 1200x630). JPEG rather than WebP
 * because some link-preview crawlers still skip WebP.
 */
export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "মিল্কিমম™ - ১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে!",
};
