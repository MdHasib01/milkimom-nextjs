"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  XCircle,
  Loader2,
  Home as HomeIcon,
  Printer,
  Search,
  Truck,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { singleJarPrice, siteConfig } from "@/lib/content";

interface OrderData {
  _id?: string;
  customerName?: string;
  phone?: string;
  district?: string;
  thana?: string;
  address?: string;
  product?: string;
  flavour?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  price?: number;
  transactionId?: string;
  status?: string;
  createdAt?: string;
  orderTime?: string;
}

const STATUS_STEPS = [
  { key: "Pending", label: "অর্ডার গৃহীত হয়েছে", description: "আপনার অর্ডারটি আমরা পেয়েছি।" },
  { key: "Confirmed", label: "অর্ডার কনফার্ম হয়েছে", description: "আপনার অর্ডারটি যাচাই করে কনফার্ম করা হয়েছে।" },
  { key: "Shipped", label: "ডেলিভারির জন্য পাঠানো হয়েছে", description: "আপনার পণ্যটি কুরিয়ারে হস্তান্তর করা হয়েছে।" },
  { key: "Delivered", label: "ডেলিভারি সম্পন্ন হয়েছে", description: "আপনার পণ্যটি পৌঁছে গেছে। ধন্যবাদ!" },
];

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm font-semibold text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary mr-2" />
          অর্ডারের তথ্য লোড হচ্ছে...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlId = (params?.id as string) || searchParams.get("id") || "";
  const [searchIdInput, setSearchIdInput] = useState("");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(Boolean(urlId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!urlId) {
      setLoading(false);
      setOrder(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    fetch(`/api/orders/${urlId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setOrder(resData.data);
        } else {
          setOrder(null);
          setError("অর্ডারটি খুঁজে পাওয়া যায়নি। অর্ডার আইডি সঠিক কিনা যাচাই করুন।");
        }
      })
      .catch(() => {
        setOrder(null);
        setError("অর্ডারের তথ্য লোড করা সম্ভব হয়নি।");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;
    router.push(`/track/${searchIdInput.trim()}`);
  };

  const isCancelled = order?.status === "Cancelled";
  const currentIndex = order ? STATUS_STEPS.findIndex((s) => s.key === order.status) : -1;
  const isPaid = order?.paymentStatus === "Paid" || order?.paymentMethod === "bKash" || order?.paymentMethod === "Paid";

  const formattedAddress = order
    ? [order.address, order.thana, order.district].filter(Boolean).join(", ")
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Top Header Card */}
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-md">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="size-8 text-primary animate-pulse" />
          </div>

          <h1 className="mt-4 font-heading text-2xl sm:text-3xl font-bold text-foreground">
            অর্ডার ট্র্যাকিং
          </h1>
          {urlId && (
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              অর্ডার ID: #{urlId}
            </p>
          )}
        </div>

        {/* Search Bar for Order ID */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="আপনার অর্ডার আইডি দিয়ে সার্চ করুন..."
              value={searchIdInput}
              onChange={(e) => setSearchIdInput(e.target.value)}
              className="w-full h-12 rounded-2xl border border-input bg-card px-4 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-2xl font-bold">
            <Search className="size-4 mr-1.5" /> ট্র্যাক
          </Button>
        </form>

        {loading && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">অর্ডারের তথ্য লোড হচ্ছে...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center space-y-4">
            <XCircle className="size-12 text-destructive mx-auto" />
            <p className="font-bold text-destructive text-base leading-relaxed">{error}</p>
            <Button asChild variant="outline" className="rounded-xl font-bold">
              <Link href="/">
                <HomeIcon className="size-4 mr-2" /> হোম পেজে ফিরে যান
              </Link>
            </Button>
          </div>
        )}

        {!loading && !urlId && !order && !error && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-2 text-muted-foreground">
            <p className="font-semibold text-foreground">অর্ডার ট্র্যাকিং করার জন্য উপরে আপনার অর্ডার আইডি লিখুন।</p>
            <p className="text-xs">অর্ডার করার সময় আপনাকে একটি অর্ডার আইডি প্রদান করা হয়েছিল।</p>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <p className="font-bold text-foreground text-lg">{order.product || "১টি জার মিল্কিমম"}</p>
                  <p className="text-sm text-muted-foreground">ফ্লেভার: {order.flavour || "ডার্ক চকলেট"}</p>
                </div>
                <p className="font-heading font-black text-primary text-xl">
                  {(order.price || singleJarPrice.salePrice).toLocaleString("bn-BD")}/=
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                {order.customerName && (
                  <p className="flex items-center gap-2">
                    <User className="size-4 text-primary shrink-0" />
                    <span><strong className="text-foreground">নাম:</strong> {order.customerName}</span>
                  </p>
                )}
                {order.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-primary shrink-0" />
                    <span><strong className="text-foreground">ফোন:</strong> <span className="font-mono">{order.phone}</span></span>
                  </p>
                )}
                {formattedAddress && (
                  <p className="flex items-start gap-2">
                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">ঠিকানা:</strong> {formattedAddress}</span>
                  </p>
                )}
                <p className="pt-1">
                  <strong className="text-foreground">পেমেন্ট:</strong>{" "}
                  <span className={`font-semibold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                    {isPaid ? `পরিশোধিত (bKash${order.transactionId ? ` - TrxID: ${order.transactionId}` : ""})` : "ক্যাশ অন ডেলিভারি"}
                  </span>
                </p>
                <p className="font-mono text-xs text-muted-foreground pt-2 border-t border-border/50 break-all">
                  Order ID: {order._id}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              {isCancelled ? (
                <div className="text-center py-6">
                  <XCircle className="size-12 text-destructive mx-auto mb-3" />
                  <p className="font-bold text-foreground text-lg">অর্ডারটি বাতিল করা হয়েছে</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const done = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const isLast = idx === STATUS_STEPS.length - 1;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {done ? (
                            <CheckCircle2 className={isCurrent ? "text-primary" : "text-emerald-500"} size={26} />
                          ) : (
                            <Circle className="text-muted-foreground/40" size={26} />
                          )}
                          {!isLast && (
                            <div className={`w-0.5 flex-1 min-h-[40px] ${idx < currentIndex ? "bg-emerald-500" : "bg-border"}`} />
                          )}
                        </div>
                        <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                          <p className={`font-bold leading-tight text-base ${done ? "text-foreground" : "text-muted-foreground/60"}`}>
                            {step.label}
                          </p>
                          <p className={`text-sm mt-1 leading-relaxed ${done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Print / Download Invoice Link */}
            <Button
              asChild
              variant="outline"
              className="w-full h-14 rounded-2xl font-bold border-border bg-card hover:bg-muted text-foreground text-base shadow-sm gap-2"
            >
              <Link href={`/invoice/${order._id}`}>
                <Printer className="size-5 text-primary" />
                <span>ইনভয়েস প্রিন্ট / PDF ডাউনলোড</span>
              </Link>
            </Button>

            {/* Support Link */}
            <div className="text-center text-sm text-muted-foreground pt-2">
              যেকোনো প্রয়োজনে —{" "}
              <a
                href={`https://wa.me/88${siteConfig.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:underline text-emerald-600"
              >
                WhatsApp: {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

