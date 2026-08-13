"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
  Pencil,
  PhoneCall,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShoppingCart,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Truck,
  X,
  MapPin,
  Globe,
  Eye,
  Clock,
  User,
  CreditCard,
} from "lucide-react";

import {
  fetchOrders,
  createOrderAdmin,
  changeOrderStatus,
  checkOrderFraud,
  updateOrderDetails,
  deleteOrder,
  bulkDeleteOrders,
  fetchUnfinishedOrders,
  changeUnfinishedOrderStatus,
  deleteUnfinishedOrder,
  bulkDeleteUnfinishedOrders,
  lookupIpInfo,
  getStoredUser,
  type UnfinishedOrder,
  type IpLocation,
} from "@/lib/admin-api";
import { siteConfig } from "@/lib/content";
import { useFlavors } from "@/lib/use-flavours";
import { cn } from "@/lib/utils";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;

/**
 * Statuses that count as a real sale. Mirrors PURCHASE_STATUSES in
 * server/controllers/orderController.js — these are the orders reported to
 * Meta as a Purchase and eligible for the Google Ads conversion upload.
 */
const PURCHASE_STATUSES: string[] = ["Confirmed", "Shipped", "Delivered"];

// Same format the public order form enforces
const PHONE_REGEX = /^01[3-9]\d{8}$/;

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

interface Attribution {
  fbclid?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  ttclid?: string;
  msclkid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingUrl?: string;
  landingPath?: string;
  firstSeenAt?: string;
}

interface Order {
  _id: string;
  product?: string;
  productSlug?: "milkimom" | "smoothflow";
  pageUrl?: string;
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
  statusUpdatedBy?: string;
  statusUpdatedAt?: string;
  orderTime?: string;
  createdAt: string;
  /** 'admin' = manually entered (message-campaign sale); undefined/'web' = site order */
  source?: "web" | "admin";
  ipAddress?: string;
  ipLocation?: IpLocation;
  fbp?: string;
  fbc?: string;
  attribution?: Attribution;
  metaPurchaseSentAt?: string | null;
  metaPurchaseValue?: number | null;
  metaPurchaseStatus?: "" | "sent" | "failed";
  metaPurchaseError?: string;
  steadfastConsignmentId?: string;
  steadfastTrackingCode?: string;
  steadfastStatus?: string;
  steadfastLastError?: string;
  steadfastFraud?: {
    totalParcels?: number | null;
    totalDelivered?: number | null;
    totalCancelled?: number | null;
    totalFraudReports?: number | null;
    successRate?: number | null;
    checkedAt?: string | null;
    error?: string;
  };
}

