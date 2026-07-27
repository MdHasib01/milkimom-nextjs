import { API_ENDPOINTS } from "./api-config";
import type { ApiResult } from "./api";

const TOKEN_KEY = "milkimom_admin_token";
const USER_KEY = "milkimom_admin_user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  active: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function authRequest<T = unknown>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const token = getToken();
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
    });
    if (response.status === 401) {
      logout();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
      return { success: false, error: "Session expired" };
    }
    return await response.json();
  } catch (err) {
    console.error(`Admin API request failed: ${url}`, err);
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResult<{ token: string; user: AdminUser }>> {
  const result = await authRequest<{ token: string; user: AdminUser }>(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (result.success && result.data) {
    localStorage.setItem(TOKEN_KEY, result.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
  }
  return result;
}

export function fetchOrders(params?: {
  status?: string;
  phone?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.phone) query.set("phone", params.phone);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return authRequest(`${API_ENDPOINTS.orders}${qs ? `?${qs}` : ""}`);
}

export function changeOrderStatus(id: string, status: string) {
  return authRequest(API_ENDPOINTS.orderStatus(id), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function fetchSettings() {
  return authRequest<{ adminEmail: string; adminMobile: string }>(API_ENDPOINTS.settings);
}

export function saveSettings(data: { adminEmail?: string; adminMobile?: string }) {
  return authRequest(API_ENDPOINTS.settings, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function fetchAdminUsers() {
  return authRequest<AdminUser[]>(API_ENDPOINTS.adminUsers);
}

export function createAdminUser(data: { name: string; email: string; password: string; role?: string }) {
  return authRequest(API_ENDPOINTS.adminUsers, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminUser(id: string, data: { name?: string; password?: string; active?: boolean }) {
  return authRequest(API_ENDPOINTS.adminUserById(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteAdminUser(id: string) {
  return authRequest(API_ENDPOINTS.adminUserById(id), { method: "DELETE" });
}
