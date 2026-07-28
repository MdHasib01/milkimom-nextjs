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

