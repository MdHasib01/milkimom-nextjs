"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Loader2,
  Printer,
  Download,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { singleJarPrice, smoothflowSingleJarPrice, siteConfig } from "@/lib/content";

interface OrderData {
  _id?: string;
  customerName?: string;
  phone?: string;
  alternativePhone?: string;
  district?: string;
  thana?: string;
  address?: string;
  product?: string;
  productSlug?: string;
  flavour?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  price?: number;
  transactionId?: string;
  status?: string;
  createdAt?: string;
  orderTime?: string;
}

const CONFIRMED_STATUSES = ["Confirmed", "Shipped", "Delivered"];

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={36} />
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  );
}

function InvoiceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || searchParams.get("id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) {
      setLoading(false);
      setError("ইনভয়েস আইডি পাওয়া যায়নি।");
      return;
    }

    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setOrder(resData.data);
        } else {
          setError(resData.error || "ইনভয়েসটি খুঁজে পাওয়া যায়নি। অর্ডার আইডি সঠিক কিনা যাচাই করুন।");
        }
      })
      .catch(() => {
        setError("ইনভয়েসের তথ্য লোড করা সম্ভব হয়নি।");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const isPaid =
    order?.paymentStatus === "Paid" ||
    order?.paymentMethod === "bKash" ||
    order?.paymentMethod === "Paid";
  const isConfirmed = order ? CONFIRMED_STATUSES.includes(order.status || "") : false;
  const isCancelled = order?.status === "Cancelled";

  // The two landings sell different products at different prices — a
  // SmoothFlow invoice must not fall back to Milkimom's 4990৳.
  const priceFallback =
    order?.productSlug === "smoothflow" ? smoothflowSingleJarPrice : singleJarPrice;
  const invoicePrice = order?.price || priceFallback.salePrice;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = order?.orderTime || order?.createdAt
    ? new Date(order.orderTime || order.createdAt!).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  const formattedAddress = order
    ? [order.address, order.thana, order.district].filter(Boolean).join(", ")
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-md border border-red-100 p-10 text-center max-w-md">
          <XCircle className="text-red-400 mx-auto mb-4" size={44} />
          <p className="text-gray-700 font-bold leading-relaxed">{error || "ইনভয়েসটি পাওয়া যায়নি।"}</p>
          <Link href="/" className="inline-block mt-6 text-primary font-bold hover:underline">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white text-gray-900">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href={`/track/${order._id}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} /> অর্ডার ট্র্যাকিং
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Download size={16} /> PDF ডাউনলোড
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Printer size={16} /> প্রিন্ট করুন
            </button>
          </div>
        </div>
        <p className="max-w-3xl mx-auto px-4 pb-3 text-xs text-gray-400">
          PDF হিসেবে সেভ করতে প্রিন্ট ডায়ালগে "Save as PDF" নির্বাচন করুন।
        </p>
      </div>

      {/* Invoice sheet */}
      <div className="max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-0 print:max-w-none">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 sm:p-10 relative overflow-hidden print:shadow-none print:border-0 print:rounded-none">
          {/* Seals / Watermarks */}
          <div className="absolute top-72 right-6 sm:right-14 flex flex-col items-end gap-4 pointer-events-none select-none z-10">
            {isPaid && isConfirmed && (
              <div className="border-4 border-green-600 text-green-600 rounded-lg px-5 py-1.5 font-black text-xl tracking-[0.25em] uppercase -rotate-12 opacity-80">
                Paid
              </div>
            )}
            {isConfirmed && (
              <div className="border-4 border-red-600 text-red-600 rounded-lg px-5 py-1.5 font-black text-xl tracking-[0.2em] uppercase -rotate-12 opacity-80">
                Confirmed
              </div>
            )}
            {isCancelled && (
              <div className="border-4 border-gray-500 text-gray-500 rounded-lg px-5 py-1.5 font-black text-xl tracking-[0.2em] uppercase -rotate-12 opacity-80">
                Cancelled
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-gray-900 mb-6">
            <div>
              <img src="/images/logo.webp" alt="Milkimom Logo" className="h-12 w-auto object-contain mb-2" />
              <p className="text-xs text-gray-500 leading-relaxed">
                {siteConfig.tagline}<br />
                WhatsApp: {siteConfig.phoneDisplay}
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">INVOICE</h1>
              <p className="text-xs text-gray-500 mt-1 font-mono break-all max-w-[180px]">#{order._id}</p>
              <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
            </div>
          </div>

          {/* Bill to & Payment */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Bill To</p>
              <p className="font-bold text-gray-900">{order.customerName || "গ্রাহক"}</p>
              {formattedAddress && (
                <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                  {formattedAddress}
                </p>
              )}
              {order.phone && (
                <p className="text-sm text-gray-600 font-mono mt-1">{order.phone}</p>
              )}
              {order.alternativePhone && (
                <p className="text-sm text-gray-500 font-mono">{order.alternativePhone}</p>
              )}
            </div>
            <div className="sm:text-right print:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Payment</p>
              <p className="font-bold text-gray-900">
                {isPaid ? "bKash (Prepaid)" : "Cash on Delivery"}
              </p>
              {order.transactionId && (
                <p className="text-sm text-gray-600 font-mono">TrxID: {order.transactionId}</p>
              )}
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-4 mb-1.5">Order Status</p>
              <p className={`font-bold ${isCancelled ? "text-gray-500" : isConfirmed ? "text-green-700" : "text-amber-600"}`}>
                {isCancelled ? "Cancelled" : isConfirmed ? order.status : "Not Confirmed Yet"}
              </p>
            </div>
          </div>

          {/* Items table */}
          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900 text-left text-[11px] uppercase tracking-wider text-gray-500">
                <th className="py-2.5">Item</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">{order.product ||
                      (order.productSlug === "smoothflow"
                        ? "১টি জার SmoothFlow"
                        : "১টি জার মিল্কিমম")}</p>
                  <p className="text-xs text-gray-500">Flavour: {order.flavour || "ডার্ক চকলেট"} — 15 Days Only</p>
                </td>
                <td className="py-4 text-center text-gray-700">1</td>
                <td className="py-4 text-right font-bold text-gray-900">
                  {invoicePrice.toLocaleString("bn-BD")}/=
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td className="py-4 text-right font-bold text-gray-500 uppercase text-xs tracking-wider">Total</td>
                <td className="py-4 text-right font-black text-2xl text-primary whitespace-nowrap">
                  {invoicePrice.toLocaleString("bn-BD")}/=
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment/status note */}
          {!isCancelled && (
            <div
              className={`rounded-xl border px-5 py-4 text-sm leading-relaxed mb-8 ${
                isPaid && isConfirmed
                  ? "bg-green-50 border-green-200 text-green-800"
                  : isConfirmed
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              {isPaid && isConfirmed && (
                <>পেমেন্ট bKash-এর মাধ্যমে সম্পন্ন হয়েছে এবং অর্ডারটি কনফার্ম করা হয়েছে। ধন্যবাদ!</>
              )}
              {!isPaid && isConfirmed && (
                <>অর্ডারটি কনফার্ম করা হয়েছে। ডেলিভারির সময় ক্যাশ অন ডেলিভারিতে <strong>{invoicePrice.toLocaleString("bn-BD")}/=</strong> পরিশোধ করুন।</>
              )}
              {!isConfirmed && (
                <>
                  অর্ডারটি এখনো কনফার্ম হয়নি — আমাদের টিম শীঘ্রই যাচাই করে কনফার্ম করবে।{" "}
                  {isPaid
                    ? "আপনার bKash পেমেন্টটি যাচাই করা হচ্ছে।"
                    : `ডেলিভারির সময় ক্যাশ অন ডেলিভারিতে ${invoicePrice.toLocaleString("bn-BD")}/= পরিশোধ করতে হবে।`}
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-400 leading-relaxed">
            <p>এই ইনভয়েসটি কম্পিউটারে তৈরি — কোনো স্বাক্ষরের প্রয়োজন নেই।</p>
            <p className="mt-1">{siteConfig.nameEn} — যেকোনো প্রয়োজনে WhatsApp: {siteConfig.phoneDisplay}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
