"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Lock,
  KeyRound,
  Loader2,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getToken, getStoredUser, logout, changePassword } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/customization", label: "Customization", Icon: Palette },
  { href: "/admin/users", label: "User Management", Icon: Users },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  // Mandatory First Login Password Change Modal
  const [mustChangeModal, setMustChangeModal] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
    } else if (user && user.mustChangePassword) {
      setMustChangeModal(true);
    } else if (user?.role === "moderator" && pathname.startsWith("/admin/users")) {
      router.replace("/admin/dashboard");
    }
  }, [router, user, pathname]);

  async function handleFirstLoginPassChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Passwords do not match");
      return;
    }

    setChangingPass(true);
    setPassError("");

    const result = await changePassword(newPass);
    setChangingPass(false);

    if (result.success && result.data) {
      if (typeof window !== "undefined") {
        const currentUser = getStoredUser();
        if (currentUser) {
          localStorage.setItem(
            "milkimom_admin_user",
            JSON.stringify({ ...currentUser, mustChangePassword: false })
          );
        }
      }
      setMustChangeModal(false);
    } else {
      setPassError(typeof result.error === "string" ? result.error : "Failed to update password");
    }
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!getToken()) return null;

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  const navItems = NAV_ITEMS.filter((item) => {
    if (user?.role === "moderator" && item.href === "/admin/users") {
      return false;
    }
    return true;
  });

  const renderNavLinks = (isCollapsed = false) => (
    <nav className="flex-1 space-y-1.5 px-3 py-4">
      {navItems.map(({ href, label, Icon }) => {
        const isActive =
          href === "/admin"
            ? pathname === "/admin" || pathname === "/admin/dashboard"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            title={isCollapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm font-semibold transition-all duration-150 relative group",
              isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              size={isCollapsed ? 20 : 18}
              className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")}
            />
            {!isCollapsed && <span className="truncate">{label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 hidden group-hover:flex items-center rounded-md bg-popover px-2.5 py-1.5 text-xs font-semibold text-popover-foreground shadow-md border border-border z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                {label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40 text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Navigation Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle Navigation Menu"
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground hover:bg-muted"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Milkimom"
              width={100}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={13} />
              <span className="max-w-[90px] truncate">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/logo.png"
                  alt="Milkimom"
                  width={110}
                  height={30}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            {renderNavLinks(false)}

            {/* Footer / User Profile */}
            <div className="border-t border-border p-4 bg-muted/30">
              {user && (
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  <ExternalLink size={13} /> View Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed left navigation) */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:flex-col md:border-r md:border-border md:bg-card md:shadow-xs transition-all duration-300 ease-in-out",
          collapsed ? "md:w-20" : "md:w-64"
        )}
      >
        {/* Sidebar Brand Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/80 transition-all duration-300",
            collapsed ? "justify-center px-2" : "justify-between px-6"
          )}
        >
          {!collapsed ? (
            <>
              <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
                <Image
                  src="/assets/logo.png"
                  alt="Milkimom"
                  width={120}
                  height={34}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={toggleCollapsed}
                title="Collapse sidebar"
                className="flex size-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={toggleCollapsed}
              title="Expand sidebar"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2">
          {renderNavLinks(collapsed)}
        </div>

        {/* Bottom User Info & Logout */}
        {collapsed ? (
          <div className="border-t border-border/80 p-3 bg-muted/20 flex flex-col items-center gap-3">
            {user && (
              <div
                title={`${user.name} (${user.role})`}
                className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20 shadow-2xs cursor-default"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <Link
                href="/"
                target="_blank"
                title="View Website"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
              >
                <ExternalLink size={16} />
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-border/80 p-4 bg-muted/20">
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{user.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground capitalize font-mono">{user.role}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between px-1">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink size={13} /> View Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Workspace Area */}
      <main className={cn("flex-1 min-w-0 min-h-screen transition-all duration-300 ease-in-out", collapsed ? "md:pl-20" : "md:pl-64")}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>

      {/* MANDATORY FIRST-LOGIN PASSWORD UPDATE MODAL */}
      {mustChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Update Temporary Password</h3>
                <p className="text-xs text-muted-foreground">Security Requirement</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              You logged in using a temporary 8-character password key. Please create a new password to activate your account.
            </p>

            {passError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                {passError}
              </div>
            )}

            <form onSubmit={handleFirstLoginPassChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  {changingPass && <Loader2 size={16} className="animate-spin" />}
                  <span>Update Password & Continue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

