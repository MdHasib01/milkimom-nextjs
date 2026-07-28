import { API_ENDPOINTS } from "./api-config";

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
    const payload = (await response.json()) as ApiResult<T>;
    return { ...payload, status: response.status };
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
 * Fetches satisfied mother count from DB API
 */
export function fetchMotherCount() {
  return request<{ count: number; lastUpdated?: string }>(API_ENDPOINTS.motherCount, {
    method: "GET",
    cache: "no-store",
  });
}

export interface CheckIpResult {
  ip: string;
  isAlreadyInDb: boolean;
  requiresOtp: boolean;
}

/**
 * Checks client IP address & logs phone check. Returns whether IP is already in DB.
 */
export function checkIpAndFraud(phone: string) {
  return request<CheckIpResult>(API_ENDPOINTS.fraudCheckIp, {
    method: "POST",
    body: JSON.stringify({ phone }),
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


