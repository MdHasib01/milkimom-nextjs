"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  PackageCheck,
  Phone,
  Truck,
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
  flavour?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  price?: number;
  transactionId?: string;
  status?: string;
  createdAt?: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params?.id as string) || searchParams.get("id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rawId) {
      setLoading(false);
      setError("অর্ডার আইডি পাওয়া যায়নি।");
      return;
    }

    fetch(`/api/orders/${rawId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setOrder(resData.data);
        } else {
          setError(resData.error || "অর্ডারটি পাওয়া যায়নি।");
        }
      })
      .catch(() => {
        setError("অর্ডারের তথ্য লোড করা সম্ভব হয়নি।");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rawId]);

  const shortId = rawId ? rawId.slice(-6).toUpperCase() : "";

  // Order status mapping
  const currentStatus = order?.status || "Pending";
  const statusSteps = [
    { label: "অর্ডার গ্রহণ", status: "Pending", icon: CheckCircle2 },
    { label: "অর্ডার কনফার্মড", status: "Confirmed", icon: Clock },
    { label: "ডেলিভারিতে আছে", status: "Shipped", icon: Truck },
    { label: "ডেলিভারি সম্পন্ন", status: "Delivered", icon: PackageCheck },
  ];

  const currentStepIndex = Math.max(
    0,
    statusSteps.findIndex((s) => s.status === currentStatus)
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Top Header Card */}
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-md">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="size-8 text-primary animate-pulse" />
          </div>

          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
            অর্ডার ট্র্যাকিং
          </h1>
          <p className="mt-1 text-xs font-mono text-muted-foreground">
            অর্ডার ID: #{shortId || rawId}
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            অর্ডারের তথ্য লোড হচ্ছে...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        {order && !loading && (
          <>
            {/* Status Steps Tracker */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-foreground">অর্ডার স্ট্যাটাস:</h2>

              <div className="grid grid-cols-4 gap-2 text-center">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const IconComp = step.icon;
                  return (
                    <div key={step.status} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                          isDone
                            ? "border-primary bg-primary text-primary-foreground shadow-xs"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <IconComp className="size-5" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold leading-tight ${
                          isDone ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
              <div className="bg-muted/80 px-5 py-3.5 border-b border-border">
                <span className="font-heading text-base font-bold text-foreground">
                  অর্ডারের বিবরণ
                </span>
              </div>

              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground">পণ্য:</span>
                  <span className="font-bold text-foreground">
                    ১ জার মিল্কিমম ({order.flavour || "ডার্ক চকলেট"})
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground">পেমেন্ট পদ্ধতি:</span>
                  <span className="font-semibold text-foreground">
                    {order.paymentMethod === "bKash" || order.paymentMethod === "Paid"
                      ? `বিকাশ (TrxID: ${order.transactionId || "N/A"})`
                      : "ক্যাশ অন ডেলিভারি"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground">ডেলিভারি সময়:</span>
                  <span className="font-semibold text-brand-green">
                    ইনশাআল্লাহ ২–৩ কার্যদিবস
                  </span>
                </div>

                <div className="flex justify-between items-center text-base font-bold pt-1">
                  <span>মোট মূল্য:</span>
                  <span className="font-heading text-lg text-primary">
                    {(order.price || singleJarPrice.salePrice).toLocaleString("bn-BD")}৳
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Contact Info */}
            <div className="rounded-3xl border border-border bg-card p-5 space-y-2 text-sm shadow-xs">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>গ্রাহকের তথ্য</span>
              </h3>

              {order.customerName && order.customerName !== "গ্রাহক" && (
                <p className="text-xs text-muted-foreground">
                  নাম: <strong className="text-foreground font-semibold">{order.customerName}</strong>
                </p>
              )}

              {order.phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  <span>ফোন: <strong className="font-mono text-foreground font-semibold">{order.phone}</strong></span>
                </p>
              )}

              {(order.district || order.thana || order.address) && (
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>ঠিকানা: <strong className="text-foreground font-medium">{[order.address, order.thana, order.district].filter(Boolean).join(", ")}</strong></span>
                </p>
              )}
            </div>
          </>
        )}

        {/* Home & Support Link */}
        <div className="text-center space-y-3 pt-2">
          <Button
            asChild
            className="h-11 w-full max-w-md gap-2 rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/">
              <Home className="size-4" />
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            WhatsApp যোগাযোগ:{" "}
            <a
              href={`https://wa.me/88${siteConfig.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand-green hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
