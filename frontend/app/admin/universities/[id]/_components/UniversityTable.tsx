"use client";

import Link from "next/link";

type Row = {
  id: string;
  name: string;
  country: string;
  courses: string;
};

export default function UniversityTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e6eef9]">
      <table className="min-w-full divide-y divide-[#e6eef9] text-sm">
        <thead className="bg-[#f7faff]">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Name</th>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Country</th>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Courses</th>
            <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eef4ff] bg-white">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 text-[#1a2b44]">{row.name}</td>
              <td className="px-3 py-2 text-[#1a2b44]">{row.country}</td>
              <td className="px-3 py-2 text-[#1a2b44]">{row.courses}</td>
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/universities/${row.id}`}
                    className="rounded border border-[#d8e5f8] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/universities/${row.id}`}
                    className="rounded bg-[#4A90E2] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-sm text-[#5f7590]">
                No universities found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

