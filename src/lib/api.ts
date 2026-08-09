import { API_ENDPOINTS, MOTHER_COUNT_PATH } from "./api-config";

export interface OrderPayload {
  product: string;
  customerName: string;
  phone: string;
  district: string;
  thana: string;
  address: string;
  flavour: string;
  paymentMethod: "COD" | "bKash";
  price: number;
  transactionId?: string;
  pageUrl?: string;
  orderTime?: string;
  ipAddress?: string;
  /** Meta browser id cookies, stored so the delivered-order Purchase (sent
   *  server-side via the Conversions API) can be matched to the ad click. */
  fbp?: string;
  fbc?: string;
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


