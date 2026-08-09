"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2, Package, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  fetchFlavoursAdmin,
  createFlavour,
  updateFlavour,
  deleteFlavour,
  type Flavour,
} from "@/lib/admin-api";

/** Editable form shape — numbers are strings while being typed. */
interface FlavourForm {
  name: string;
  nameEn: string;
  description: string;
  price: string;
  offerPrice: string;
  weight: string;
  invoiceCode: string;
  tag: string;
  active: boolean;
  sortOrder: string;
}

const emptyForm: FlavourForm = {
  name: "",
  nameEn: "",
  description: "",
  price: "",
  offerPrice: "",
  weight: "0.5",
  invoiceCode: "",
  tag: "",
  active: true,
  sortOrder: "0",
};

function toForm(f: Flavour): FlavourForm {
  return {
    name: f.name || "",
    nameEn: f.nameEn || "",
    description: f.description || "",
    price: String(f.price ?? ""),
    offerPrice: f.offerPrice === null || f.offerPrice === undefined ? "" : String(f.offerPrice),
    weight: String(f.weight ?? 0.5),
    invoiceCode: f.invoiceCode || "",
    tag: f.tag || "",
    active: f.active !== false,
    sortOrder: String(f.sortOrder ?? 0),
  };
}

function toPayload(form: FlavourForm) {
  return {
    name: form.name.trim(),
    nameEn: form.nameEn.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    offerPrice: form.offerPrice.trim() === "" ? null : Number(form.offerPrice),
    weight: form.weight.trim() === "" ? 0.5 : Number(form.weight),
    invoiceCode: form.invoiceCode.trim(),
    tag: form.tag.trim(),
    active: form.active,
    sortOrder: Number(form.sortOrder) || 0,
  };
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1 block text-xs font-semibold text-foreground";

function FlavourFields({
  form,
  setForm,
  disabled,
}: {
  form: FlavourForm;
  setForm: (updater: (prev: FlavourForm) => FlavourForm) => void;
  disabled: boolean;
}) {
  const set = (key: keyof FlavourForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Name (Bangla) *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          disabled={disabled}
          placeholder="ডার্ক চকলেট"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Name (English)</label>
        <p className="mb-1 text-[11px] text-muted-foreground">Stored on orders and sent to the courier.</p>
        <input
          type="text"
          value={form.nameEn}
          onChange={(e) => set("nameEn", e.target.value)}
          disabled={disabled}
          placeholder="Dark Chocolate"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Short Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          disabled={disabled}
          placeholder="রিচ, গভীর ও চকলেটি মজায় ভরপুর"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Regular Price (BDT) *</label>
        <input
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          disabled={disabled}
          placeholder="8990"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Offer Price (BDT)</label>
        <p className="mb-1 text-[11px] text-muted-foreground">What the customer pays. Blank = regular price.</p>
        <input
          type="number"
          min={0}
          value={form.offerPrice}
          onChange={(e) => set("offerPrice", e.target.value)}
          disabled={disabled}
          placeholder="4990"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Weight (KG)</label>
        <p className="mb-1 text-[11px] text-muted-foreground">Sent to Steadfast on the consignment.</p>
        <input
          type="number"
          min={0}
          step={0.1}
          value={form.weight}
          onChange={(e) => set("weight", e.target.value)}
          disabled={disabled}
          placeholder="0.5"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Invoice Code</label>
        <p className="mb-1 text-[11px] text-muted-foreground">
          Steadfast invoice prefix, e.g. MM-DC. Blank = order id only.
        </p>
        <input
          type="text"
          value={form.invoiceCode}
          onChange={(e) => set("invoiceCode", e.target.value)}
          disabled={disabled}
          placeholder="MM-DC"
          className={`${inputClass} font-mono`}
        />
      </div>

      <div>
        <label className={labelClass}>Tag / Badge</label>
        <p className="mb-1 text-[11px] text-muted-foreground">Shown on the card; also the default selection.</p>
        <input
          type="text"
          value={form.tag}
          onChange={(e) => set("tag", e.target.value)}
          disabled={disabled}
          placeholder="সবচেয়ে জনপ্রিয়"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Sort Order</label>
        <p className="mb-1 text-[11px] text-muted-foreground">Lower numbers show first on the website.</p>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
          disabled={disabled}
          placeholder="0"
          className={inputClass}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 sm:col-span-2">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          disabled={disabled}
          className="size-4 accent-primary disabled:cursor-not-allowed"
        />
        <span className="text-sm font-semibold text-foreground">
          Active <span className="font-normal text-muted-foreground">(shown on the website order form)</span>
        </span>
      </label>
    </div>
  );
}

export function ProductsPanel({ isModerator }: { isModerator: boolean }) {
  const [flavours, setFlavours] = useState<Flavour[]>([]);
  const [forms, setForms] = useState<Record<string, FlavourForm>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<FlavourForm>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);

  async function load() {
    const result = await fetchFlavoursAdmin();
    if (result.success && Array.isArray(result.data)) {
      setFlavours(result.data);
      setForms(Object.fromEntries(result.data.map((f) => [f._id, toForm(f)])));
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to load products",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (message?.type === "success") {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function validate(form: FlavourForm): string | null {
    if (!form.name.trim()) return "Name is required.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return "Regular price must be a positive number.";
    if (form.offerPrice.trim() !== "") {
      const offer = Number(form.offerPrice);
      if (!Number.isFinite(offer) || offer < 0) return "Offer price must be a non-negative number.";
      if (offer > price) return "Offer price cannot be higher than the regular price.";
    }
    return null;
  }

  async function handleSave(id: string) {
    const form = forms[id];
    if (!form) return;
    const invalid = validate(form);
    if (invalid) {
      setMessage({ type: "error", text: invalid });
      return;
    }

    setSavingId(id);
    setMessage(null);
    const result = await updateFlavour(id, toPayload(form));
    setSavingId(null);
    if (result.success && result.data) {
      const saved = result.data;
      setFlavours((prev) => prev.map((f) => (f._id === id ? saved : f)));
      setForms((prev) => ({ ...prev, [id]: toForm(saved) }));
      setMessage({ type: "success", text: `"${saved.name}" saved.` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to save product",
      });
    }
  }

  async function handleCreate() {
    const invalid = validate(addForm);
    if (invalid) {
      setMessage({ type: "error", text: invalid });
      return;
    }

    setIsCreating(true);
    setMessage(null);
    const result = await createFlavour(toPayload(addForm));
    setIsCreating(false);
    if (result.success && result.data) {
      const created = result.data;
      setFlavours((prev) => [...prev, created]);
      setForms((prev) => ({ ...prev, [created._id]: toForm(created) }));
      setAddForm(emptyForm);
      setIsAddOpen(false);
      setMessage({ type: "success", text: `"${created.name}" added.` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to add product",
      });
    }
  }

  async function handleDelete(flavour: Flavour) {
    if (
      !confirm(
        `Delete "${flavour.name}"? It will disappear from the website order form. Existing orders keep their flavour.`
      )
    ) {
      return;
    }

    setDeletingId(flavour._id);
    setMessage(null);
    const result = await deleteFlavour(flavour._id);
    setDeletingId(null);
    if (result.success) {
      setFlavours((prev) => prev.filter((f) => f._id !== flavour._id));
      setMessage({ type: "success", text: `"${flavour.name}" deleted.` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to delete product",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        These products are what the website order form shows — name, description, price, offer price and badge.
        The <strong className="text-foreground">weight</strong> and{" "}
        <strong className="text-foreground">invoice code</strong> are used when the order is entered into
        Steadfast. If this list is ever empty, the site falls back to the four built-in flavours.
      </div>

      {message && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {!isModerator && (
        <>
          {isAddOpen ? (
            <div className="rounded-2xl border-2 border-primary/30 bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Plus size={16} className="text-primary" />
                  New Product
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setAddForm(emptyForm);
                  }}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
              <FlavourFields form={addForm} setForm={setAddForm} disabled={isCreating} />
              <div className="mt-4 flex gap-2">
                <Button type="button" onClick={handleCreate} disabled={isCreating} className="gap-2 rounded-xl">
                  {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus size={16} />}
                  {isCreating ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(true)}
              className="gap-2 rounded-xl"
            >
              <Plus size={16} />
              Add Product
            </Button>
          )}
        </>
      )}

      {flavours.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Package className="mx-auto mb-3 text-muted-foreground" size={28} />
          <p className="text-sm font-semibold text-foreground">No products configured</p>
          <p className="mt-1 text-xs text-muted-foreground">
            The website is showing the four built-in flavours as a fallback.
          </p>
        </div>
      ) : (
        flavours.map((flavour) => {
          const form = forms[flavour._id];
          if (!form) return null;
          const isSaving = savingId === flavour._id;

          return (
            <div key={flavour._id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex min-w-0 items-center gap-2 text-sm font-bold text-foreground">
                  <Package size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{flavour.name}</span>
                  {flavour.tag && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      {flavour.tag}
                    </span>
                  )}
                  {!flavour.active && (
                    <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </h3>
                {!isModerator && (
                  <button
                    type="button"
                    onClick={() => handleDelete(flavour)}
                    disabled={deletingId === flavour._id}
                    title="Delete product"
                    className="shrink-0 rounded-lg p-1.5 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                  >
                    {deletingId === flavour._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                )}
              </div>

              <FlavourFields
                form={form}
                setForm={(updater) =>
                  setForms((prev) => ({ ...prev, [flavour._id]: updater(prev[flavour._id]) }))
                }
                disabled={isModerator || isSaving}
              />

              {!isModerator && (
                <Button
                  type="button"
                  onClick={() => handleSave(flavour._id)}
                  disabled={isSaving}
                  className="mt-4 gap-2 rounded-xl"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Product"}
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
