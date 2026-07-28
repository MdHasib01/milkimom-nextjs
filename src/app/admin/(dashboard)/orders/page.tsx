"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  fetchOrders,
  changeOrderStatus,
  deleteOrder,
  bulkDeleteOrders,
} from "@/lib/admin-api";
import { siteConfig } from "@/lib/content";

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
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Bulk & Single Delete States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [singleDeleteOrder, setSingleDeleteOrder] = useState<Order | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Invoice Printing State
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await fetchOrders({
      status: statusFilter || undefined,
      phone: phoneSearch.trim() || undefined,
      page,
      limit,
    });
    if (result.success) {
      setOrders((result.data as Order[]) || []);
      setPagination((result as { pagination?: Pagination }).pagination || null);
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to load orders");
    }
    setLoading(false);
  }, [statusFilter, phoneSearch, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  // Automatically reset selection when page or filters change
  useEffect(() => {
    setSelectedIds([]);
  }, [page, limit, statusFilter, phoneSearch]);

  // Clear success notification after 4 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    const result = await changeOrderStatus(id, status);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id === id) {
            // If changing away from Cancelled, remove from selected list
            if (status !== "Cancelled" && selectedIds.includes(id)) {
              setSelectedIds((ids) => ids.filter((i) => i !== id));
            }
            return { ...o, status };
          }
          return o;
        })
      );
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update status");
    }
    setUpdatingId(null);
  }

  // Delete single order handler
  async function handleConfirmSingleDelete() {
    if (!singleDeleteOrder) return;
    setIsDeleting(true);
    const result = await deleteOrder(singleDeleteOrder._id);
    setIsDeleting(false);

    if (result.success) {
      setSuccessMsg(`Order #${singleDeleteOrder._id.slice(-6)} deleted successfully.`);
      setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteOrder._id));
      setSingleDeleteOrder(null);
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to delete order");
      setSingleDeleteOrder(null);
    }
  }

  // Delete bulk orders handler
  async function handleConfirmBulkDelete() {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    const result = await bulkDeleteOrders(selectedIds);
    setIsDeleting(false);

    if (result.success) {
      const count = result.data?.count ?? selectedIds.length;
      setSuccessMsg(`Successfully deleted ${count} cancelled order${count > 1 ? "s" : ""}.`);
      setSelectedIds([]);
      setIsBulkDeleteOpen(false);
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to bulk delete orders");
      setIsBulkDeleteOpen(false);
    }
  }

  // Selection logic for checkmarks
  const cancelledOrdersOnPage = orders.filter((o) => o.status === "Cancelled");
  const cancelledIdsOnPage = cancelledOrdersOnPage.map((o) => o._id);
  const isAllCancelledSelected =
    cancelledIdsOnPage.length > 0 &&
    cancelledIdsOnPage.every((id) => selectedIds.includes(id));

  function toggleSelectAllCancelled() {
    if (isAllCancelledSelected) {
      // Unselect all cancelled orders on current page
      setSelectedIds((prev) => prev.filter((id) => !cancelledIdsOnPage.includes(id)));
    } else {
      // Select all cancelled orders on current page
      setSelectedIds((prev) => Array.from(new Set([...prev, ...cancelledIdsOnPage])));
    }
  }

  function toggleSelectOrder(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  // Pagination calculation
  const totalPages = pagination?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground">
            Manage customer orders, track status, print invoices, and perform bulk operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Phone Search */}
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

          {/* Status Filter */}
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

          {/* Refresh Button */}
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          <span>{error}</span>
          <button onClick={() => setError("")} className="hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:border-green-800/30 dark:bg-green-950/40 dark:text-green-300">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {selectedIds.length}
            </span>
            <span className="text-sm font-semibold text-red-900 dark:text-red-200">
              {selectedIds.length === 1 ? "1 order" : `${selectedIds.length} orders`} selected for bulk deletion
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs font-semibold text-red-700 underline hover:text-red-900 dark:text-red-300"
            >
              Deselect All
            </button>
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 shadow-xs"
            >
              <Trash2 size={14} /> Delete Selected ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center font-medium text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {/* Header Checkmark */}
                <th className="w-8 px-2 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCancelledSelected}
                    disabled={cancelledOrdersOnPage.length === 0}
                    onChange={toggleSelectAllCancelled}
                    title={
                      cancelledOrdersOnPage.length === 0
                        ? "No cancelled orders available on this page to select"
                        : "Select all cancelled orders on this page"
                    }
                    className="h-4 w-4 cursor-pointer rounded border-input text-primary accent-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Date</th>
                <th className="max-w-[130px] px-2.5 py-2.5">Customer</th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Phone</th>
                <th className="max-w-[110px] px-2.5 py-2.5">Location</th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Flavour</th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Payment</th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Total</th>
                <th className="px-2.5 py-2.5 whitespace-nowrap">Status</th>
                <th className="px-2.5 py-2.5 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCancelled = order.status === "Cancelled";
                const isSelected = selectedIds.includes(order._id);

                return (
                  <tr
                    key={order._id}
                    className={`border-b border-border/60 transition last:border-0 hover:bg-muted/60 ${
                      isSelected ? "bg-red-50/50 dark:bg-red-950/20" : ""
                    }`}
                  >
                    {/* Checkmark selection column */}
                    <td className="w-8 px-2 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isCancelled}
                        onChange={() => toggleSelectOrder(order._id)}
                        title={
                          !isCancelled
                            ? "Only cancelled orders can be selected for deletion"
                            : "Select cancelled order for deletion"
                        }
                        className="h-4 w-4 cursor-pointer rounded border-input text-primary accent-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-30"
                      />
                    </td>

                    {/* Date */}
                    <td className="px-2.5 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(order.orderTime || order.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Customer */}
                    <td className="max-w-[130px] px-2.5 py-2.5">
                      <p className="truncate text-xs font-semibold text-foreground" title={order.customerName}>
                        {order.customerName}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground" title={order.address}>
                        {order.address}
                      </p>
                    </td>

                    {/* Phone */}
                    <td className="px-2.5 py-2.5 font-mono text-xs text-foreground/80 whitespace-nowrap">{order.phone}</td>

                    {/* Location */}
                    <td className="max-w-[110px] px-2.5 py-2.5 text-xs text-muted-foreground truncate" title={`${order.thana}, ${order.district}`}>
                      {order.thana}, {order.district}
                    </td>

                    {/* Flavour */}
                    <td className="px-2.5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{order.flavour}</td>

                    {/* Payment */}
                    <td className="px-2.5 py-2.5 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold ${
                          order.paymentStatus === "Paid" ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {order.paymentStatus === "Paid" ? "Paid (bKash)" : "COD"}
                      </span>
                      {order.transactionId && (
                        <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[90px]">{order.transactionId}</p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-2.5 py-2.5 font-bold whitespace-nowrap text-xs text-foreground">৳{order.price}</td>

                    {/* Status dropdown */}
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
                        {updatingId === order._id && (
                          <Loader2 className="animate-spin text-muted-foreground" size={14} />
                        )}
                      </div>
                    </td>

                    {/* Action Column: Track, Print Invoice, Delete */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Track Order Button */}
                        <Link
                          href={`/track/${order._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Track Order"
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950/50"
                        >
                          <ExternalLink size={16} />
                        </Link>

                        {/* Print Invoice Button */}
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          title="Print Invoice"
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-purple-600 transition hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950/50"
                        >
                          <Printer size={16} />
                        </button>

                        {/* Delete Button (Only active for Cancelled status) */}
                        <button
                          disabled={!isCancelled}
                          onClick={() => setSingleDeleteOrder(order)}
                          title={
                            !isCancelled
                              ? "Only cancelled orders can be deleted"
                              : "Delete cancelled order"
                          }
                          className={`inline-flex items-center justify-center rounded-lg p-1.5 transition ${
                            isCancelled
                              ? "text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50"
                              : "cursor-not-allowed text-muted-foreground/30"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-xs">
          {/* Left: Total orders & Page limit selector */}
          <div className="flex flex-wrap items-center gap-4">
            <span>
              Showing{" "}
              <strong className="text-foreground">
                {pagination.total > 0 ? (page - 1) * limit + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(page * limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-foreground">{pagination.total}</strong> orders
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs">Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-input bg-card px-2 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Right: Page Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => {
                  const prevP = arr[idx - 1];
                  const showEllipsis = prevP && p - prevP > 1;

                  return (
                    <div key={p} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`min-w-[28px] rounded-md px-2 py-1 text-xs font-bold transition ${
                          page === p
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "border border-input bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Single Delete */}
      {singleDeleteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Delete Order Confirmation</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Are you sure you want to delete order{" "}
                  <strong className="font-mono text-foreground">
                    #{singleDeleteOrder._id.slice(-6)}
                  </strong>{" "}
                  for customer <strong className="text-foreground">{singleDeleteOrder.customerName}</strong>?
                </p>
                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setSingleDeleteOrder(null)}
                className="rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmSingleDelete}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Bulk Delete */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Bulk Delete Confirmation</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground font-bold">
                    {selectedIds.length} cancelled order{selectedIds.length > 1 ? "s" : ""}
                  </strong>
                  ?
                </p>
                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">
                  All selected records will be permanently removed from the database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setIsBulkDeleteOpen(false)}
                className="rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmBulkDelete}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Delete {selectedIds.length} Order{selectedIds.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="print-invoice-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-white text-gray-900 p-8 shadow-2xl space-y-6">
            {/* Modal Controls (Hidden during print) */}
            <div className="no-print flex items-center justify-between border-b pb-4">
              <span className="text-base font-bold text-gray-800">Order Invoice Preview</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90 shadow-xs"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Invoice Printable Section */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-red-700 uppercase">
                    MILKIMOM
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Pure & Natural Lactation Support
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Help: {siteConfig.phoneDisplay} | Web: milkimom.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    INVOICE
                  </span>
                  <p className="mt-2 text-xs font-mono font-bold text-gray-700">
                    Order #{invoiceOrder._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date:{" "}
                    {new Date(invoiceOrder.orderTime || invoiceOrder.createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-6 rounded-xl bg-gray-50 p-4 text-xs">
                <div>
                  <h4 className="font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Billed & Shipped To:
                  </h4>
                  <p className="font-bold text-gray-900 text-sm">{invoiceOrder.customerName}</p>
                  <p className="text-gray-600 font-mono mt-0.5">{invoiceOrder.phone}</p>
                  <p className="text-gray-600 mt-1">{invoiceOrder.address}</p>
                  <p className="text-gray-600">
                    {invoiceOrder.thana}, {invoiceOrder.district}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Order Information:
                  </h4>
                  <p className="text-gray-600">
                    Status: <strong className="text-gray-900 font-semibold">{invoiceOrder.status}</strong>
                  </p>
                  <p className="text-gray-600 mt-1">
                    Payment Method:{" "}
                    <strong className="text-gray-900 font-semibold">
                      {invoiceOrder.paymentStatus === "Paid" ? "bKash Online Payment" : "Cash on Delivery (COD)"}
                    </strong>
                  </p>
                  {invoiceOrder.transactionId && (
                    <p className="text-gray-600 font-mono mt-0.5">
                      TrxID: {invoiceOrder.transactionId}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Item Description</th>
                      <th className="px-4 py-3 text-center">Flavour</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Milkimom Natural Lactation Booster Jar
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {invoiceOrder.flavour || "Standard"}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">1</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ৳{invoiceOrder.price}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary / Total */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>৳{invoiceOrder.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-green-700">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 text-sm font-black text-gray-900">
                    <span>Total Amount:</span>
                    <span className="text-red-700">৳{invoiceOrder.price}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="border-t pt-4 text-center text-[11px] text-gray-500 space-y-1">
                <p className="font-medium text-gray-700">
                  Thank you for ordering with Milkimom! Wish you and your baby good health.
                </p>
                <p>For any queries, call helpline: {siteConfig.phoneDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
