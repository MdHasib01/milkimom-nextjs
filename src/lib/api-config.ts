/**
 * Backend API configuration.
 * Override the base URL with NEXT_PUBLIC_API_BASE_URL in .env.local for production.
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  orders: `${API_BASE_URL}/api/orders`,
  bulkOrders: `${API_BASE_URL}/api/orders/bulk`,
  orderById: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
  orderStatus: (id: string) => `${API_BASE_URL}/api/orders/${id}/status`,
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
  settings: `${API_BASE_URL}/api/settings`,
  adminUsers: `${API_BASE_URL}/api/admin-users`,
  adminUserById: (id: string) => `${API_BASE_URL}/api/admin-users/${id}`,
  motherCount: `${API_BASE_URL}/api/stats/mother-count`,
} as const;
