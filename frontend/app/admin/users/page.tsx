import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Users</p>
          <h2 className="text-2xl font-bold text-[#1a2b44]">All Users</h2>
        </div>
        <Link
          href="/admin/users/create"
          className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Create User
        </Link>
      </div>
      <div className="rounded-lg border border-dashed border-[#c7d9f5] p-5 text-sm text-[#5f7590]">
        User table UI goes here. Connect this page to backend admin list API.
      </div>
    </div>
  );
}
