"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  AlertCircle,
  ArrowRight,
  Package,
  Sparkles,
  Loader2,
  RefreshCw,
  Eye,
  Users,
  ChevronRight,
} from "lucide-react";
import { fetchOrders, fetchUnfinishedOrders } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

export interface Order {
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
  statusUpdatedBy?: string;
  statusUpdatedAt?: string;
  orderTime?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  Confirmed: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  Shipped: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
  Delivered: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
};

export default function AdminDashboardOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [unfinishedCount, setUnfinishedCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendFilter, setTrendFilter] = useState<"day" | "week" | "month">("day");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ label: string; count: number; revenue: number } | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, unfinishedRes] = await Promise.all([
        fetchOrders({ limit: 100 }),
        fetchUnfinishedOrders({ limit: 1 }),
      ]);

      if (ordersRes.success && ordersRes.data) {
        const orderList = ordersRes.data as Order[];
        const paginationObj = (ordersRes as unknown as { pagination?: { total: number } }).pagination;
        setOrders(orderList);
        setTotalOrdersCount(paginationObj?.total || orderList.length);
      } else {
        setError(typeof ordersRes.error === "string" ? ordersRes.error : "Failed to load dashboard statistics");
      }

      const unfinishedPagination = (unfinishedRes as unknown as { pagination?: { total: number } }).pagination;
      if (unfinishedRes.success && unfinishedPagination) {
        setUnfinishedCount(unfinishedPagination.total);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute key stats
  const stats = useMemo(() => {
    // Confirmed orders (Confirmed, Shipped, Delivered)
    const confirmedOrders = orders.filter((o) =>
      ["Confirmed", "Shipped", "Delivered"].includes(o.status)
    );
    const confirmedRevenue = confirmedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    // Pending orders
    const pendingOrders = orders.filter((o) => o.status === "Pending");
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    const pendingCount = pendingOrders.length;
    const confirmedCount = confirmedOrders.length;
    const shippedCount = orders.filter((o) => o.status === "Shipped").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    const completedRate =
      orders.length > 0
        ? Math.round((confirmedCount / orders.length) * 100)
        : 0;

    return {
      confirmedRevenue,
      pendingRevenue,
      pendingCount,
      confirmedCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      completedRate,
    };
  }, [orders]);

  // Compute Flavour Popularity
  const flavourStats = useMemo(() => {
    const counts: Record<string, number> = {
      "Dark Chocolate": 0,
      Vanilla: 0,
      Cardamom: 0,
      Cinnamon: 0,
    };

    orders.forEach((o) => {
      const f = o.flavour || "Dark Chocolate";
      if (f.includes("চকলেট") || f.includes("Chocolate")) counts["Dark Chocolate"] += 1;
      else if (f.includes("ভ্যানিলা") || f.includes("Vanilla")) counts["Vanilla"] += 1;
      else if (f.includes("এলাচ") || f.includes("Cardamom")) counts["Cardamom"] += 1;
      else if (f.includes("দারুচিনি") || f.includes("Cinnamon")) counts["Cinnamon"] += 1;
      else counts["Dark Chocolate"] += 1;
    });

    const maxCount = Math.max(...Object.values(counts), 1);
    return { counts, maxCount };
  }, [orders]);

  // Generate trend chart data based on filter ("day" | "week" | "month")
  const trendData = useMemo(() => {
    const items: { key: string; label: string; subLabel?: string; count: number; revenue: number }[] = [];
    const now = new Date();

    if (trendFilter === "day") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", { weekday: "short" });
        const subLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const dayOrders = orders.filter((o) => {
          const orderDate = new Date(o.orderTime || o.createdAt).toISOString().split("T")[0];
          return orderDate === dateStr;
        });

        const dayRevenue = dayOrders
          .filter((o) => o.status !== "Cancelled")
          .reduce((sum, o) => sum + (o.price || 0), 0);

        items.push({
          key: dateStr,
          label: `${label} (${subLabel})`,
          subLabel: label,
          count: dayOrders.length,
          revenue: dayRevenue,
        });
      }
    } else if (trendFilter === "week") {
      // Last 6 weeks (7-day blocks)
      for (let i = 5; i >= 0; i--) {
        const endD = new Date(now);
        endD.setDate(endD.getDate() - i * 7);
        const startD = new Date(endD);
        startD.setDate(startD.getDate() - 6);

        const startMonth = startD.toLocaleDateString("en-US", { month: "short" });
        const endMonth = endD.toLocaleDateString("en-US", { month: "short" });
        const label = i === 0 ? "This Week" : `${startD.getDate()} ${startMonth} - ${endD.getDate()} ${endMonth}`;
        const subLabel = i === 0 ? "This Wk" : `Wk ${6 - i}`;

        const startMs = new Date(startD.setHours(0, 0, 0, 0)).getTime();
        const endMs = new Date(endD.setHours(23, 59, 59, 999)).getTime();

        const weekOrders = orders.filter((o) => {
          const orderTime = new Date(o.orderTime || o.createdAt).getTime();
          return orderTime >= startMs && orderTime <= endMs;
        });

        const weekRevenue = weekOrders
          .filter((o) => o.status !== "Cancelled")
          .reduce((sum, o) => sum + (o.price || 0), 0);

        items.push({
          key: `week-${i}`,
          label,
          subLabel,
          count: weekOrders.length,
          revenue: weekRevenue,
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        const subLabel = d.toLocaleDateString("en-US", { month: "short" });

        const monthOrders = orders.filter((o) => {
          const orderD = new Date(o.orderTime || o.createdAt);
          return orderD.getFullYear() === year && orderD.getMonth() === month;
        });

        const monthRevenue = monthOrders
          .filter((o) => o.status !== "Cancelled")
          .reduce((sum, o) => sum + (o.price || 0), 0);

        items.push({
          key: `month-${year}-${month}`,
          label,
          subLabel,
          count: monthOrders.length,
          revenue: monthRevenue,
        });
      }
    }

    const maxOrders = Math.max(...items.map((d) => d.count), 5);
    return { items, maxOrders };
  }, [orders, trendFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Refresh Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              <Sparkles size={12} /> Live
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Real-time sales performance, order history, and store metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition"
          >
            <RefreshCw size={14} className={cn(loading && "animate-spin text-primary")} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 transition"
          >
            <span>Manage Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Total Orders */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:shadow-md hover:border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{totalOrdersCount}</p>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.confirmedCount} Confirmed</span>
              <span>· {stats.pendingCount} Pending</span>
            </p>
          </div>
        </div>

        {/* Card 2: Confirmed Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:shadow-md hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirmed Revenue</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[20px] select-none">
              ৳
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
              ৳{stats.confirmedRevenue.toLocaleString("bn-BD")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={13} className="text-emerald-500" />
              <span>Confirmed & delivered orders</span>
            </p>
          </div>
        </div>

        {/* Card 3: Pending Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:shadow-md hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Revenue</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[20px] select-none">
              ৳
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
              ৳{stats.pendingRevenue.toLocaleString("bn-BD")}
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Clock size={13} />
              <span>From {stats.pendingCount} pending orders</span>
            </p>
          </div>
        </div>

        {/* Card 4: Pending Orders */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:shadow-md hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Orders</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stats.pendingCount}</p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <AlertCircle size={13} />
              <span>Requires action</span>
            </p>
          </div>
        </div>

        {/* Card 5: Unfinished Attempts */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:shadow-md hover:border-purple-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unfinished</span>
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{unfinishedCount}</p>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span>Checkout drop-offs</span>
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart: Order & Revenue Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Order Volume & Revenue Trend
              </h2>
              <p className="text-xs text-muted-foreground">
                {trendFilter === "day"
                  ? "Daily activity across the last 7 days"
                  : trendFilter === "week"
                  ? "Weekly order volume over 6 weeks"
                  : "Monthly sales trend over the last 6 months"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {hoveredDataPoint && (
                <div className="hidden sm:block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  {hoveredDataPoint.label}: {hoveredDataPoint.count} orders (৳{hoveredDataPoint.revenue.toLocaleString("bn-BD")})
                </div>
              )}

              {/* Filter Buttons: Daily, Weekly, Monthly */}
              <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 border border-border/60">
                {(["day", "week", "month"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTrendFilter(filter)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-bold transition-all capitalize",
                      trendFilter === filter
                        ? "bg-card text-foreground shadow-xs border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter === "day" ? "Daily" : filter === "week" ? "Weekly" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Line / Bar Chart */}
          <div className="relative mt-6 h-56 w-full">
            <div className="flex h-full items-end justify-between gap-2 pt-6">
              {trendData.items.map((item) => {
                const heightPercent = Math.max(12, Math.round((item.count / trendData.maxOrders) * 100));

                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => setHoveredDataPoint(item)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                    className="group flex flex-1 flex-col items-center gap-2 h-full justify-end cursor-pointer"
                  >
                    <div className="relative w-full flex-1 flex items-end justify-center">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={cn(
                          "w-full max-w-[38px] rounded-t-lg transition-all duration-300 group-hover:brightness-110",
                          item.count > 0
                            ? "bg-gradient-to-t from-primary/80 to-primary shadow-md shadow-primary/20"
                            : "bg-muted/60"
                        )}
                      />
                      {item.count > 0 && (
                        <span className="absolute -top-6 text-[11px] font-extrabold text-foreground group-hover:scale-110 transition">
                          {item.count}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground group-hover:text-foreground text-center truncate max-w-[60px]" title={item.label}>
                      {item.subLabel || item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Secondary Chart: Flavour Sales Breakdown */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-4">
              <Package size={18} className="text-amber-500" /> Top Selling Flavours
            </h2>
            <div className="mt-5 space-y-4">
              {Object.entries(flavourStats.counts).map(([flavourName, count]) => {
                const pct = Math.round((count / flavourStats.maxCount) * 100);

                return (
                  <div key={flavourName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground">{flavourName}</span>
                      <span className="text-muted-foreground">{count} orders</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground flex items-center justify-between border border-border/60">
            <span>Overall Order Completion Rate:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{stats.completedRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Order History Section */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between border-b border-border/80 p-5 sm:px-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">Recent Order History</h2>
            <p className="text-xs text-muted-foreground">Latest transactions and status changes</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>View All ({totalOrdersCount})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs font-medium text-muted-foreground">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Flavour & Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated By</th>
                  <th className="px-4 py-3">Date / Time</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.slice(0, 6).map((order) => {
                  const statusStyle = STATUS_COLORS[order.status] || {
                    bg: "bg-muted text-muted-foreground",
                    text: "text-foreground",
                    dot: "bg-muted-foreground",
                  };

                  return (
                    <tr key={order._id} className="hover:bg-muted/40 transition">
                      <td className="px-4 py-3.5 font-bold text-foreground">
                        {order.customerName}
                        <span className="block text-[11px] font-normal text-muted-foreground truncate max-w-[160px]">
                          {order.address || "No address"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{order.phone}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-foreground">{order.flavour}</span>
                        <span className="block text-[11px] font-bold text-emerald-600">৳{order.price}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                            statusStyle.bg,
                            statusStyle.text
                          )}
                        >
                          <span className={cn("size-1.5 rounded-full", statusStyle.dot)} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {order.statusUpdatedBy || "-"}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {new Date(order.orderTime || order.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                          title="View in orders list"
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
