"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Cookie,
  Flame,
  IceCreamCone,
  Leaf,
  Loader2,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { bangladeshDistricts } from "@/lib/districts";
import { flavors, singleJarPrice } from "@/lib/content";
import { cn } from "@/lib/utils";

const iconMap: Record<(typeof flavors)[number]["icon"], LucideIcon> = {
  cookie: Cookie,
  "ice-cream-cone": IceCreamCone,
  leaf: Leaf,
  flame: Flame,
};

const PHONE_REGEX = /^01[3-9]\d{8}$/;

type FormState = {
  name: string;
  phone: string;
  address: string;
  district: string;
  payment: "cod" | "bkash";
};

const initialForm: FormState = {
  name: "",
  phone: "",
  address: "",
  district: "",
  payment: "cod",
};

export function OrderSection() {
  const [selectedFlavorId, setSelectedFlavorId] = useState(
    flavors.find((flavor) => flavor.popular)?.id ?? flavors[0].id
  );
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const selectedFlavor = useMemo(
    () => flavors.find((flavor) => flavor.id === selectedFlavorId) ?? flavors[0],
    [selectedFlavorId]
  );

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = "পূর্ণ নাম লিখুন";
    if (!PHONE_REGEX.test(form.phone.trim()))
      nextErrors.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন";
    if (form.address.trim().length < 8) nextErrors.address = "বিস্তারিত ঠিকানা লিখুন";
    if (!form.district) nextErrors.district = "জেলা নির্বাচন করুন";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    // NOTE: no backend wired up yet — replace with a real order/payment API call.
    window.setTimeout(() => {
      setStatus("success");
    }, 700);
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
            {form.payment === "cod" ? " (ক্যাশ অন ডেলিভারি)" : " (বিকাশ পেমেন্ট)"}
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
          className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr]"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-full">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
                স্বাদ বেছে নিন
              </span>
              <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                ৪টি সুস্বাদু ফ্লেভারে পাওয়া যাচ্ছে
              </h3>
            </div>

            <RevealGroup className="col-span-full grid grid-cols-2 gap-3 sm:grid-cols-4">
              {flavors.map((flavor) => {
                const isSelected = flavor.id === selectedFlavorId;
                const Icon = iconMap[flavor.icon];
                return (
                  <RevealItem key={flavor.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedFlavorId(flavor.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative flex h-full w-full flex-col items-center gap-2 rounded-2xl border-2 bg-card p-4 text-center transition-all",
                        isSelected
                          ? "border-primary shadow-lg shadow-brand-crimson/10"
                          : "border-border hover:border-brand-coral/40"
                      )}
                    >
                      {flavor.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-crimson px-3 py-1 text-xs font-bold whitespace-nowrap text-white">
                          {flavor.tag}
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full bg-brand-cream",
                          isSelected && "bg-primary/10"
                        )}
                      >
                        <Icon className="size-6 text-brand-crimson" />
                      </span>
                      <span className="font-heading text-base font-bold text-foreground">
                        {flavor.name}
                      </span>
                      {!flavor.popular && (
                        <span className="text-xs text-muted-foreground">{flavor.tag}</span>
                      )}

                      <span
                        className={cn(
                          "absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border-2",
                          isSelected ? "border-primary bg-primary" : "border-border"
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className="size-4 text-primary-foreground" />
                        )}
                      </span>
                    </button>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <h3 className="col-span-full mt-2 font-heading text-lg font-bold text-foreground">
              ডেলিভারি তথ্য
            </h3>

            <div className="grid gap-1.5">
              <Label htmlFor="name">পূর্ণ নাম</Label>
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

            <div className="grid gap-1.5">
              <Label htmlFor="phone">মোবাইল নম্বর</Label>
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

            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="address">বাসার পূর্ণ ঠিকানা</Label>
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

            <div className="grid gap-1.5">
              <Label htmlFor="district">জেলা</Label>
              <Select
                value={form.district}
                onValueChange={(value) => setForm((f) => ({ ...f, district: value }))}
              >
                <SelectTrigger id="district" className="h-11 w-full">
                  <SelectValue placeholder="জেলা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {bangladeshDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="text-xs text-destructive">{errors.district}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <span className="text-sm font-medium">পেমেন্ট পদ্ধতি</span>
              <div className="flex gap-2">
                {(
                  [
                    { id: "cod", label: "ক্যাশ অন ডেলিভারি" },
                    { id: "bkash", label: "বিকাশ" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      form.payment === option.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground/80 hover:border-brand-coral/40"
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
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl bg-muted p-5">
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
              <span className="text-brand-green">ফ্রি</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="font-semibold text-foreground">সর্বমোট</span>
              <span className="font-heading text-xl font-extrabold text-primary">
                ৳{singleJarPrice.salePrice.toLocaleString("bn-BD")}
              </span>
            </div>

            <Button
              type="submit"
              disabled={status === "submitting"}
              className="cta-shine mt-5 h-12 gap-2 rounded-full bg-brand-cta text-base text-brand-cta-foreground hover:bg-brand-cta-dark"
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
        </form>
      </Reveal>
    </section>
  );
}
