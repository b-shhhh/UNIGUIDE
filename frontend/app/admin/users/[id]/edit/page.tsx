"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGetUser, adminUpdateUser } from "@/lib/api/admin-users";

export default function AdminEditUserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "user",
    country: "",
    bio: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await adminGetUser(id);
      if (!active) return;
      if (!res.success || !res.data) {
        setMessage(res.message || "User not found");
        setLoading(false);
        return;
      }
      setForm({
        fullName: String(res.data.fullName || ""),
        email: String(res.data.email || ""),
        phone: String(res.data.phone || ""),
        role: String(res.data.role || "user"),
        country: String(res.data.country || ""),
        bio: String(res.data.bio || ""),
      });
      setLoading(false);
    };
    if (id) void load();
    return () => {
      active = false;
    };
  }, [id]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await adminUpdateUser(id, form);
    setSaving(false);
    if (!res.success) {
      setMessage(res.message || "Update failed");
      return;
    }
    router.push(`/admin/users/${id}`);
    router.refresh();
  };

  if (loading) {
    return <div className="rounded-2xl border border-sky-100 bg-white p-5 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">Loading user...</div>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Edit</p>
      <h2 className="text-2xl font-black tracking-tight text-slate-900">Edit User</h2>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Full Name
          <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Email
          <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Phone
          <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Role
          <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Country
          <input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 sm:col-span-2">
          Bio
          <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <div className="sm:col-span-2 flex items-center gap-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href={`/admin/users/${id}`} className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            Cancel
          </Link>
        </div>
      </form>
      {message ? <p className="text-sm font-medium text-rose-700">{message}</p> : null}
    </div>
  );
}
