"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, UserPlus, Trash2, KeyRound, X } from "lucide-react";

import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getStoredUser,
  type AdminUser,
} from "@/lib/admin-api";

export default function AdminUsersPage() {
  const currentUser = getStoredUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [resetId, setResetId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() is the shared fetch reused after create/update/delete
    load();
  }, [load]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    const result = await createAdminUser({ name: newName.trim(), email: newEmail.trim(), password: newPassword });
    setCreating(false);
    if (result.success) {
      setShowCreate(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      load();
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to create admin user");
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!resetId) return;
    setBusyId(resetId);
    const result = await updateAdminUser(resetId, { password: resetPassword });
    setBusyId(null);
    if (result.success) {
      setResetId(null);
      setResetPassword("");
      alert("Password updated.");
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update password");
    }
  }

  async function handleToggleActive(user: AdminUser) {
    setBusyId(user.id);
    const result = await updateAdminUser(user.id, { active: !user.active });
    setBusyId(null);
    if (result.success) {
      load();
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to update user");
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Delete admin "${user.name}" (${user.email})? This cannot be undone.`)) return;
    setBusyId(user.id);
    const result = await deleteAdminUser(user.id);
    setBusyId(null);
    if (result.success) {
      load();
    } else {
      alert(typeof result.error === "string" ? result.error : "Failed to delete user");
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Admin Users</h1>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-95 active:scale-[0.98]"
        >
          {showCreate ? <X size={16} /> : <UserPlus size={16} />}
          {showCreate ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Name"
            className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            placeholder="Email"
            className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-bold text-background hover:opacity-90 disabled:opacity-60 sm:col-span-3"
          >
            {creating && <Loader2 className="animate-spin" size={16} />}
            Create Admin User
          </button>
        </form>
      )}

      {error && (
        <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-foreground">{user.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      user.role === "superadmin" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                  {!user.active && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                      Deactivated
                    </span>
                  )}
                  {currentUser?.id === user.id && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                      You
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                {user.lastLoginAt && (
                  <p className="text-xs text-muted-foreground">
                    Last login: {new Date(user.lastLoginAt).toLocaleString("en-GB")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setResetId(resetId === user.id ? null : user.id);
                    setResetPassword("");
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  <KeyRound size={14} /> Reset Password
                </button>
                {currentUser?.id !== user.id && (
                  <>
                    <button
                      onClick={() => handleToggleActive(user)}
                      disabled={busyId === user.id}
                      className="rounded-lg border border-input px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={busyId === user.id}
                      className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>

              {resetId === user.id && (
                <form onSubmit={handleResetPassword} className="flex w-full gap-2 sm:mt-2 sm:basis-full">
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="New password (min 6 chars)"
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={busyId === user.id}
                    className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-60"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
