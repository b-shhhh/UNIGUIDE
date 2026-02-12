"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminDeleteUser, adminListUsers } from "@/lib/api/admin-users";

type UserItem = Record<string, unknown> & { _id?: string; id?: string };

const getId = (user: UserItem) => (typeof user._id === "string" ? user._id : typeof user.id === "string" ? user.id : "");

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = async (nextPage = page, nextSearch = search) => {
    const res = await adminListUsers({ page: nextPage, limit: 10, search: nextSearch });
    if (!res.success) {
      setMessage(res.message || "Failed to load users");
      return;
    }
    setUsers(Array.isArray(res.data) ? res.data : []);
    setTotalPages(res.pagination?.totalPages || 1);
    setPage(res.pagination?.page || nextPage);
    setMessage("");
  };

  useEffect(() => {
    void load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;
    const res = await adminDeleteUser(id);
    if (!res.success) {
      setMessage(res.message || "Delete failed");
      return;
    }
    await load(page, search);
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Admin Users</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Manage user accounts</h2>
          <p className="mt-2 text-sm text-sky-100">Review user data, edit profiles, and remove accounts when needed.</p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Users</p>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Manage Users</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="h-10 rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => void load(1, search)}
              className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-sky-100">
          <table className="min-w-full divide-y divide-sky-100 text-sm">
            <thead className="bg-sky-50/60">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Name</th>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Email</th>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Phone</th>
                <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 bg-white">
              {users.map((user) => {
                const id = getId(user);
                return (
                  <tr key={id || Math.random()}>
                    <td className="px-3 py-2 text-slate-700">{String(user.fullName || "-")}</td>
                    <td className="px-3 py-2 text-slate-700">{String(user.email || "-")}</td>
                    <td className="px-3 py-2 text-slate-700">{String(user.phone || "-")}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${id}`}
                          className="rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-sky-50"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${id}/edit`}
                          className="rounded-lg bg-sky-700 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void onDelete(id)}
                          className="rounded-lg bg-rose-700 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!users.length ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => void load(page - 1, search)}
            className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-sky-50 disabled:opacity-40"
          >
            Prev
          </button>
          <p className="text-sm text-slate-500">
            Page {page} / {totalPages}
          </p>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => void load(page + 1, search)}
            className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-sky-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {message ? <p className="text-sm font-medium text-rose-700">{message}</p> : null}
      </section>
    </div>
  );
}
