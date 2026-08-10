/**
 * Backend API configuration.
 * Override the base URL with NEXT_PUBLIC_API_BASE_URL in .env.local for production.
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Served by the route handler in this project (app/api/stats/mother-count),
 * which proxies and edge-caches the upstream stat. Deliberately same-origin and
 * relative: it rides the page's existing connection instead of paying a second
 * DNS lookup + TLS handshake on first paint.
 */
export const MOTHER_COUNT_PATH = "/api/stats/mother-count";

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  orders: `${API_BASE_URL}/api/orders`,
  adminCreateOrder: `${API_BASE_URL}/api/orders/admin`,
  bulkOrders: `${API_BASE_URL}/api/orders/bulk`,
  orderById: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
  orderStatus: (id: string) => `${API_BASE_URL}/api/orders/${id}/status`,
  orderCheckFraud: (id: string) => `${API_BASE_URL}/api/orders/${id}/check-fraud`,
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
  settings: `${API_BASE_URL}/api/settings`,
  steadfastTest: `${API_BASE_URL}/api/settings/steadfast/test`,
  ipinfoTest: `${API_BASE_URL}/api/settings/ipinfo/test`,
  ipinfoLookup: (ip: string, orderId?: string, type?: string) => {
    const query = new URLSearchParams();
    if (orderId) query.set("orderId", orderId);
    if (type) query.set("type", type);
    const qs = query.toString();
    return `${API_BASE_URL}/api/settings/ipinfo/lookup/${encodeURIComponent(ip)}${qs ? `?${qs}` : ""}`;
  },
  flavours: `${API_BASE_URL}/api/flavours`,
  flavoursAdmin: `${API_BASE_URL}/api/flavours/admin`,
  flavourById: (id: string) => `${API_BASE_URL}/api/flavours/${id}`,
  adminUsers: `${API_BASE_URL}/api/admin-users`,
  adminUserById: (id: string) => `${API_BASE_URL}/api/admin-users/${id}`,
  motherCount: `${API_BASE_URL}/api/stats/mother-count`,
  fraudCheckIp: `${API_BASE_URL}/api/fraud/check-ip`,
  fraudSendOtp: `${API_BASE_URL}/api/fraud/send-otp`,
  fraudVerifyOtp: `${API_BASE_URL}/api/fraud/verify-otp`,
  unfinishedOrders: `${API_BASE_URL}/api/unfinished-orders`,
  unfinishedOrderStatus: (id: string) => `${API_BASE_URL}/api/unfinished-orders/${id}/status`,
  unfinishedOrderById: (id: string) => `${API_BASE_URL}/api/unfinished-orders/${id}`,
  unfinishedOrdersBulkDelete: `${API_BASE_URL}/api/unfinished-orders/bulk-delete`,
  unfinishedOrdersSave: `${API_BASE_URL}/api/unfinished-orders/save`,
  customizationPublic: (slug?: string) => `${API_BASE_URL}/api/customization/public${slug ? `/${slug}` : ""}`,
  customizationAdmin: `${API_BASE_URL}/api/customization/admin`,
  customizationAdminBySlug: (slug: string) => `${API_BASE_URL}/api/customization/admin/${slug}`,
  customizationReset: (slug: string) => `${API_BASE_URL}/api/customization/admin/${slug}/reset`,
} as const;
