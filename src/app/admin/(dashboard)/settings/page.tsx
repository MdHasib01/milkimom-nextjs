"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2,
  Save,
  Mail,
  Smartphone,
  ShieldAlert,
  Lock,
  Truck,
  KeyRound,
  PlugZap,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  fetchSettings,
  saveSettings,
  testSteadfastConnection,
  getStoredUser,
} from "@/lib/admin-api";
import { ProductsPanel } from "./products-panel";

type Tab = "general" | "steadfast" | "products";

export default function AdminSettingsPage() {
  const currentUser = getStoredUser();
  const isModerator = currentUser?.role === "moderator";

  const [activeTab, setActiveTab] = useState<Tab>("general");

  const [adminEmail, setAdminEmail] = useState("");
  const [adminMobile, setAdminMobile] = useState("");

  const [steadfastEnabled, setSteadfastEnabled] = useState(false);
  const [steadfastApiKey, setSteadfastApiKey] = useState("");
  const [steadfastSecretKey, setSteadfastSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetchSettings();
      if (result.success && result.data) {
        setAdminEmail(result.data.adminEmail || "");
        setAdminMobile(result.data.adminMobile || "");
        setSteadfastEnabled(Boolean(result.data.steadfastEnabled));
        setSteadfastApiKey(result.data.steadfastApiKey || "");
        setSteadfastSecretKey(result.data.steadfastSecretKey || "");
      }
      setLoading(false);
    })();
  }, []);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setMessage(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (isModerator) return;

    if (steadfastEnabled && (!steadfastApiKey.trim() || !steadfastSecretKey.trim())) {
      setActiveTab("steadfast");
      setMessage({
        type: "error",
        text: "API Key and Secret Key are required to enable the Steadfast integration.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);
    const result = await saveSettings({
      adminEmail: adminEmail.trim(),
      adminMobile: adminMobile.trim(),
      steadfastEnabled,
      steadfastApiKey: steadfastApiKey.trim(),
      steadfastSecretKey: steadfastSecretKey.trim(),
    });
    setSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Settings saved successfully." });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to save settings",
      });
    }
  }

  async function handleTestConnection() {
    if (isModerator) return;
    if (!steadfastApiKey.trim() || !steadfastSecretKey.trim()) {
      setMessage({ type: "error", text: "Enter the API Key and Secret Key first." });
      return;
    }

    setTesting(true);
    setMessage(null);
    const result = await testSteadfastConnection({
      apiKey: steadfastApiKey.trim(),
      secretKey: steadfastSecretKey.trim(),
    });
    setTesting(false);
    if (result.success && result.data) {
      setMessage({
        type: "success",
        text: `Connected to Steadfast successfully. Current balance: ${result.data.balance} BDT.`,
      });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Could not connect to Steadfast",
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={activeTab === "products" ? "max-w-4xl" : "max-w-xl"}>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Settings</h1>

      {isModerator && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-semibold text-amber-700 dark:text-amber-400">
          <ShieldAlert size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>You are logged in as a Moderator (View-Only). Settings can be viewed, but editing and saving are restricted to Admins.</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-1 rounded-2xl border border-border bg-card p-1.5">
            <button
              type="button"
              onClick={() => switchTab("general")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "general"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Mail size={15} />
              General
            </button>
            <button
              type="button"
              onClick={() => switchTab("steadfast")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "steadfast"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Truck size={15} />
              Steadfast Courier
            </button>
            <button
              type="button"
              onClick={() => switchTab("products")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "products"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Package size={15} />
              Products
            </button>
          </div>

          {activeTab === "products" ? (
            <ProductsPanel isModerator={isModerator} />
          ) : (
          <form onSubmit={handleSave}>
          <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
            {activeTab === "general" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Admin Email</label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    New order notification emails are sent to this address.
                  </p>
                  <div className="relative">
                    <Mail size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={isModerator}
                      placeholder="admin@milkimom.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Admin Mobile</label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    New order notification SMS is sent to this number.
                  </p>
                  <div className="relative">
                    <Smartphone size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={adminMobile}
                      onChange={(e) => setAdminMobile(e.target.value)}
                      disabled={isModerator}
                      placeholder="01XXXXXXXXX"
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "steadfast" && (
              <>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
                  When enabled, every order that is marked <strong className="text-foreground">Confirmed</strong> is
                  automatically entered as a consignment in your Steadfast merchant account, and the courier&apos;s
                  delivery status is synced back every 30 minutes — orders are auto-marked{" "}
                  <strong className="text-foreground">Delivered</strong> or{" "}
                  <strong className="text-foreground">Cancelled</strong>. Get your API keys from the{" "}
                  <a
                    href="https://steadfast.com.bd/user/api"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary underline"
                  >
                    Steadfast merchant panel → API
                  </a>
                  .
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3.5">
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Enable Steadfast Integration</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Auto entry on confirm + automatic delivery status updates
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={steadfastEnabled}
                    onChange={(e) => setSteadfastEnabled(e.target.checked)}
                    disabled={isModerator}
                    className="size-5 shrink-0 accent-primary disabled:cursor-not-allowed"
                  />
                </label>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">API Key</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={steadfastApiKey}
                      onChange={(e) => setSteadfastApiKey(e.target.value)}
                      disabled={isModerator}
                      placeholder="Your Steadfast API Key"
                      autoComplete="off"
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Secret Key</label>
                  <div className="relative">
                    <Lock size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showSecret ? "text" : "password"}
                      value={steadfastSecretKey}
                      onChange={(e) => setSteadfastSecretKey(e.target.value)}
                      disabled={isModerator}
                      placeholder="Your Steadfast Secret Key"
                      autoComplete="off"
                      className={`${inputClass} pr-11 font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret((v) => !v)}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showSecret ? "Hide secret key" : "Show secret key"}
                    >
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing || isModerator}
                  className="gap-2 rounded-xl"
                >
                  {testing ? <Loader2 className="size-4 animate-spin" /> : <PlugZap size={16} />}
                  {testing ? "Testing..." : "Test Connection"}
                </Button>
              </>
            )}

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

            <Button type="submit" disabled={saving || isModerator} className="gap-2 rounded-xl px-6 py-3">
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isModerator ? (
                <Lock size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : isModerator ? "Read-Only (Moderator)" : "Save Settings"}
            </Button>
          </div>
          </form>
          )}
        </>
      )}
    </div>
  );
}
