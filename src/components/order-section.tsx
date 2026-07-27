"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { flavors, singleJarPrice } from "@/lib/content";
import { bdLocations } from "@/lib/bdLocations";
import { saveOrder } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const PHONE_REGEX = /^01[3-9]\d{8}$/;

type FormState = {
  name: string;
  phone: string;
  district: string;
  thana: string;
  address: string;
  payment: "cod" | "bkash";
  trxId: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  district: "",
  thana: "",
  address: "",
  payment: "cod",
  trxId: "",
};

export function OrderSection() {
  const [selectedFlavorId, setSelectedFlavorId] = useState(
    flavors.find((flavor) => flavor.popular)?.id ?? flavors[0].id
  );
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState("");

  const selectedFlavor = useMemo(
    () => flavors.find((flavor) => flavor.id === selectedFlavorId) ?? flavors[0],
    [selectedFlavorId]
  );

  const districtOptions = useMemo(() => Object.keys(bdLocations).sort(), []);
  const thanaOptions = useMemo(
    () => (form.district ? (bdLocations[form.district] || []).slice().sort() : []),
    [form.district]
  );

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = "পূর্ণ নাম লিখুন";
    if (!PHONE_REGEX.test(form.phone.trim()))
      nextErrors.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন";
    if (!form.district) nextErrors.district = "জেলা নির্বাচন করুন";
    if (!form.thana.trim()) nextErrors.thana = "থানা/উপজেলা নির্বাচন করুন";
    if (form.address.trim().length < 5) nextErrors.address = "বাসার বিস্তারিত ঠিকানা লিখুন";

    if (form.payment === "bkash" && form.trxId.trim().length < 4) {
      nextErrors.trxId = "সঠিক বিকাশ ট্রানজেকশন আইডি (TrxID) লিখুন";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setStatus("submitting");

    const result = await saveOrder({
      product: "Milkimom Complete Dose",
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      district: form.district,
      thana: form.thana.trim(),
      address: form.address.trim(),
      flavour: selectedFlavor.name,
      paymentMethod: form.payment === "bkash" ? "bKash" : "COD",
      price: singleJarPrice.salePrice,
      transactionId: form.payment === "bkash" ? form.trxId.trim() : undefined,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      orderTime: new Date().toISOString(),
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("idle");
      setSubmitError(
        typeof result.error === "string"
          ? result.error
          : "অর্ডারটি সাবমিট করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  }

  if (status === "success") {
    return (
      <section id="pricing" className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Reveal className="rounded-3xl border border-brand-green/30 bg-brand-green-light p-8 text-center sm:p-12">
          <CheckCircle2 className="mx-auto size-12 text-brand-green" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
            ধন্যবাদ, {form.name}! আপনার অর্ডারটি রেকর্ড করা হয়েছে।
          </h2>
          <p className="mt-2 text-muted-foreground">
            {singleJarPrice.label} মিল্কিমম ({selectedFlavor.name}) — মোট ৳{singleJarPrice.salePrice}
            {form.payment === "cod" ? " (ক্যাশ অন ডেলিভারি)" : ` (বিকাশ পেমেন্ট - TrxID: ${form.trxId})`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            আমাদের একজন প্রতিনিধি খুব শীঘ্রই {form.phone} নম্বরে যোগাযোগ করে অর্ডার
            নিশ্চিত করবেন।
          </p>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          আজই অর্ডার করুন, বাড়িতে বসেই পেয়ে যান
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="mt-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
          noValidate
        >
          {/* Left Column: Product Flavors & Delivery Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-w-0">
            <div className="col-span-full">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
                স্বাদ বেছে নিন
              </span>
              <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                ৪টি সুস্বাদু ফ্লেভারে পাওয়া যাচ্ছে
              </h3>
            </div>

            <RevealGroup className="col-span-full grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {flavors.map((flavor) => {
                const isSelected = flavor.id === selectedFlavorId;
                return (
                  <RevealItem key={flavor.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedFlavorId(flavor.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "group relative flex w-full items-center gap-3.5 rounded-2xl border-2 p-3 text-left transition-all duration-200 min-h-[92px]",
                        isSelected
                          ? "border-primary bg-primary/[0.03] shadow-md shadow-brand-crimson/10 ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      {flavor.popular && (
                        <span className="absolute -top-2.5 right-3.5 rounded-full bg-brand-crimson px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs z-10">
                          {flavor.tag}
                        </span>
                      )}

                      {/* Product Image with Flavor-Specific Accent Color Background */}
                      <div
                        className={cn(
                          "relative flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-xl p-1 border transition-transform duration-200 group-hover:scale-105 overflow-hidden",
                          flavor.accentBg,
                          `bg-gradient-to-br ${flavor.accentGradient}`
                        )}
                      >
                        <img
                          src={flavor.image || "/images/product-jar.webp"}
                          alt={flavor.name}
                          className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
                        />
                      </div>

                      {/* Text Content Beside Product Image */}
                      <div className="flex flex-1 flex-col justify-center min-w-0 pr-6">
                        <span className="font-heading text-base font-bold text-foreground leading-tight">
                          {flavor.name}
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {flavor.description}
                        </p>
                        {!flavor.popular && flavor.tag && (
                          <span className="mt-1 text-[11px] font-semibold text-brand-crimson/90">
                            {flavor.tag}
                          </span>
                        )}
                      </div>

                      {/* Radio / Selection Checkbox Indicator */}
                      <span
                        className={cn(
                          "absolute right-3 bottom-3 flex size-5 items-center justify-center rounded-full border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground scale-105"
                            : "border-muted-foreground/30 bg-background"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="size-3.5 text-white" />}
                      </span>
                    </button>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <h3 className="col-span-full mt-2 font-heading text-lg font-bold text-foreground">
              ডেলিভারি তথ্য
            </h3>

            {/* Field 1: Full Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name">পূর্ণ নাম *</Label>
              <Input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                aria-invalid={Boolean(errors.name)}
                placeholder="আপনার নাম লিখুন"
                className="h-11"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Field 2: Phone */}
            <div className="grid gap-1.5">
              <Label htmlFor="phone">মোবাইল নম্বর *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                aria-invalid={Boolean(errors.phone)}
                placeholder="01XXXXXXXXX"
                className="h-11"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Field 3: District Searchable Dropdown */}
            <div className="grid gap-1.5">
              <Label htmlFor="district">জেলা *</Label>
              <SearchableSelect
                id="district"
                value={form.district}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, district: value, thana: "" }))
                }
                options={districtOptions}
                placeholder="জেলা নির্বাচন করুন"
                searchPlaceholder="জেলা খুঁজুন..."
                error={Boolean(errors.district)}
              />
              {errors.district && (
                <p className="text-xs text-destructive">{errors.district}</p>
              )}
            </div>

            {/* Field 4: Subdistrict / Thana Searchable Dropdown */}
            <div className="grid gap-1.5">
              <Label htmlFor="thana">থানা/উপজেলা *</Label>
              <SearchableSelect
                id="thana"
                value={form.thana}
                onValueChange={(value) => setForm((f) => ({ ...f, thana: value }))}
                options={thanaOptions}
                placeholder={
                  form.district
                    ? "থানা/উপজেলা নির্বাচন করুন"
                    : "প্রথমে জেলা নির্বাচন করুন"
                }
                searchPlaceholder="থানা/উপজেলা খুঁজুন..."
                disabled={!form.district}
                error={Boolean(errors.thana)}
              />
              {errors.thana && <p className="text-xs text-destructive">{errors.thana}</p>}
            </div>

            {/* Field 5: Full Address (MUST BE LAST) */}
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="address">বাসার পূর্ণ ঠিকানা *</Label>
              <Input
                id="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                aria-invalid={Boolean(errors.address)}
                placeholder="বাসা/হোল্ডিং নং, রোড, এলাকা"
                className="h-11"
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary + Payment Method + bKash Details + Confirm Button */}
          <div className="flex flex-col rounded-2xl bg-muted p-5 sm:p-6 min-w-0">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">আপনার অর্ডার</h3>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {singleJarPrice.label} মিল্কিমম ({selectedFlavor.name}) ·{" "}
                  {singleJarPrice.perJarDays} দিনের ডোজ
                </span>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">
                    ৳{singleJarPrice.salePrice.toLocaleString("bn-BD")}
                  </span>
                  <span className="block text-xs text-muted-foreground line-through">
                    ৳{singleJarPrice.regularPrice.toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-brand-green">ফ্রি</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">সর্বমোট</span>
                <span className="font-heading text-xl font-extrabold text-primary">
                  ৳{singleJarPrice.salePrice.toLocaleString("bn-BD")}
                </span>
              </div>

              {/* Payment Method Section (Placed on the right side before order confirm) */}
              <div className="mt-6 border-t border-border pt-4">
                <span className="text-sm font-bold text-foreground">পেমেন্ট পদ্ধতি বেছে নিন</span>
                <div className="mt-2.5 flex gap-2">
                  {(
                    [
                      { id: "cod", label: "ক্যাশ অন ডেলিভারি" },
                      { id: "bkash", label: "বিকাশ" },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                        form.payment === option.id
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                          : "border-border bg-card text-foreground/80 hover:border-brand-coral/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={form.payment === option.id}
                        onChange={() =>
                          setForm((f) => ({ ...f, payment: option.id as "cod" | "bkash" }))
                        }
                        className="sr-only"
                      />
                      {option.id === "bkash" && (
                        <img
                          src="/assets/bkash-logo.png"
                          alt="bKash"
                          className="h-5 w-auto object-contain shrink-0"
                        />
                      )}
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* bKash Payment Box (Image, Instructions & TrxID Input) */}
                {form.payment === "bkash" && (
                  <div className="mt-4 space-y-3.5 rounded-2xl border border-brand-coral/40 bg-card p-4 text-foreground shadow-sm">
                    {/* bKash Cover Image Header */}
                    <div className="overflow-hidden rounded-xl border border-border bg-white p-2 text-center shadow-xs">
                      <img
                        src="/images/bkash.png"
                        alt="bKash Payment"
                        className="mx-auto h-auto max-h-56 w-full rounded-lg object-contain"
                      />
                    </div>

                    {/* bKash Personal Number */}
                    <div className="rounded-xl border border-brand-crimson/20 bg-brand-cream/50 p-3 text-center">
                      <span className="block text-xs font-medium text-muted-foreground">
                        বিকাশ পার্সোনাল নম্বর (Send Money)
                      </span>
                      <span className="block font-mono text-lg font-bold tracking-wider text-brand-crimson select-all">
                        01926-344244
                      </span>
                    </div>

                    {/* Bangla Instructions */}
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 sm:text-sm">
                        <img
                          src="/assets/bkash-logo.png"
                          alt="bKash"
                          className="h-4.5 w-auto object-contain shrink-0 inline-block"
                        />
                        <span>বিকাশ পেমেন্ট করার নির্দেশাবলী:</span>
                      </p>
                      <ol className="mt-1.5 list-decimal list-inside space-y-1.5 pl-1 text-xs font-medium leading-relaxed text-muted-foreground">
                        <li>
                          আপনার বিকাশ মোবাইল অ্যাপ অথবা{" "}
                          <span className="font-mono font-bold text-foreground">*247#</span> ডায়াল করুন।
                        </li>
                        <li>
                          <strong className="text-foreground">Send Money</strong> অপশনটি সিলেক্ট করুন।
                        </li>
                        <li>
                          প্রাপক নম্বর লিখুন:{" "}
                          <strong className="font-mono text-brand-crimson">01926-344244</strong>
                        </li>
                        <li>
                          মোট পরিমাণ:{" "}
                          <strong className="font-bold text-brand-crimson">
                            {singleJarPrice.salePrice}/=
                          </strong>{" "}
                          টাকা দিয়ে পিন দিন।
                        </li>
                        <li>
                          সেন্ড মানি সফল হওয়ার পর প্রাপ্ত{" "}
                          <strong className="text-foreground">Transaction ID (TrxID)</strong> নিচের ইনপুট বক্সে লিখুন।
                        </li>
                      </ol>
                    </div>

                    {/* Trx ID Field */}
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trxId" className="text-xs font-bold text-foreground">
                          বিকাশ ট্রানজেকশন আইডি (TrxID) <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-[10px] text-muted-foreground">উদাহরণ: 9AB12CD34E</span>
                      </div>
                      <Input
                        id="trxId"
                        value={form.trxId}
                        onChange={(e) => setForm((f) => ({ ...f, trxId: e.target.value }))}
                        aria-invalid={Boolean(errors.trxId)}
                        placeholder="bKash TrxID এখানে লিখুন (যেমন: 9AB12CD34E)"
                        className="h-11 font-mono uppercase text-sm bg-background"
                      />
                      {errors.trxId && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-destructive mt-0.5">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{errors.trxId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              {submitError && (
                <p className="mb-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="cta-shine h-12 w-full gap-2 rounded-full bg-brand-cta text-base text-brand-cta-foreground hover:bg-brand-cta-dark"
              >
                {status === "submitting" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "অর্ডার কনফার্ম করুন"
                )}
              </Button>

              <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand-green" /> নিরাপদ ও সুরক্ষিত অর্ডার
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="size-4 text-brand-green" /> সারাদেশে হোম ডেলিভারি
                </span>
              </div>
            </div>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
