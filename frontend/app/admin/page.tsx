import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Overview</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">Admin Dashboard</h2>
      <p className="text-sm text-[#5f7590]">Frontend admin module is set up. You can now connect backend admin APIs.</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/users"
          className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Manage Users
        </Link>
        <Link
          href="/admin/users/create"
          className="rounded-lg border border-[#d8e5f8] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
        >
          Add User
        </Link>
      </div>
    </div>
  );
}
