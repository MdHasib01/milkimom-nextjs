import { API_ENDPOINTS, MOTHER_COUNT_PATH } from "./api-config";
import type { Attribution } from "./attribution";

export interface OrderPayload {
  product: string;
  /** Which landing page sold this — decides the server-side price and the
   *  product Meta reports the Purchase against. */
  productSlug: string;
  customerName: string;
  phone: string;
  district: string;
  thana: string;
  address: string;
  flavour: string;
  paymentMethod: "COD" | "bKash";
  /** Display price only. The server re-resolves it from the catalog. */
  price: number;
  transactionId?: string;
  pageUrl?: string;
  orderTime?: string;
  ipAddress?: string;
  /** Meta browser id cookies, stored so the confirmed-order Purchase (sent
   *  server-side via the Conversions API) can be matched to the ad click. */
  fbp?: string;
  fbc?: string;
  /** Click ids and campaign params captured on the landing page. */
  attribution?: Attribution | null;
}

export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: unknown;
  /** HTTP status of the response. Undefined when the request never completed. */
  status?: number;
}

async function request<T = unknown>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const payload = (await response.json()) as any;
    const isSuccess = Boolean(payload?.success ?? response.ok);
    const data = payload?.data !== undefined ? payload.data : payload;
    const error = payload?.error || (!isSuccess ? payload?.message : undefined);

    return {
      success: isSuccess,
      data: data as T,
      error,
      status: response.status,
    };
  } catch (err) {
    console.error(`API request failed: ${url}`, err);
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Places an order against the backend. No OTP/mobile verification step —
 * orders go straight through.
 */
export function saveOrder(order: OrderPayload) {
  return request(API_ENDPOINTS.orders, {
    method: "POST",
    body: JSON.stringify(order),
  });
}

/**
 * Tops up tracking identifiers on a just-placed order from the thank-you page.
 *
 * The Meta `_fbp` cookie is written by fbevents.js, which loads after the page
 * is interactive — a quick submit can beat it, leaving the order without one.
 * By the thank-you page it is reliably there. The server only fills fields
 * that are still empty and refuses anything but a recent pending order.
 */
export function updateOrderAttribution(
  orderId: string,
  payload: { fbp?: string; fbc?: string; attribution?: Attribution | null }
) {
  return request(API_ENDPOINTS.orderAttribution(orderId), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches the satisfied mother count from the same-origin route handler.
 *
 * Call `useMotherCount()` / `getMotherCount()` in lib/mother-count instead of
 * this directly — they dedupe the request across the sections that display it.
 * No `cache: "no-store"` here on purpose: the route handler sets the freshness
 * policy via Cache-Control.
 */
export function fetchMotherCount() {
  return request<{ count: number; lastUpdated?: string }>(MOTHER_COUNT_PATH, {
    method: "GET",
  });
}

export interface CheckIpResult {
  ip: string;
  isAlreadyInDb: boolean;
  requiresOtp: boolean;
}

export interface UnfinishedPayload {
  product?: string;
  productSlug?: string;
  flavour?: string;
  price?: number;
  customerName?: string;
  district?: string;
  thana?: string;
  address?: string;
}

/**
 * Checks client IP address & logs phone check. Returns whether IP is already in DB.
 */
export function checkIpAndFraud(phone: string, payload?: UnfinishedPayload) {
  return request<CheckIpResult>(API_ENDPOINTS.fraudCheckIp, {
    method: "POST",
    body: JSON.stringify({ phone, ...payload }),
  });
}

/**
 * Sends a 4-digit OTP code to the provided phone number.
 */
export function sendFraudOtp(phone: string) {
  return request<{ message: string; devCode?: string }>(API_ENDPOINTS.fraudSendOtp, {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

/**
 * Verifies customer entered OTP code.
 */
export function verifyFraudOtp(phone: string, code: string) {
  return request<{ verified: boolean; message?: string }>(API_ENDPOINTS.fraudVerifyOtp, {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  });
}


