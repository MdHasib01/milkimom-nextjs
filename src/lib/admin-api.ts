import { API_ENDPOINTS } from "./api-config";
import type { ApiResult } from "./api";

const TOKEN_KEY = "milkimom_admin_token";
const USER_KEY = "milkimom_admin_user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "moderator";
  mustChangePassword?: boolean;
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

/**
 * Manually adds an order from the admin dashboard (message-campaign sales).
 * Created server-side as Confirmed with source 'admin': no SMS/email is sent
 * and it is never reported to the Meta Conversions API on delivery.
 */
export function createOrderAdmin(data: {
  customerName?: string;
  phone: string;
  address?: string;
  flavour?: string;
  paymentMethod?: "COD" | "bKash";
  transactionId?: string;
  price: number;
}) {
  return authRequest(API_ENDPOINTS.adminCreateOrder, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function changeOrderStatus(id: string, status: string) {
  return authRequest(API_ENDPOINTS.orderStatus(id), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function checkOrderFraud(id: string) {
  return authRequest(API_ENDPOINTS.orderCheckFraud(id), {
    method: "POST",
  });
}

export function updateOrderDetails(
  id: string,
  data: {
    customerName?: string;
    address?: string;
    thana?: string;
    district?: string;
    flavour?: string;
  }
) {
  return authRequest(API_ENDPOINTS.orderById(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteOrder(id: string) {
  return authRequest(API_ENDPOINTS.orderById(id), {
    method: "DELETE",
  });
}

export function bulkDeleteOrders(ids: string[]) {
  return authRequest<{ success: boolean; count: number }>(API_ENDPOINTS.bulkOrders, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
}

export interface IpLocation {
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export interface GlobalSettings {
  adminEmail: string;
  adminMobile: string;
  steadfastEnabled: boolean;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  ipinfoEnabled: boolean;
  ipinfoToken: string;
}

export function fetchSettings() {
  return authRequest<GlobalSettings>(API_ENDPOINTS.settings);
}

export function saveSettings(data: Partial<GlobalSettings>) {
  return authRequest<GlobalSettings>(API_ENDPOINTS.settings, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Verifies Steadfast API credentials by fetching the merchant balance.
 * Pass keys to test unsaved values; omit to test the stored ones.
 */
export function testSteadfastConnection(data?: { apiKey?: string; secretKey?: string }) {
  return authRequest<{ balance: number }>(API_ENDPOINTS.steadfastTest, {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

/**
 * Verifies ipinfo.io API token by querying location info for caller IP.
 */
export function testIpinfoConnection(data?: { token?: string }) {
  return authRequest<IpLocation & { ip?: string }>(API_ENDPOINTS.ipinfoTest, {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

/**
 * Performs on-demand IP geolocation lookup via server proxy.
 * Saves the location data to the database for the given orderId.
 */
export function lookupIpInfo(ip: string, orderId?: string, type?: "orders" | "unfinished") {
  return authRequest<IpLocation & { ip?: string }>(API_ENDPOINTS.ipinfoLookup(ip, orderId, type));
}

/**
 * Dynamic flavour/product catalog (admin-managed; the website order section
 * renders it). weight and invoiceCode feed the Steadfast consignment entry.
 */
export interface Flavour {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  offerPrice: number | null;
  weight: number;
  invoiceCode: string;
  tag: string;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export function fetchFlavoursAdmin() {
  return authRequest<Flavour[]>(API_ENDPOINTS.flavoursAdmin);
}

export function createFlavour(data: Partial<Omit<Flavour, "_id">>) {
  return authRequest<Flavour>(API_ENDPOINTS.flavours, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateFlavour(id: string, data: Partial<Omit<Flavour, "_id">>) {
  return authRequest<Flavour>(API_ENDPOINTS.flavourById(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteFlavour(id: string) {
  return authRequest(API_ENDPOINTS.flavourById(id), { method: "DELETE" });
}

export function fetchAdminUsers() {
  return authRequest<AdminUser[]>(API_ENDPOINTS.adminUsers);
}

export function createAdminUser(data: { name: string; email: string; password?: string; role?: "superadmin" | "admin" | "moderator" }) {
  return authRequest(API_ENDPOINTS.adminUsers, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminUser(id: string, data: { name?: string; role?: "superadmin" | "admin" | "moderator"; active?: boolean }) {
  return authRequest(API_ENDPOINTS.adminUserById(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function resetAdminUserPassword(id: string) {
  return authRequest(`${API_ENDPOINTS.adminUsers}/${id}/reset-password`, {
    method: "POST",
  });
}

export function changePassword(newPassword: string, currentPassword?: string) {
  return authRequest(`${API_ENDPOINTS.adminUsers.replace('/admin-users', '/auth')}/change-password`, {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function deleteAdminUser(id: string) {
  return authRequest(API_ENDPOINTS.adminUserById(id), { method: "DELETE" });
}

export interface UnfinishedOrder {
  _id: string;
  customerName: string;
  phone: string;
  address?: string;
  district?: string;
  thana?: string;
  flavour?: string;
  price?: number;
  ipAddress?: string;
  ipLocation?: IpLocation;
  status: "Pending" | "Called User" | "Cancelled" | "Spam";
  statusUpdatedBy?: string;
  statusUpdatedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function fetchUnfinishedOrders(params?: {
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
  return authRequest(`${API_ENDPOINTS.unfinishedOrders}${qs ? `?${qs}` : ""}`);
}

export function changeUnfinishedOrderStatus(id: string, status: string) {
  return authRequest(API_ENDPOINTS.unfinishedOrderStatus(id), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteUnfinishedOrder(id: string) {
  return authRequest(API_ENDPOINTS.unfinishedOrderById(id), {
    method: "DELETE",
  });
}

export function bulkDeleteUnfinishedOrders(ids: string[]) {
  return authRequest(API_ENDPOINTS.unfinishedOrdersBulkDelete, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export interface LandingPageTheme {
  _id?: string;
  productSlug: string;
  name: string;
  themeColor: string;
  accentColor: string;
  ctaColor: string;
  ctaTextColor: string;
  backgroundColor: string;
  createdAt?: string;
  updatedAt?: string;
}

export function fetchCustomizationThemes() {
  return authRequest<{ data: LandingPageTheme[]; defaultPresets: Record<string, LandingPageTheme> }>(
    API_ENDPOINTS.customizationAdmin
  );
}

export function updateCustomizationTheme(slug: string, data: Partial<LandingPageTheme>) {
  return authRequest<LandingPageTheme>(API_ENDPOINTS.customizationAdminBySlug(slug), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function resetCustomizationTheme(slug: string) {
  return authRequest<LandingPageTheme>(API_ENDPOINTS.customizationReset(slug), {
    method: "POST",
  });
}

export function createCustomizationTheme(data: Partial<LandingPageTheme>) {
  return authRequest<LandingPageTheme>(API_ENDPOINTS.customizationAdmin, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CarouselItemData {
  id: string | number;
  title: string;
  description: string;
  tag?: string;
  image: string;
  imageMobile?: string;
  imageSide?: "left" | "right" | "center";
  sortOrder?: number;
}

export interface DoctorItemData {
  id: string | number;
  name: string;
  degree?: string;
  title?: string;
  subtitle?: string;
  description: string;
  image: string;
  sortOrder?: number;
}

export interface LandingPageContentData {
  _id?: string;
  productSlug: string;
  productName?: string;
  productNameEn?: string;
  logoType?: "image" | "text";
  logoImage?: string;
  announcementText?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroSubtitle?: string;
  heroSubtitleHighlight?: string;
  heroCtaText?: string;
  heroImage?: string;
  doctorTitle?: string;
  doctorName?: string;
  doctorDegree?: string;
  doctorQuote?: string;
  doctorImage?: string;
  orderHeadline?: string;
  orderSubheadline?: string;
  guaranteeTitle?: string;
  guaranteeText?: string;
  footerText?: string;
  footerPhone?: string;
  footerEmail?: string;
  footerAddress?: string;
  carouselItems?: CarouselItemData[];
  doctorItems?: DoctorItemData[];
  createdAt?: string;
  updatedAt?: string;
}

export function fetchCustomizationContent(slug: string = "milkimom") {
  return authRequest<{ data: LandingPageContentData; defaultPresets: LandingPageContentData }>(
    API_ENDPOINTS.customizationAdminContent(slug)
  );
}

export function updateCustomizationContent(slug: string, data: Partial<LandingPageContentData>) {
  return authRequest<LandingPageContentData>(API_ENDPOINTS.customizationAdminContent(slug), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function resetCustomizationContent(slug: string) {
  return authRequest<LandingPageContentData>(API_ENDPOINTS.customizationContentReset(slug), {
    method: "POST",
  });
}

export async function uploadAssetImage(slug: string, file: File): Promise<ApiResult<{ url: string; filename: string }>> {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(API_ENDPOINTS.customizationUpload(slug), {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
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
    console.error("Asset image upload failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Upload failed" };
  }
}
