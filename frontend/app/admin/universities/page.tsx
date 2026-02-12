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
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Universities</p>
          <h2 className="text-2xl font-bold text-[#1a2b44]">Manage Universities</h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search university..."
            className="h-10 rounded-lg border border-[#c7d9f5] px-3 text-sm"
          />
          <button
            type="button"
            onClick={() => void load(1, search)}
            className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Search
          </button>
          <Link
            href="/admin/universities/create"
            className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Create
          </Link>
        </div>
      </div>

      <UniversityTable rows={rows} onDelete={onDelete} />

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
