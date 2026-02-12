"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UniversityTable from "./[id]/_components/UniversityTable";
import { adminDeleteUniversity, adminListUniversities } from "@/lib/api/admin-universities";

type UniversityItem = Record<string, unknown> & { _id?: string; id?: string; name?: string; country?: string; courses?: unknown };

const getId = (item: UniversityItem) =>
  (typeof item._id === "string" && item._id) || (typeof item.id === "string" && item.id) || "";

const toCourses = (courses: unknown) =>
  Array.isArray(courses) ? courses.map((course) => String(course)).filter(Boolean).join(", ") : String(courses || "");

export default function UniversitiesPage() {
  const [items, setItems] = useState<UniversityItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = async (nextPage = page, nextSearch = search) => {
    const res = await adminListUniversities({ page: nextPage, limit: 10, search: nextSearch });
    if (!res.success) {
      setMessage(res.message || "Failed to load universities");
      return;
    }
    setItems(Array.isArray(res.data) ? res.data : []);
    setTotalPages(res.pagination?.totalPages || 1);
    setPage(res.pagination?.page || nextPage);
    setMessage("");
  };

  useEffect(() => {
    void load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id: string) => {
    if (!id) return;
    const ok = window.confirm("Delete this university?");
    if (!ok) return;
    const res = await adminDeleteUniversity(id);
    if (!res.success) {
      setMessage(res.message || "Delete failed");
      return;
    }
    await load(page, search);
  };

  const rows = items.map((item) => ({
    id: getId(item),
    name: String(item.name || "-"),
    country: String(item.country || "-"),
    courses: toCourses(item.courses) || "-",
  }));

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Admin Universities</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Manage university records</h2>
            <p className="mt-2 text-sm text-sky-100">Search, edit, create, and maintain university data from one page.</p>
          </div>
          <Link
            href="/admin/universities/create"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-white/20"
          >
            Add University
          </Link>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Universities</p>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Manage Universities</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search university..."
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

        <UniversityTable rows={rows} onDelete={onDelete} />

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
