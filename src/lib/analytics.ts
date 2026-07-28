/**
 * Routes that third-party analytics must not run on.
 *
 * The admin dashboard is staff-only and its pages render customer names,
 * phone numbers and addresses — it must stay out of ad tracking and out of
 * session recordings.
 */
export function isAnalyticsExcluded(pathname: string) {
  return pathname.startsWith("/admin");
}
