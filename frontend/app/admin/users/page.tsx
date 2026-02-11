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
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Users</p>
          <h2 className="text-2xl font-bold text-[#1a2b44]">Manage Users</h2>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="h-10 rounded-lg border border-[#c7d9f5] px-3 text-sm"
        />
        <button
          type="button"
          onClick={() => void load(1, search)}
          className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e6eef9]">
        <table className="min-w-full divide-y divide-[#e6eef9] text-sm">
          <thead className="bg-[#f7faff]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Name</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Email</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Phone</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef4ff] bg-white">
            {users.map((user) => {
              const id = getId(user);
              return (
                <tr key={id || Math.random()}>
                  <td className="px-3 py-2">{String(user.fullName || "-")}</td>
                  <td className="px-3 py-2">{String(user.email || "-")}</td>
                  <td className="px-3 py-2">{String(user.phone || "-")}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${id}`}
                        className="rounded border border-[#d8e5f8] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/users/${id}/edit`}
                        className="rounded bg-[#4A90E2] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(id)}
                        className="rounded bg-[#b91c1c] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
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
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-[#5f7590]">
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
          className="rounded border border-[#d8e5f8] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44] disabled:opacity-40"
        >
          Prev
        </button>
        <p className="text-sm text-[#5f7590]">
          Page {page} / {totalPages}
        </p>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => void load(page + 1, search)}
          className="rounded border border-[#d8e5f8] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44] disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {message ? <p className="text-sm text-[#b91c1c]">{message}</p> : null}
    </div>
  );
}

