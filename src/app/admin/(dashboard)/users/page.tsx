"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Loader2,
  UserPlus,
  Trash2,
  KeyRound,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  getStoredUser,
  type AdminUser,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<
  "superadmin" | "admin" | "moderator",
  { label: string; badge: string; desc: string }
> = {
  superadmin: {
    label: "Super Admin",
    badge: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    desc: "Full access (Manage users, reset passwords, edit/delete orders)",
  },
  admin: {
    label: "Admin",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    desc: "Full order management (View, edit, change status, delete orders)",
  },
  moderator: {
    label: "Moderator",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    desc: "View-only access (View details, track orders, print invoices)",
  },
};

export default function AdminUsersPage() {
  const currentUser = getStoredUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"superadmin" | "admin" | "moderator">("admin");
  const [customPassword, setCustomPassword] = useState("");
  const [useAutoPassword, setUseAutoPassword] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ name: string; email: string; key: string } | null>(null);

  // Reset Password Modal State
  const [userToReset, setUserToReset] = useState<AdminUser | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<{ name: string; key: string } | null>(null);

  // Delete User Modal State
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === "superadmin";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await fetchAdminUsers();
    if (result.success) {
      setUsers(result.data || []);
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to load admin users");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    const payload = {
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      ...(useAutoPassword ? {} : { password: customPassword }),
    };

    const result = await createAdminUser(payload);
    setCreating(false);

    if (result.success && result.data) {
      const dataObj = result.data as AdminUser & { generatedPassword?: string };
      setCreatedResult({
        name: dataObj.name,
        email: dataObj.email,
        key: dataObj.generatedPassword || "Set by admin",
      });
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to create user");
    }
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
    setNewName("");
    setNewEmail("");
    setNewRole("admin");
    setCustomPassword("");
    setUseAutoPassword(true);
    setCreatedResult(null);
  }

  async function confirmResetPassword() {
    if (!userToReset) return;
    const targetUser = userToReset;
    setResettingId(targetUser.id);
    const result = await resetAdminUserPassword(targetUser.id);
    setUserToReset(null);
    setResettingId(null);

    if (result.success && result.data) {
      const dataObj = result.data as AdminUser & { generatedPassword?: string };
      setResetResult({
        name: targetUser.name,
        key: dataObj.generatedPassword || "Generated",
      });
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to reset password");
    }
  }

  async function confirmDeleteUser() {
    if (!userToDelete) return;
    const targetUser = userToDelete;
    setBusyId(targetUser.id);
    const result = await deleteAdminUser(targetUser.id);
    setUserToDelete(null);
    setBusyId(null);
    if (result.success) {
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to delete user");
    }
  }

  async function handleToggleActive(user: AdminUser) {
    setBusyId(user.id);
    const result = await updateAdminUser(user.id, { active: !user.active });
    setBusyId(null);
    if (result.success) {
      load();
    } else {
      setError(typeof result.error === "string" ? result.error : "Failed to update user status");
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header & Create User Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage admin users, roles (Super Admin, Admin, Moderator), and password resets.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition"
        >
          <UserPlus size={16} />
          <span>Create User</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Reset Password Success Notification Popup */}
      {resetResult && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Password Reset Successfully for {resetResult.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  An email with the new password has been sent. The user must update their password on next login.
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-lg bg-card border border-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-foreground">
                  <span>New Generated Password:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold select-all tracking-wider text-sm">
                    {resetResult.key}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setResetResult(null)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Users List Card */}
      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="divide-y divide-border/60">
            {users.map((user) => {
              const roleConf = ROLE_CONFIG[user.role] || ROLE_CONFIG.admin;
              const isSelf = currentUser?.id === user.id;

              return (
                <div key={user.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-foreground text-sm">{user.name}</p>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase", roleConf.badge)}>
                        {roleConf.label}
                      </span>
                      {!user.active && (
                        <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                          Deactivated
                        </span>
                      )}
                      {user.mustChangePassword && (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Pending Password Change
                        </span>
                      )}
                      {isSelf && (
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs font-mono text-muted-foreground">{user.email}</p>
                    <p className="text-[11px] text-muted-foreground">{roleConf.desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Super Admin Reset Password Button */}
                    {isSuperAdmin && (
                      <button
                        onClick={() => setUserToReset(user)}
                        disabled={resettingId === user.id}
                        title="Reset password modal"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-600 hover:bg-amber-500/20 transition disabled:opacity-50"
                      >
                        {resettingId === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <KeyRound size={14} />
                        )}
                        <span>Reset Password</span>
                      </button>
                    )}

                    {!isSelf && (
                      <>
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={busyId === user.id}
                          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition disabled:opacity-50"
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          disabled={busyId === user.id}
                          title="Delete user"
                          className="inline-flex size-9 items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40 transition disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RESET PASSWORD CONFIRMATION MODAL */}
      {userToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Reset Password</h3>
                  <p className="text-xs text-muted-foreground">Super Admin Security Action</p>
                </div>
              </div>
              <button
                onClick={() => setUserToReset(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-foreground leading-relaxed">
              Are you sure you want to reset the password for <strong className="text-foreground">{userToReset.name}</strong> (<span className="font-mono text-muted-foreground">{userToReset.email}</span>)?
            </p>

            <div className="rounded-xl bg-muted/50 border border-border/80 p-3.5 text-[11px] text-muted-foreground space-y-1.5">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-500" /> Reset Process Overview:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>A new 8-character password will be auto-generated.</li>
                <li>An email notification containing the new password will be sent to the user.</li>
                <li>The user will be required to update their password on next login.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                onClick={() => setUserToReset(null)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetPassword}
                disabled={resettingId === userToReset.id}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition disabled:opacity-50"
              >
                {resettingId === userToReset.id && <Loader2 size={14} className="animate-spin" />}
                <span>Confirm Reset Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Delete Admin User</h3>
                  <p className="text-xs text-muted-foreground">Permanent Action</p>
                </div>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{userToDelete.name}</strong> (<span className="font-mono text-muted-foreground">{userToDelete.email}</span>)?
            </p>
            <p className="text-[11px] font-semibold text-destructive">
              ⚠️ This account will be permanently removed and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                onClick={() => setUserToDelete(null)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={busyId === userToDelete.id}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                {busyId === userToDelete.id && <Loader2 size={14} className="animate-spin" />}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER POPUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-primary" />
                <h3 className="text-lg font-bold text-foreground">Create Admin User</h3>
              </div>
              <button
                onClick={handleCloseCreateModal}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {createdResult ? (
              <div className="space-y-4 text-xs">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} /> User Created Successfully!
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    An email with the temporary login password has been sent to <strong className="text-foreground">{createdResult.email}</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                  <p className="font-bold text-foreground">Generated Password (8-Character):</p>
                  <div className="flex items-center justify-between rounded-lg bg-card border border-border px-3 py-2.5 font-mono text-sm font-bold text-primary select-all">
                    <span>{createdResult.key}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    The user will be required to update their password on their first login.
                  </p>
                </div>

                <button
                  onClick={handleCloseCreateModal}
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Md Hasib"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@milkimom.com"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">User Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "superadmin" | "admin" | "moderator")}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground outline-none focus:border-primary"
                  >
                    <option value="admin">Admin (Full order manage & status update)</option>
                    <option value="moderator">Moderator (View order details, track & print only)</option>
                    <option value="superadmin">Super Admin (All permissions & reset passwords)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {ROLE_CONFIG[newRole].desc}
                  </p>
                </div>

                {/* Password Options */}
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAutoPassword}
                      onChange={(e) => setUseAutoPassword(e.target.checked)}
                      className="rounded border-input text-primary accent-primary"
                    />
                    <span className="font-semibold text-foreground">
                      Auto-generate random 8-character key & email user
                    </span>
                  </label>

                  {!useAutoPassword && (
                    <div>
                      <label className="block font-bold text-foreground mb-1">Custom Password *</label>
                      <input
                        type="password"
                        required={!useAutoPassword}
                        minLength={6}
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
                  >
                    {creating && <Loader2 size={14} className="animate-spin" />}
                    <span>Create Account</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
