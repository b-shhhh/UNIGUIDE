"use client";

import Link from "next/link";

type Row = {
  id: string;
  name: string;
  country: string;
  courses: string;
};

export default function UniversityTable({ rows, onDelete }: { rows: Row[]; onDelete: (id: string) => Promise<void> }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sky-100">
      <table className="min-w-full divide-y divide-sky-100 text-sm">
        <thead className="bg-sky-50/60">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Name</th>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Country</th>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Courses</th>
            <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50 bg-white">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 text-slate-700">{row.name}</td>
              <td className="px-3 py-2 text-slate-700">{row.country}</td>
              <td className="px-3 py-2 text-slate-700">{row.courses}</td>
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/universities/${row.id}`}
                    className="rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-sky-50"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/universities/${row.id}`}
                    className="rounded-lg bg-sky-700 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onDelete(row.id)}
                    className="rounded-lg bg-rose-700 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                No universities found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
