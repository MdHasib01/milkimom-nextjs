"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";

import { fetchOrders, changeOrderStatus } from "@/lib/admin-api";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  thana: string;
  flavour: string;
  paymentStatus: string;
  transactionId?: string;
  price: number;
  status: string;
  orderTime?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await fetchOrders({
      status: statusFilter || undefined,
      phone: phoneSearch.trim() || undefined,
      page,
      limit: 20,
    });
    if (result.success) {
      setOrders((result.data as Order[]) || []);
      setPagination((result as { pagination?: Pagination }).pagination || null);
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to load orders");
    }
    setLoading(false);
  }, [statusFilter, phoneSearch, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() is the shared fetch used by filters, refresh and this initial mount
    load();
  }, [load]);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    const result = await changeOrderStatus(id, status);
    if (result.success) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update status");
    }
    setUpdatingId(null);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={phoneSearch}
              onChange={(e) => {
                setPhoneSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by phone"
              className="w-44 rounded-lg border border-input bg-card py-2 pr-3 pl-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center font-medium text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Flavour</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border/60 last:border-0 hover:bg-muted/60">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {new Date(order.orderTime || order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{order.customerName}</p>
                    <p className="max-w-[180px] truncate text-xs text-muted-foreground" title={order.address}>
                      {order.address}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground/80">{order.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {order.thana}, {order.district}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.flavour}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold ${
                        order.paymentStatus === "Paid" ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {order.paymentStatus === "Paid" ? "Paid (bKash)" : "COD"}
                    </span>
                    {order.transactionId && (
                      <p className="font-mono text-[11px] text-muted-foreground">{order.transactionId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold whitespace-nowrap text-foreground">৳{order.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-bold outline-none disabled:opacity-50 ${
                          STATUS_COLORS[order.status] || "border-border bg-muted text-foreground"
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {updatingId === order._id && <Loader2 className="animate-spin text-muted-foreground" size={14} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} orders)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-input bg-card px-3 py-1.5 font-semibold hover:bg-muted disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-input bg-card px-3 py-1.5 font-semibold hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
