"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save, Mail, Smartphone, ShieldAlert, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchSettings, saveSettings, getStoredUser } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const currentUser = getStoredUser();
  const isModerator = currentUser?.role === "moderator";

  const [adminEmail, setAdminEmail] = useState("");
  const [adminMobile, setAdminMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetchSettings();
      if (result.success && result.data) {
        setAdminEmail(result.data.adminEmail || "");
        setAdminMobile(result.data.adminMobile || "");
      }
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (isModerator) return;

    setSaving(true);
    setMessage(null);
    const result = await saveSettings({ adminEmail: adminEmail.trim(), adminMobile: adminMobile.trim() });
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

  return (
    <div className="max-w-xl">
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
        <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-border bg-card p-6">
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
                className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 font-mono text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
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
        </form>
      )}
    </div>
  );
}