function getOrderProductDetails(productName?: string, pageUrl?: string, productSlug?: string) {
  const prod = (productName || "").trim();
  const url = (pageUrl || "").toLowerCase();

  // productSlug is set at order time and authoritative. Orders placed before
  // it existed fall back to sniffing the product name and landing URL.
  const isSmoothflow = productSlug
    ? productSlug === "smoothflow"
    : prod.toLowerCase().includes("smoothflow") ||
      prod.includes("স্মুথফ্লো") ||
      url.includes("/smoothflow") ||
      url.includes("smoothflow");

  if (isSmoothflow) {
    return {
      name: "SmoothFlow",
      fullName: prod || "SmoothFlow Complete Dose",
      image: "/images/smoothflow.png",
      badgeColor: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300",
    };
  }

  return {
    name: "Milkimom",
    fullName: prod || "Milkimom Complete Dose",
    image: "/images/product-jar.webp",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminOrdersPage() {
  const currentUser = getStoredUser();
  const isModerator = currentUser?.role === "moderator";
  const canDelete = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  // Dynamic product catalog (falls back to the hardcoded flavours).
  const flavors = useFlavors();
  const featuredFlavor = flavors.find((f) => f.popular) ?? flavors[0];
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
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingGoogleAds, setIsExportingGoogleAds] = useState(false);

  // Bulk & Single Delete States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [singleDeleteOrder, setSingleDeleteOrder] = useState<Order | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Invoice Printing State
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Edit Order State
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: "",
    address: "",
    thana: "",
    district: "",
    flavour: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Add Manual Order State (message-campaign sales entered by the admin)
  const emptyAddForm = {
    product: "Milkimom Complete Dose",
    customerName: "",
    phone: "",
    address: "",
    flavour: featuredFlavor.nameEn || featuredFlavor.name,
    paymentMethod: "COD" as "COD" | "bKash",
    transactionId: "",
    price: String(featuredFlavor.salePrice),
  };
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyAddForm);
  const [isSavingAdd, setIsSavingAdd] = useState(false);
  const [addError, setAddError] = useState("");



  // Active Tab: "orders" | "unfinished"
  const [activeTab, setActiveTab] = useState<"orders" | "unfinished">("orders");

  // Unfinished Orders State
  const [unfinishedOrders, setUnfinishedOrders] = useState<UnfinishedOrder[]>([]);
  const [unfinishedPagination, setUnfinishedPagination] = useState<Pagination | null>(null);
  const [unfinishedStatusFilter, setUnfinishedStatusFilter] = useState("");

  const UNFINISHED_STATUSES = ["Pending", "Called User", "Cancelled", "Spam"] as const;
  const UNFINISHED_STATUS_COLORS: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
    "Called User": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300",
    Cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300",
    Spam: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300",
  };

  // Dynamic IP Location state for on-demand lookups
  const [dynamicIpLocs, setDynamicIpLocs] = useState<Record<string, IpLocation>>({});
  const [fetchingIpId, setFetchingIpId] = useState<string | null>(null);

  // Right-side Drawer States
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const [drawerUnfinishedOrder, setDrawerUnfinishedOrder] = useState<UnfinishedOrder | null>(null);

  // ESC Key listener to close side drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOrder(null);
        setDrawerUnfinishedOrder(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleRowClick(e: React.MouseEvent, order: Order) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, select, label, [role='button']")) {
      return;
    }
    setDrawerOrder(order);
  }

  function handleUnfinishedRowClick(e: React.MouseEvent, uOrder: UnfinishedOrder) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, select, label, [role='button']")) {
      return;
    }
    setDrawerUnfinishedOrder(uOrder);
  }

  async function handleLookupIp(id: string, ip: string, type: "orders" | "unfinished") {
    if (!ip || fetchingIpId === id) return;
    setFetchingIpId(id);
    const res = await lookupIpInfo(ip, id, type);
    if (res.success && res.data) {
      const locData = res.data as IpLocation;
      setDynamicIpLocs((prev) => ({ ...prev, [id]: locData }));
      if (type === "unfinished") {
        setUnfinishedOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, ipLocation: locData } : o))
        );
      } else {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, ipLocation: locData } : o))
        );
      }
    } else {
      alert(typeof res.error === "string" ? res.error : "Failed to fetch IP location");
    }
    setFetchingIpId(null);
  }

  function getIpMapUrl(ipLoc?: IpLocation, ipAddress?: string): string | null {
    if (ipLoc?.loc && ipLoc.loc.trim()) {
      return `https://www.google.com/maps?q=${encodeURIComponent(ipLoc.loc.trim())}`;
    }
    const locParts = [ipLoc?.city, ipLoc?.region, ipLoc?.country].filter((s) => s && s.trim());
    if (locParts.length > 0) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locParts.join(", "))}`;
    }
    const cleanIp = (ipAddress || "").trim();
    if (
      cleanIp &&
      cleanIp !== "127.0.0.1" &&
      cleanIp !== "::1" &&
      !cleanIp.startsWith("192.168.") &&
      !cleanIp.startsWith("10.")
    ) {
      return `https://ipinfo.io/${encodeURIComponent(cleanIp)}`;
    }
    return null;
  }

  const loadOrders = useCallback(async () => {
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

  const loadUnfinished = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await fetchUnfinishedOrders({
      status: unfinishedStatusFilter || undefined,
      phone: phoneSearch.trim() || undefined,
      page,
      limit,
    });
    if (result.success && result.data) {
      setUnfinishedOrders((result.data as UnfinishedOrder[]) || []);
      setUnfinishedPagination((result as { pagination?: Pagination }).pagination || null);
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to load unfinished orders");
    }
    setLoading(false);
  }, [unfinishedStatusFilter, phoneSearch, page, limit]);

  const load = useCallback(() => {
    if (activeTab === "orders") {
      loadOrders();
    } else {
      loadUnfinished();
    }
  }, [activeTab, loadOrders, loadUnfinished]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset selection when switching tabs/pages/filters
  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, page, limit, statusFilter, unfinishedStatusFilter, phoneSearch]);

  async function handleUnfinishedStatusChange(id: string, status: string) {
    setUpdatingId(id);
    const result = await changeUnfinishedOrderStatus(id, status);
    if (result.success) {
      const updatedOrder = (result.data as UnfinishedOrder) || null;
      setUnfinishedOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                status: (updatedOrder?.status || status) as UnfinishedOrder["status"],
                statusUpdatedBy: updatedOrder?.statusUpdatedBy || o.statusUpdatedBy,
                statusUpdatedAt: updatedOrder?.statusUpdatedAt || o.statusUpdatedAt,
              }
            : o
        )
      );
      setDrawerUnfinishedOrder((prev) => {
        if (prev && prev._id === id) {
          return {
            ...prev,
            status: (updatedOrder?.status || status) as UnfinishedOrder["status"],
            statusUpdatedBy: updatedOrder?.statusUpdatedBy || prev.statusUpdatedBy,
            statusUpdatedAt: updatedOrder?.statusUpdatedAt || prev.statusUpdatedAt,
          };
        }
        return prev;
      });
      setSuccessMsg("Unfinished order status updated");
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update status");
    }
    setUpdatingId(null);
  }

  async function handleDeleteUnfinished(id: string) {
    if (!confirm("Are you sure you want to delete this unfinished order record?")) return;
    setUpdatingId(id);
    const result = await deleteUnfinishedOrder(id);
    if (result.success) {
      setUnfinishedOrders((prev) => prev.filter((o) => o._id !== id));
      if (drawerUnfinishedOrder?._id === id) setDrawerUnfinishedOrder(null);
      setSuccessMsg("Unfinished order deleted");
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to delete record");
    }
    setUpdatingId(null);
  }

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
      const updatedOrder = (result.data as Order) || null;
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id === id) {
            // If changing away from Cancelled, remove from selected list
            if (status !== "Cancelled" && selectedIds.includes(id)) {
              setSelectedIds((ids) => ids.filter((i) => i !== id));
            }
            return {
              ...o,
              status,
              statusUpdatedBy: updatedOrder?.statusUpdatedBy || o.statusUpdatedBy,
              statusUpdatedAt: updatedOrder?.statusUpdatedAt || o.statusUpdatedAt,
            };
          }
          return o;
        })
      );
      setDrawerOrder((prev) => {
        if (prev && prev._id === id) {
          return {
            ...prev,
            status,
            statusUpdatedBy: updatedOrder?.statusUpdatedBy || prev.statusUpdatedBy,
            statusUpdatedAt: updatedOrder?.statusUpdatedAt || prev.statusUpdatedAt,
          };
        }
        return prev;
      });
      // Confirming triggers the automatic Steadfast entry server-side; pull
      // the list again shortly so the new tracking code shows up.
      if (status === "Confirmed") {
        setTimeout(() => loadOrders(), 4000);
      }
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update status");
    }
    setUpdatingId(null);
  }

  const [checkingFraudId, setCheckingFraudId] = useState<string | null>(null);

  async function handleCheckFraud(id: string) {
    setCheckingFraudId(id);
    const result = await checkOrderFraud(id);
    if (result.success && result.data) {
      const updatedOrder = result.data as Order;
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, steadfastFraud: updatedOrder.steadfastFraud } : o
        )
      );
      setDrawerOrder((prev) => (prev && prev._id === id ? { ...prev, steadfastFraud: updatedOrder.steadfastFraud } : prev));
      setSuccessMsg("Steadfast fraud check updated");
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to retrieve Steadfast fraud data");
    }
    setCheckingFraudId(null);
  }

  // Open Edit Modal
  function handleOpenEdit(order: Order) {
    setEditOrder(order);
    setEditError("");
    setEditForm({
      customerName: order.customerName || "",
      address: order.address || "",
      thana: order.thana || "",
      district: order.district || "",
      flavour: order.flavour || "Dark Chocolate",
    });
  }

  // Save Edited Details
  async function handleSaveEdit() {
    if (!editOrder) return;

    if (!editForm.customerName.trim()) {
      setEditError("Customer Name is required");
      return;
    }

    setIsSavingEdit(true);
    setEditError("");

    const result = await updateOrderDetails(editOrder._id, editForm);
    setIsSavingEdit(false);

    if (result.success && result.data) {
      const updated = result.data as Order;
      setOrders((prev) => prev.map((o) => (o._id === editOrder._id ? updated : o)));
      setDrawerOrder((prev) => (prev && prev._id === editOrder._id ? updated : prev));
      setSuccessMsg(`Order #${editOrder._id.slice(-6)} updated successfully.`);
      setEditOrder(null);
    } else {
      setEditError(typeof result.error === "string" ? result.error : "Failed to update order details");
    }
  }

  // Create a manual order (no SMS is sent; never reported to Meta)
  async function handleSaveAdd() {
    const phoneTrimmed = addForm.phone.trim();
    if (!PHONE_REGEX.test(phoneTrimmed)) {
      setAddError("Enter a valid 11-digit phone number (01XXXXXXXXX)");
      return;
    }
    const priceNum = Number(addForm.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setAddError("Enter a valid price");
      return;
    }

    setIsSavingAdd(true);
    setAddError("");

    const result = await createOrderAdmin({
      product: addForm.product,
      customerName: addForm.customerName.trim() || undefined,
      phone: phoneTrimmed,
      address: addForm.address.trim(),
      flavour: addForm.flavour,
      paymentMethod: addForm.paymentMethod,
      transactionId: addForm.paymentMethod === "bKash" ? addForm.transactionId.trim() : "",
      price: priceNum,
    });
    setIsSavingAdd(false);

    if (result.success && result.data) {
      setIsAddOpen(false);
      setSuccessMsg(`Manual order for ${phoneTrimmed} created (Confirmed).`);
      // setPage(1) is a no-op when already on page 1, so call load() directly there
      if (page !== 1) setPage(1);
      else load();
    } else {
      setAddError(typeof result.error === "string" ? result.error : "Failed to create order");
    }
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

  // Quotes and escapes a value so commas, quotes and newlines inside it
  // (referrers and landing URLs are full of them) cannot break the CSV.
  function csvCell(value: unknown) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  // UTF-8 BOM keeps MS Excel from mangling the Bengali columns.
  function downloadCsv(filename: string, content: string) {
    const blob = new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export Filtered Orders to Excel (CSV with UTF-8 BOM encoding)
  async function handleExportExcel() {
    setIsExporting(true);
    try {
      const result = await fetchOrders({
        status: statusFilter || undefined,
        phone: phoneSearch.trim() || undefined,
        page: 1,
        limit: 5000, // Export up to 5,000 filtered orders
      });

      const exportData = (result.success && Array.isArray(result.data) ? result.data : orders) as Order[];

      if (!exportData || exportData.length === 0) {
        alert("No matching orders found to export.");
        setIsExporting(false);
        return;
      }

      const headers = [
        "Order ID",
        "Date",
        "Product",
        "Customer Name",
        "Phone",
        "Address",
        "Thana",
        "District",
        "Flavour",
        "Price (BDT)",
        "Payment Method",
        "Payment Status",
        "Transaction ID",
        "Client IP",
        "Status",
        "Source",
        "Courier Tracking",
        "Courier Status",
        "Updated By",
        "Update Time",
        // Ad attribution, captured on the landing page
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "UTM Content",
        "UTM Term",
        "GCLID",
        "GBRAID",
        "WBRAID",
        "FBCLID",
        "Referrer",
        "Landing URL",
        "Meta Purchase Sent",
        "Meta Purchase Status",
      ];

      const rows = exportData.map((o) => {
        const a = o.attribution || {};
        return [
          o._id,
          new Date(o.orderTime || o.createdAt).toLocaleString("en-GB", { hour12: true }),
          csvCell(getOrderProductDetails(o.product, o.pageUrl, o.productSlug).name),
          csvCell(o.customerName),
          csvCell(o.phone),
          csvCell(o.address),
          csvCell(o.thana),
          csvCell(o.district),
          csvCell(o.flavour),
          o.price,
          o.paymentStatus === "Paid" ? "bKash" : "COD",
          o.paymentStatus || "Pending",
          o.transactionId ? csvCell(o.transactionId) : "",
          csvCell(o.ipAddress),
          o.status,
          o.source === "admin" ? "Manual" : "Web",
          csvCell(o.steadfastTrackingCode || o.steadfastConsignmentId),
          csvCell((o.steadfastStatus || "").replace(/_/g, " ")),
          csvCell(o.statusUpdatedBy),
          o.statusUpdatedAt ? new Date(o.statusUpdatedAt).toLocaleString("en-GB", { hour12: true }) : "",
          csvCell(a.utmSource),
          csvCell(a.utmMedium),
          csvCell(a.utmCampaign),
          csvCell(a.utmContent),
          csvCell(a.utmTerm),
          csvCell(a.gclid),
          csvCell(a.gbraid),
          csvCell(a.wbraid),
          csvCell(a.fbclid),
          csvCell(a.referrer),
          csvCell(a.landingUrl),
          o.metaPurchaseSentAt
            ? new Date(o.metaPurchaseSentAt).toLocaleString("en-GB", { hour12: true })
            : "",
          o.metaPurchaseStatus || "",
        ];
      });

      const dateStr = new Date().toISOString().split("T")[0];
      const filterLabel = statusFilter ? statusFilter.toLowerCase() : "all";
      downloadCsv(
        `milkimom_orders_${filterLabel}_${dateStr}.csv`,
        `${headers.join(",")}\n${rows.map((row) => row.join(",")).join("\n")}`
      );
    } catch {
      alert("Failed to export orders. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  /**
   * Exports confirmed orders that carry a Google click id, in the exact upload
   * format Google Ads expects at Tools → Conversions → Uploads.
   *
   * There is no gtag on the site: the browser never sees a Google conversion,
   * so the click id captured on the landing page plus this file is how a
   * confirmed sale gets credited back to the Google campaign that produced it.
   */
  async function handleExportGoogleAds() {
    setIsExportingGoogleAds(true);
    try {
      const result = await fetchOrders({
        status: statusFilter || undefined,
        phone: phoneSearch.trim() || undefined,
        page: 1,
        limit: 5000,
      });

      const source = (result.success && Array.isArray(result.data) ? result.data : orders) as Order[];

      // Only confirmed-or-later sales, and only ones Google can actually match.
      const exportData = source.filter(
        (o) =>
          PURCHASE_STATUSES.includes(o.status) &&
          o.source !== "admin" &&
          Boolean(o.attribution?.gclid)
      );

      if (exportData.length === 0) {
        alert(
          "No confirmed orders with a Google click id (gclid) found.\n\n" +
            "Only orders placed after Google Ads attribution tracking went live can be uploaded."
        );
        return;
      }

      // Google wants "yyyy-MM-dd HH:mm:ss" in the timezone declared on line 1.
      const conversionTime = (value?: string | null) => {
        const d = value ? new Date(value) : new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        return (
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
          `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        );
      };

      const lines = [
        "Parameters:TimeZone=+0600",
        "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
        ...exportData.map((o) =>
          [
            csvCell(o.attribution?.gclid),
            csvCell(
              `${getOrderProductDetails(o.product, o.pageUrl, o.productSlug).name} Confirmed Order`
            ),
            csvCell(conversionTime(o.statusUpdatedAt || o.orderTime || o.createdAt)),
            o.price,
            "BDT",
          ].join(",")
        ),
      ];

      const dateStr = new Date().toISOString().split("T")[0];
      downloadCsv(`google_ads_offline_conversions_${dateStr}.csv`, lines.join("\n"));
    } catch {
      alert("Failed to export Google Ads conversions. Please try again.");
    } finally {
      setIsExportingGoogleAds(false);
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

  // Available flavors for dropdown
  const availableFlavors = Array.from(
    new Set([
      ...flavors.map((f) => f.nameEn || f.name),
      ...flavors.map((f) => f.name),
      "Dark Chocolate",
      "Vanilla",
      "Cardamom",
      "Cinnamon",
    ])
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation: Regular Orders vs Unfinished Orders */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => {
            setActiveTab("orders");
            setPage(1);
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer",
            activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ShoppingCart className="size-4" />
          <span>অর্ডার সমূহ (Orders)</span>
          {pagination !== null && (
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-extrabold">
              {pagination.total}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("unfinished");
            setPage(1);
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer",
            activeTab === "unfinished"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <AlertCircle className="size-4 text-amber-500 fill-amber-500/20" />
          <span>অসম্পূর্ণ অর্ডার (Unfinished Orders)</span>
          {unfinishedPagination !== null && (
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-extrabold">
              {unfinishedPagination.total}
            </span>
          )}
        </button>
      </div>

      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "orders" ? "Orders" : "Unfinished Orders"}
            </h1>
            {activeTab === "orders" && pagination !== null && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary border border-primary/20">
                {pagination.total} {pagination.total === 1 ? "Order" : "Orders"}
              </span>
            )}
            {activeTab === "unfinished" && unfinishedPagination !== null && (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-600 border border-amber-500/20">
                {unfinishedPagination.total} Unfinished
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activeTab === "orders"
              ? "Manage customer orders, edit details, track status, print invoices, export data, and perform bulk operations."
              : "Track incomplete order attempts when customers enter their mobile number or fill out the form."}
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

          {/* Status Filter for active tab */}
          {activeTab === "orders" ? (
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
          ) : (
            <select
              value={unfinishedStatusFilter}
              onChange={(e) => {
                setUnfinishedStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary font-semibold"
            >
              <option value="">All statuses</option>
              {UNFINISHED_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Add Manual Order Button (Regular orders only, not for moderators) */}
          {activeTab === "orders" && !isModerator && (
            <button
              onClick={() => {
                setAddForm(emptyAddForm);
                setAddError("");
                setIsAddOpen(true);
              }}
              title="Manually add an order from a message campaign"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 shadow-xs"
            >
              <Plus size={14} /> Add Order
            </button>
          )}

          {/* Export Excel Button (Regular orders only) */}
          {activeTab === "orders" && (
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              title="Export filtered orders to Excel / CSV"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            >
              {isExporting ? (
                <Loader2 size={14} className="animate-spin text-emerald-700 dark:text-emerald-300" />
              ) : (
                <Download size={14} />
              )}
              Export Excel
            </button>
          )}

          {/* Google Ads offline conversion upload file. The site has no gtag,
              so this is how a confirmed sale gets credited to its Google campaign. */}
          {activeTab === "orders" && (
            <button
              onClick={handleExportGoogleAds}
              disabled={isExportingGoogleAds}
              title="Export confirmed orders with a Google click id, ready to upload at Google Ads → Tools → Conversions → Uploads"
              className="flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800/40 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              {isExportingGoogleAds ? (
                <Loader2 size={14} className="animate-spin text-blue-700 dark:text-blue-300" />
              ) : (
                <Download size={14} />
              )}
              Google Ads
            </button>
          )}

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
      {activeTab === "unfinished" ? (
        loading ? (
          <div className="flex justify-center rounded-xl border border-border bg-card p-16">
            <Loader2 className="animate-spin text-amber-600" size={32} />
          </div>
        ) : unfinishedOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-16 text-center font-medium text-muted-foreground">
            No unfinished orders found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-3 py-2.5 whitespace-nowrap">Time</th>
                  <th className="px-3 py-2.5 max-w-[130px]">Customer</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Phone & Actions</th>
                  <th className="px-3 py-2.5 max-w-[140px]">Location</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Product</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Flavour & Price</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Client IP</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Status Tag Selection</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Updated By</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Update Time</th>
                  <th className="px-3 py-2.5 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {unfinishedOrders.map((u) => {
                  const isUpdating = updatingId === u._id;
                  const rawPhone = u.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    "আসসালামু আলাইকুম, মিল্কিমম থেকে যোগাযোগ করা হচ্ছে।"
                  )}`;

                  return (
                    <tr
                      key={u._id}
                      onClick={(e) => handleUnfinishedRowClick(e, u)}
                      title="Click row to view details in side drawer"
                      className="border-b border-border/60 transition last:border-0 hover:bg-muted/70 cursor-pointer"
                    >
                      {/* Time */}
                      <td className="px-3 py-3 text-xs whitespace-nowrap">
                        <span className="font-semibold text-foreground">
                          {new Date(u.updatedAt || u.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {new Date(u.updatedAt || u.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="px-3 py-3 font-semibold text-foreground">
                        {u.customerName || "Customer"}
                      </td>

                      {/* Phone & Contact Buttons */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">{u.phone}</span>
                          <a
                            href={`tel:${u.phone}`}
                            title="Call Customer"
                            className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            <PhoneCall size={13} />
                          </a>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp Customer"
                            className="inline-flex size-7 items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/60 dark:text-green-300"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3 text-xs">
                        {u.address || u.thana || u.district ? (
                          <div>
                            <span className="font-semibold text-foreground truncate max-w-[220px] block" title={u.address}>
                              {u.address || [u.thana, u.district].filter(Boolean).join(", ")}
                            </span>
                            {u.address && (u.thana || u.district) && (
                              <span className="block text-[11px] text-muted-foreground truncate max-w-[180px]">
                                {[u.thana, u.district].filter(Boolean).join(", ")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Not filled</span>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {(() => {
                          const prodDetails = getOrderProductDetails(u.product || u.productName);
                          return (
                            <div className="flex items-center gap-2">
                              <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/40 p-0.5 flex items-center justify-center">
                                <img
                                  src={prodDetails.image}
                                  alt={prodDetails.name}
                                  className="h-full w-auto max-w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/product-jar.webp";
                                  }}
                                />
                              </div>
                              <span className="font-bold text-xs text-foreground truncate max-w-[110px]" title={prodDetails.name}>
                                {prodDetails.name}
                              </span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Flavour & Price */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {(() => {
                          const matchedFlavor = flavors.find(
                            (f) =>
                              f.nameEn?.toLowerCase() === (u.flavour || "").toLowerCase() ||
                              f.name?.toLowerCase() === (u.flavour || "").toLowerCase()
                          );
                          const displayPrice =
                            u.price && u.price !== 1200
                              ? u.price
                              : matchedFlavor
                              ? matchedFlavor.salePrice
                              : 4990;

                          return (
                            <>
                              <span className="font-semibold text-foreground">{u.flavour || "Dark Chocolate"}</span>
                              <span className="block text-xs font-bold text-primary">
                                ৳{displayPrice.toLocaleString("bn-BD")}
                              </span>
                            </>
                          );
                        })()}
                      </td>

                      {/* Client IP & Location Tracking */}
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {(() => {
                          const ip = u.ipAddress;
                          const ipLoc = dynamicIpLocs[u._id] || u.ipLocation;
                          const mapUrl = getIpMapUrl(ipLoc, ip);
                          const isLocal = ip === "127.0.0.1" || ip === "::1" || ipLoc?.city === "Local Host";

                          return (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span>{ip || "Unknown"}</span>
                                {mapUrl && (
                                  <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={
                                      ipLoc?.loc
                                        ? `Open exact IP coordinates (${ipLoc.loc}) on Google Maps`
                                        : ipLoc?.city
                                        ? `Open IP location (${[ipLoc.city, ipLoc.country].filter(Boolean).join(", ")}) on Google Maps`
                                        : `View IP geolocation details for ${ip}`
                                    }
                                    className="inline-flex items-center gap-0.5 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-blue-300"
                                  >
                                    <MapPin size={10} />
                                    <span>Map</span>
                                  </a>
                                )}
                              </div>

                              {ipLoc?.city || ipLoc?.country ? (
                                <span className="text-[10px] font-sans font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[130px]" title={[ipLoc.city, ipLoc.region, ipLoc.country].filter(Boolean).join(", ")}>
                                  📍 {[ipLoc.city, ipLoc.country].filter(Boolean).join(", ")}
                                </span>
                              ) : ip && !isLocal ? (
                                <button
                                  type="button"
                                  onClick={() => handleLookupIp(u._id, ip, "unfinished")}
                                  disabled={fetchingIpId === u._id}
                                  className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-muted-foreground hover:text-primary underline cursor-pointer"
                                  title="Lookup IP geolocation via ipinfo.io"
                                >
                                  {fetchingIpId === u._id ? <Loader2 size={10} className="animate-spin" /> : <Globe size={10} />}
                                  <span>{fetchingIpId === u._id ? "Locating..." : "Fetch Loc"}</span>
                                </button>
                              ) : null}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status Tag Selection */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <select
                          value={u.status}
                          disabled={isUpdating}
                          onChange={(e) => handleUnfinishedStatusChange(u._id, e.target.value)}
                          className={cn(
                            "rounded-lg px-2.5 py-1 text-xs font-bold border outline-none cursor-pointer transition-all",
                            UNFINISHED_STATUS_COLORS[u.status] || "bg-muted text-muted-foreground"
                          )}
                        >
                          <option value="Pending">Pending (পেন্ডিং)</option>
                          <option value="Called User">Called User (কল করা হয়েছে)</option>
                          <option value="Cancelled">Cancelled (বাতিল)</option>
                          <option value="Spam">Spam (স্প্যাম)</option>
                        </select>
                      </td>

                      {/* Updated By */}
                      <td className="px-3 py-3 text-xs whitespace-nowrap font-medium text-foreground">
                        {u.statusUpdatedBy || "-"}
                      </td>

                      {/* Update Time */}
                      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {u.statusUpdatedAt
                          ? new Date(u.statusUpdatedAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDrawerUnfinishedOrder(u)}
                            title="View All Details in Side Drawer"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-primary hover:bg-primary/10 transition"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteUnfinished(u._id)}
                            disabled={isUpdating}
                            title="Delete Record"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : loading ? (
        <div className="flex justify-center rounded-xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center font-medium text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {/* Header Checkmark */}
                <th className="w-8 px-2 py-3 text-center">
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
                <th className="px-3.5 py-3 whitespace-nowrap">Date</th>
                <th className="px-3.5 py-3 font-medium">Customer & Phone</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Product</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Flavour & Price</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Payment</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Status</th>
                <th className="px-3.5 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCancelled = order.status === "Cancelled";
                const isSelected = selectedIds.includes(order._id);

                return (
                  <tr
                    key={order._id}
                    onClick={(e) => handleRowClick(e, order)}
                    title="Click row to view complete order details in side drawer"
                    className={`border-b border-border/60 transition last:border-0 hover:bg-muted/70 cursor-pointer ${
                      isSelected ? "bg-red-50/50 dark:bg-red-950/20" : ""
                    }`}
                  >
                    {/* Checkmark selection column */}
                    <td className="w-8 px-2 py-3 text-center">
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
                    <td className="px-3.5 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground block">
                        {new Date(order.orderTime || order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(order.orderTime || order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </td>

                    {/* Customer & Phone */}
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-xs text-foreground truncate max-w-[170px]" title={order.customerName}>
                          {order.customerName || "Customer"}
                        </span>
                        {order.source === "admin" && (
                          <span className="shrink-0 inline-flex items-center rounded border border-violet-200 bg-violet-100 px-1.5 py-px text-[10px] font-bold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/50 dark:text-violet-300">
                            Manual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-semibold text-foreground/80">{order.phone}</span>
                        {order.steadfastFraud?.totalFraudReports && order.steadfastFraud.totalFraudReports > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-1.5 py-px rounded">
                            <AlertTriangle size={10} /> Risk
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {(() => {
                        const prodDetails = getOrderProductDetails(order.product, order.pageUrl, order.productSlug);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/40 p-0.5 flex items-center justify-center">
                              <img
                                src={prodDetails.image}
                                alt={prodDetails.name}
                                className="h-full w-auto max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/product-jar.webp";
                                }}
                              />
                            </div>
                            <span className="font-bold text-xs text-foreground truncate max-w-[110px]" title={prodDetails.name}>
                              {prodDetails.name}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Flavour & Price */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold text-foreground block">{order.flavour || "Dark Chocolate"}</span>
                      <span className="text-xs font-bold text-primary">৳{order.price}</span>
                    </td>

                    {/* Payment */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                            : "bg-muted text-muted-foreground border border-border/60"
                        }`}
                      >
                        {order.paymentStatus === "Paid" ? "Paid (bKash)" : "COD"}
                      </span>
                      {order.transactionId && (
                        <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[100px] mt-0.5">
                          {order.transactionId}
                        </p>
                      )}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {isModerator ? (
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${
                            STATUS_COLORS[order.status] || "border-border bg-muted text-foreground"
                          }`}
                        >
                          {order.status}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-bold outline-none disabled:opacity-50 ${
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
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-3.5 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Drawer Button */}
                        <button
                          onClick={() => setDrawerOrder(order)}
                          title="View All Details in Side Drawer"
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-primary transition hover:bg-primary/10"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Print Invoice Button */}
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          title="Print Invoice"
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-purple-600 transition hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950/50"
                        >
                          <Printer size={15} />
                        </button>

                        {/* Edit Order Button */}
                        {!isModerator && (
                          <button
                            onClick={() => handleOpenEdit(order)}
                            title="Edit Order Details"
                            className="inline-flex items-center justify-center rounded-lg p-1.5 text-amber-600 transition hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-950/50"
                          >
                            <Pencil size={15} />
                          </button>
                        )}

                        {/* Track Order Button */}
                        <Link
                          href={`/track/${order._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Track Order"
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950/50"
                        >
                          <ExternalLink size={15} />
                        </Link>

                        {/* Delete Button */}
                        {canDelete && (
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
                            <Trash2 size={15} />
                          </button>
                        )}
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

      {/* Modal - Edit Order Details */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Edit Order Details</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Order #{editOrder._id.slice(-6).toUpperCase()} ({editOrder.phone})
                </p>
              </div>
              <button
                onClick={() => setEditOrder(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive">
                {editError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Customer Name */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Location Fields: Address Textarea */}
              <div className="space-y-3">
                <label className="block font-bold text-foreground">
                  Location Details
                </label>

                <div>
                  <span className="block text-muted-foreground mb-1 font-semibold">
                    Full Address / বাসার পূর্ণ ঠিকানা (এলাকা, থানা, জেলা সহ লিখুন):
                  </span>
                  <textarea
                    rows={3}
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="House/Holding no, Road, Area, Thana, District"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Flavour Selection */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Flavour Selection
                </label>
                <select
                  value={editForm.flavour}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, flavour: e.target.value }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {availableFlavors.map((flv) => (
                    <option key={flv} value={flv}>
                      {flv}
                    </option>
                  ))}
                  {!availableFlavors.includes(editForm.flavour) && editForm.flavour && (
                    <option value={editForm.flavour}>{editForm.flavour}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                disabled={isSavingEdit}
                onClick={() => setEditOrder(null)}
                className="rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-xs"
              >
                {isSavingEdit && <Loader2 className="animate-spin" size={14} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Add Manual Order */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Add Manual Order</h3>
                <p className="text-xs text-muted-foreground">
                  For message/chat campaign sales — no SMS is sent, not reported to Meta.
                </p>
              </div>
              <button
                disabled={isSavingAdd}
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {addError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive">
                {addError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Product */}
              <div>
                <label className="block font-bold text-foreground mb-1">Product</label>
                <select
                  value={addForm.product}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, product: e.target.value }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="Milkimom Complete Dose">Milkimom (মিল্কিমম)</option>
                  <option value="SmoothFlow Complete Dose">SmoothFlow (স্মুথফ্লো)</option>
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block font-bold text-foreground mb-1">Customer Name</label>
                <input
                  type="text"
                  value={addForm.customerName}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-foreground mb-1">Phone *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addForm.phone}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Full Address / বাসার পূর্ণ ঠিকানা (এলাকা, থানা, জেলা সহ লিখুন)
                </label>
                <textarea
                  rows={3}
                  value={addForm.address}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="House/Holding no, Road, Area, Thana, District"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Flavour */}
              <div>
                <label className="block font-bold text-foreground mb-1">Flavour</label>
                <select
                  value={addForm.flavour}
                  onChange={(e) => {
                    const picked = e.target.value;
                    // Pull the catalog price for the chosen flavour; the admin
                    // can still override it in the price field below.
                    const match = flavors.find(
                      (f) => f.nameEn === picked || f.name === picked
                    );
                    setAddForm((prev) => ({
                      ...prev,
                      flavour: picked,
                      price: match ? String(match.salePrice) : prev.price,
                    }));
                  }}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {availableFlavors.map((flv) => (
                    <option key={flv} value={flv}>
                      {flv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Payment Method</label>
                  <select
                    value={addForm.paymentMethod}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value as "COD" | "bKash",
                      }))
                    }
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="bKash">bKash (Paid)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Price (BDT) *</label>
                  <input
                    type="number"
                    min={1}
                    value={addForm.price}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              </div>

              {/* Transaction ID (bKash only) */}
              {addForm.paymentMethod === "bKash" && (
                <div>
                  <label className="block font-bold text-foreground mb-1">
                    bKash Transaction ID
                  </label>
                  <input
                    type="text"
                    value={addForm.transactionId}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, transactionId: e.target.value }))
                    }
                    placeholder="e.g. 9C7XXXXXXX"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                disabled={isSavingAdd}
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isSavingAdd}
                onClick={handleSaveAdd}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-xs"
              >
                {isSavingAdd && <Loader2 className="animate-spin" size={14} />}
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Single Delete */}
      {singleDeleteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
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
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
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
          <div className="print-invoice-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-white text-gray-900 p-8 shadow-2xl space-y-6">
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

      {/* Right-Side Slide-Over Drawer for Order Details */}
      {drawerOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setDrawerOrder(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl border-l border-border bg-card shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-mono text-foreground">
                        Order #{drawerOrder._id.slice(-6).toUpperCase()}
                      </h2>
                      {drawerOrder.source === "admin" ? (
                        <span className="rounded border border-violet-200 bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/50 dark:text-violet-300">
                          Manual Sale
                        </span>
                      ) : (
                        <span className="rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-800/40 dark:bg-blue-950/50 dark:text-blue-300">
                          Website Order
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {new Date(drawerOrder.orderTime || drawerOrder.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOrder(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                  title="Close Drawer (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Card 1: Customer Details */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <User size={16} className="text-primary" />
                      <span>Customer Information</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${drawerOrder.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                        title="Call Customer"
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${drawerOrder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          "আসসালামু আলাইকুম, মিল্কিমম থেকে যোগাযোগ করা হচ্ছে।"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950/60 dark:text-green-300 transition"
                        title="WhatsApp Chat"
                      >
                        <ExternalLink size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground font-medium block">Customer Name</span>
                      <span className="font-bold text-foreground text-sm">{drawerOrder.customerName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium block">Phone Number</span>
                      <span className="font-mono font-bold text-foreground text-sm">{drawerOrder.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground font-medium block">Delivery Address</span>
                      <p className="font-semibold text-foreground mt-0.5 bg-background p-2.5 rounded-lg border border-border/60">
                        {drawerOrder.address || "Address not provided"}
                        {(drawerOrder.thana || drawerOrder.district) && (
                          <span className="block text-muted-foreground font-normal mt-1">
                            {[drawerOrder.thana, drawerOrder.district].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Steadfast Delivery History & Fraud Reports (Under Customer Info) */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <ShieldCheck size={16} className="text-primary" />
                      <span>Courier History & Fraud Check</span>
                    </div>
                    <button
                      onClick={() => handleCheckFraud(drawerOrder._id)}
                      disabled={checkingFraudId === drawerOrder._id}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300 transition cursor-pointer disabled:opacity-50"
                    >
                      {checkingFraudId === drawerOrder._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      <span>Check Fraud</span>
                    </button>
                  </div>

                  <div className="text-xs">
                    {(() => {
                      const fraud = drawerOrder.steadfastFraud;
                      if (!fraud || fraud.checkedAt === undefined || fraud.checkedAt === null) {
                        return (
                          <p className="text-muted-foreground">
                            Click "Check Fraud" to query Steadfast API for previous delivery success rate & fraud reports.
                          </p>
                        );
                      }

                      if (fraud.error) {
                        return <p className="text-red-500 font-semibold">{fraud.error}</p>;
                      }

                      const totalParcels = fraud.totalParcels ?? 0;
                      const totalDelivered = fraud.totalDelivered ?? 0;
                      const totalCancelled = fraud.totalCancelled ?? 0;
                      const totalReports = fraud.totalFraudReports ?? 0;
                      const successRate = fraud.successRate ?? null;

                      if (totalParcels <= 0) {
                        return (
                          <div className="p-3 bg-card rounded-lg border border-border/60 flex items-center gap-2 text-muted-foreground font-semibold">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span>New Customer — No prior delivery history recorded on Steadfast.</span>
                          </div>
                        );
                      }

                      const isHighRisk = totalReports > 0 || (successRate !== null && successRate < 50);

                      return (
                        <div className="space-y-3">
                          <div
                            className={`p-3 rounded-lg border flex items-center justify-between ${
                              isHighRisk
                                ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/50"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold">
                              {isHighRisk ? <AlertTriangle size={18} className="text-red-600" /> : <ShieldCheck size={18} className="text-emerald-600" />}
                              <span>{isHighRisk ? "Risk Alert" : "Good Customer Standing"}</span>
                            </div>
                            <span className="text-sm font-black">{successRate !== null ? `${successRate}% Delivered` : "-"}</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-center font-semibold">
                            <div className="p-2 bg-background rounded-lg border border-border/60">
                              <span className="text-muted-foreground text-[10px] block">Parcels</span>
                              <span className="text-foreground text-sm font-bold">{totalParcels}</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border border-border/60">
                              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] block">Delivered</span>
                              <span className="text-emerald-700 dark:text-emerald-300 text-sm font-bold">{totalDelivered}</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border border-border/60">
                              <span className="text-red-600 dark:text-red-400 text-[10px] block">Cancelled</span>
                              <span className="text-red-700 dark:text-red-300 text-sm font-bold">{totalCancelled}</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border border-border/60">
                              <span className="text-amber-600 dark:text-amber-400 text-[10px] block">Reports</span>
                              <span className="text-amber-700 dark:text-amber-300 text-sm font-bold">{totalReports}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Card 3: Client IP & Geolocation (Under Fraud Check) */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Globe size={16} className="text-primary" />
                      <span>Client IP & Geolocation</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    {(() => {
                      const ip = drawerOrder.ipAddress;
                      const ipLoc = dynamicIpLocs[drawerOrder._id] || drawerOrder.ipLocation;
                      const mapUrl = getIpMapUrl(ipLoc, ip);
                      const isLocal = ip === "127.0.0.1" || ip === "::1" || ipLoc?.city === "Local Host";

                      return (
                        <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/60">
                          <div>
                            <span className="text-muted-foreground font-medium block">IP Address</span>
                            <span className="font-mono font-bold text-foreground">{ip || "Unknown"}</span>
                            {ipLoc?.city || ipLoc?.country ? (
                              <span className="block text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] mt-0.5">
                                📍 {[ipLoc.city, ipLoc.region, ipLoc.country].filter(Boolean).join(", ")}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2">
                            {ip && !isLocal && !ipLoc?.city && (
                              <button
                                type="button"
                                onClick={() => handleLookupIp(drawerOrder._id, ip, "orders")}
                                disabled={fetchingIpId === drawerOrder._id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-input bg-card text-foreground hover:bg-muted cursor-pointer"
                              >
                                {fetchingIpId === drawerOrder._id ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
                                <span>Locate</span>
                              </button>
                            )}
                            {mapUrl && (
                              <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
                              >
                                <MapPin size={12} />
                                <span>Google Maps</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Card 4: Product & Payment Information */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <CreditCard size={16} className="text-primary" />
                      <span>Product & Payment</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        drawerOrder.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {drawerOrder.paymentStatus === "Paid" ? "Paid (bKash)" : "Cash on Delivery (COD)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {(() => {
                      const drawerProdDetails = getOrderProductDetails(drawerOrder.product, drawerOrder.pageUrl, drawerOrder.productSlug);
                      return (
                        <div className="col-span-2 flex items-center gap-3 bg-background p-2.5 rounded-lg border border-border/60">
                          <img
                            src={drawerProdDetails.image}
                            alt={drawerProdDetails.name}
                            className="size-9 object-contain rounded shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/product-jar.webp";
                            }}
                          />
                          <div>
                            <span className="text-muted-foreground font-medium text-[10px] block">Product Ordered</span>
                            <span className="font-bold text-foreground text-xs">{drawerProdDetails.fullName}</span>
                          </div>
                        </div>
                      );
                    })()}
                    <div>
                      <span className="text-muted-foreground font-medium block">Selected Flavour</span>
                      <span className="font-bold text-foreground">{drawerOrder.flavour || "Dark Chocolate"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium block">Total Price</span>
                      <span className="font-bold text-primary text-base">৳{drawerOrder.price}</span>
                    </div>
                    {drawerOrder.transactionId && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground font-medium block">bKash TrxID</span>
                        <span className="font-mono font-bold text-foreground bg-background px-2 py-1 rounded border border-border/60 inline-block">
                          {drawerOrder.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 5: Order Status & Audit Trail */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <RefreshCw size={16} className="text-primary" />
                      <span>Order Status & Audit</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-muted-foreground font-medium block mb-1">Update Status</span>
                      {isModerator ? (
                        <span
                          className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold ${
                            STATUS_COLORS[drawerOrder.status] || "border-border bg-muted text-foreground"
                          }`}
                        >
                          {drawerOrder.status}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={drawerOrder.status}
                            disabled={updatingId === drawerOrder._id}
                            onChange={(e) => handleStatusChange(drawerOrder._id, e.target.value)}
                            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold outline-none disabled:opacity-50 ${
                              STATUS_COLORS[drawerOrder.status] || "border-border bg-muted text-foreground"
                            }`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {updatingId === drawerOrder._id && (
                            <Loader2 className="animate-spin text-muted-foreground" size={14} />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted-foreground font-medium block">Updated By</span>
                        <span className="font-semibold text-foreground">{drawerOrder.statusUpdatedBy || "System / Initial"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">Updated At</span>
                        <span className="font-semibold text-foreground">
                          {drawerOrder.statusUpdatedAt
                            ? new Date(drawerOrder.statusUpdatedAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 5b: Ad Attribution & Meta Purchase.
                    Captured on the landing page and carried on the order,
                    because Purchase is only reported to Meta once this order
                    is Confirmed — long after the browser session is gone. */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Globe size={16} className="text-primary" />
                      <span>Ad Attribution & Tracking</span>
                    </div>
                    {drawerOrder.source === "admin" && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        Manual — not reported
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Meta Purchase:</span>
                      {drawerOrder.metaPurchaseSentAt ? (
                        <span className="font-bold text-brand-green">
                          Sent ·{" "}
                          {new Date(drawerOrder.metaPurchaseSentAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {typeof drawerOrder.metaPurchaseValue === "number" &&
                            ` · ${drawerOrder.metaPurchaseValue}৳`}
                        </span>
                      ) : drawerOrder.metaPurchaseStatus === "failed" ? (
                        <span className="font-bold text-destructive">Failed — will retry hourly</span>
                      ) : PURCHASE_STATUSES.includes(drawerOrder.status) ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400">Sending…</span>
                      ) : (
                        <span className="font-semibold text-muted-foreground">
                          Waiting for Confirmed
                        </span>
                      )}
                    </div>

                    {drawerOrder.metaPurchaseError && (
                      <p className="rounded border border-destructive/30 bg-destructive/10 px-2 py-1 font-mono text-[10px] break-all text-destructive">
                        {drawerOrder.metaPurchaseError}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/40 pt-2">
                      {(
                        [
                          ["Source", drawerOrder.attribution?.utmSource],
                          ["Medium", drawerOrder.attribution?.utmMedium],
                          ["Campaign", drawerOrder.attribution?.utmCampaign],
                          ["Content", drawerOrder.attribution?.utmContent],
                          ["Term", drawerOrder.attribution?.utmTerm],
                          ["GCLID", drawerOrder.attribution?.gclid],
                          ["GBRAID", drawerOrder.attribution?.gbraid],
                          ["WBRAID", drawerOrder.attribution?.wbraid],
                          ["FBCLID", drawerOrder.attribution?.fbclid],
                        ] as Array<[string, string | undefined]>
                      )
                        .filter(([, value]) => Boolean(value))
                        .map(([label, value]) => (
                          <div key={label}>
                            <span className="text-muted-foreground font-medium block">{label}</span>
                            <span className="font-mono font-semibold text-foreground break-all">
                              {value}
                            </span>
                          </div>
                        ))}

                      <div>
                        <span className="text-muted-foreground font-medium block">Meta cookies</span>
                        <span className="font-semibold text-foreground">
                          {drawerOrder.fbp ? "fbp ✓" : "fbp ✗"} ·{" "}
                          {drawerOrder.fbc ? "fbc ✓" : "fbc ✗"}
                        </span>
                      </div>
                    </div>

                    {drawerOrder.attribution?.landingUrl && (
                      <div className="border-t border-border/40 pt-2">
                        <span className="text-muted-foreground font-medium block">Landing URL</span>
                        <span className="font-mono text-[10px] break-all text-foreground">
                          {drawerOrder.attribution.landingUrl}
                        </span>
                      </div>
                    )}

                    {drawerOrder.attribution?.referrer && (
                      <div>
                        <span className="text-muted-foreground font-medium block">Referrer</span>
                        <span className="font-mono text-[10px] break-all text-foreground">
                          {drawerOrder.attribution.referrer}
                        </span>
                      </div>
                    )}

                    {!drawerOrder.attribution?.landingUrl &&
                      !drawerOrder.attribution?.gclid &&
                      !drawerOrder.attribution?.fbclid &&
                      !drawerOrder.attribution?.utmSource && (
                        <p className="text-muted-foreground italic">
                          No attribution captured — either a direct/organic visit, or an order
                          placed before attribution tracking went live.
                        </p>
                      )}
                  </div>
                </div>

                {/* Card 6: Steadfast Courier & Shipping */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Truck size={16} className="text-primary" />
                      <span>Steadfast Courier Shipping</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    {drawerOrder.steadfastTrackingCode || drawerOrder.steadfastConsignmentId ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">Tracking Code / CID:</span>
                          <a
                            href={`https://steadfast.com.bd/t/${drawerOrder.steadfastTrackingCode || drawerOrder.steadfastConsignmentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 bg-background px-2.5 py-1 rounded border border-border/60"
                          >
                            <Truck size={13} />
                            {drawerOrder.steadfastTrackingCode || drawerOrder.steadfastConsignmentId}
                            <ExternalLink size={11} />
                          </a>
                        </div>
                        {drawerOrder.steadfastStatus && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-medium">Courier Status:</span>
                            <span className="font-bold text-foreground capitalize">
                              {drawerOrder.steadfastStatus.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : ["Confirmed", "Shipped"].includes(drawerOrder.status) ? (
                      <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">
                        <span>
                          {drawerOrder.steadfastLastError
                            ? `Last error: ${drawerOrder.steadfastLastError}`
                            : "Queued for Steadfast automatic delivery entry"}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 rounded">
                          {drawerOrder.steadfastLastError ? "Retrying" : "Queued"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No courier consignment assigned yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Action Footer */}
              <div className="border-t border-border px-6 py-4 bg-muted/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!isModerator && (
                    <button
                      onClick={() => {
                        handleOpenEdit(drawerOrder);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300 transition cursor-pointer"
                    >
                      <Pencil size={14} /> Edit Details
                    </button>
                  )}
                  <button
                    onClick={() => setInvoiceOrder(drawerOrder)}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-800 hover:bg-purple-100 dark:border-purple-800/40 dark:bg-purple-950/40 dark:text-purple-300 transition cursor-pointer"
                  >
                    <Printer size={14} /> Invoice
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/track/${drawerOrder._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition"
                  >
                    <ExternalLink size={14} /> Track Page
                  </Link>

                  {canDelete && drawerOrder.status === "Cancelled" && (
                    <button
                      onClick={() => setSingleDeleteOrder(drawerOrder)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Right-Side Slide-Over Drawer for Unfinished Order Details */}
      {drawerUnfinishedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setDrawerUnfinishedOrder(null)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl border-l border-border bg-card shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Unfinished Order
                      </h2>
                      <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/50 dark:text-amber-300">
                        Incomplete Checkout
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {new Date(drawerUnfinishedOrder.updatedAt || drawerUnfinishedOrder.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerUnfinishedOrder(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                  title="Close Drawer (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Customer Info */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <User size={16} className="text-amber-600" />
                      <span>Customer & Contact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${drawerUnfinishedOrder.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                        title="Call Customer"
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${drawerUnfinishedOrder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          "আসসালামু আলাইকুম, মিল্কিমম থেকে যোগাযোগ করা হচ্ছে।"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950/60 dark:text-green-300 transition"
                        title="WhatsApp Chat"
                      >
                        <ExternalLink size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground font-medium block">Customer Name</span>
                      <span className="font-bold text-foreground text-sm">{drawerUnfinishedOrder.customerName || "Customer"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium block">Phone Number</span>
                      <span className="font-mono font-bold text-foreground text-sm">{drawerUnfinishedOrder.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground font-medium block">Entered Address</span>
                      <p className="font-semibold text-foreground mt-0.5 bg-background p-2.5 rounded-lg border border-border/60">
                        {drawerUnfinishedOrder.address || "Address not provided"}
                        {(drawerUnfinishedOrder.thana || drawerUnfinishedOrder.district) && (
                          <span className="block text-muted-foreground font-normal mt-1">
                            {[drawerUnfinishedOrder.thana, drawerUnfinishedOrder.district].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Client IP & Geolocation (Under Customer Info) */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Globe size={16} className="text-amber-600" />
                      <span>Client IP & Location</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    {(() => {
                      const ip = drawerUnfinishedOrder.ipAddress;
                      const ipLoc = dynamicIpLocs[drawerUnfinishedOrder._id] || drawerUnfinishedOrder.ipLocation;
                      const mapUrl = getIpMapUrl(ipLoc, ip);
                      const isLocal = ip === "127.0.0.1" || ip === "::1" || ipLoc?.city === "Local Host";

                      return (
                        <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/60">
                          <div>
                            <span className="text-muted-foreground font-medium block">IP Address</span>
                            <span className="font-mono font-bold text-foreground">{ip || "Unknown"}</span>
                            {ipLoc?.city || ipLoc?.country ? (
                              <span className="block text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] mt-0.5">
                                📍 {[ipLoc.city, ipLoc.region, ipLoc.country].filter(Boolean).join(", ")}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2">
                            {ip && !isLocal && !ipLoc?.city && (
                              <button
                                type="button"
                                onClick={() => handleLookupIp(drawerUnfinishedOrder._id, ip, "unfinished")}
                                disabled={fetchingIpId === drawerUnfinishedOrder._id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-input bg-card text-foreground hover:bg-muted cursor-pointer"
                              >
                                {fetchingIpId === drawerUnfinishedOrder._id ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
                                <span>Locate</span>
                              </button>
                            )}
                            {mapUrl && (
                              <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
                              >
                                <MapPin size={12} />
                                <span>Google Maps</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Product & Price */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <ShoppingCart size={16} className="text-amber-600" />
                      <span>Selected Product</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground font-medium block">Flavour</span>
                      <span className="font-bold text-foreground">{drawerUnfinishedOrder.flavour || "Dark Chocolate"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium block">Price</span>
                      <span className="font-bold text-amber-600 text-base">
                        ৳{(drawerUnfinishedOrder.price || 4990).toLocaleString("bn-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Audit */}
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <RefreshCw size={16} className="text-amber-600" />
                      <span>Status Tag</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <select
                        value={drawerUnfinishedOrder.status}
                        disabled={updatingId === drawerUnfinishedOrder._id}
                        onChange={(e) => handleUnfinishedStatusChange(drawerUnfinishedOrder._id, e.target.value)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold border outline-none cursor-pointer transition-all",
                          UNFINISHED_STATUS_COLORS[drawerUnfinishedOrder.status] || "bg-muted text-muted-foreground"
                        )}
                      >
                        <option value="Pending">Pending (পেন্ডিং)</option>
                        <option value="Called User">Called User (কল করা হয়েছে)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                        <option value="Spam">Spam (স্প্যাম)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted-foreground font-medium block">Updated By</span>
                        <span className="font-semibold text-foreground">{drawerUnfinishedOrder.statusUpdatedBy || "-"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">Updated At</span>
                        <span className="font-semibold text-foreground">
                          {drawerUnfinishedOrder.statusUpdatedAt
                            ? new Date(drawerUnfinishedOrder.statusUpdatedAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Action Footer */}
              <div className="border-t border-border px-6 py-4 bg-muted/40 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleDeleteUnfinished(drawerUnfinishedOrder._id);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 transition cursor-pointer"
                >
                  <Trash2 size={14} /> Delete Record
                </button>
                <button
                  onClick={() => setDrawerUnfinishedOrder(null)}
                  className="rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
