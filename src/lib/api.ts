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
}

async function request<T = unknown>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    return await response.json();
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
