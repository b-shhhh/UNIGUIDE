import Link from "next/link";
import { adminGetUser } from "@/lib/api/admin-users";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: Params) {
  const { id } = await params;
  const res = await adminGetUser(id);
  const user = res.success ? res.data : null;

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">User Detail</p>
          <h2 className="text-2xl font-bold text-[#1a2b44]">User Description</h2>
        </div>
        <Link href={`/admin/users/${id}/edit`} className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">
          Edit User
        </Link>
      </div>

      {!user ? (
        <p className="text-sm text-[#b91c1c]">{res.message || "User not found"}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#e6eef9] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Full Name</p>
            <p className="text-sm font-semibold text-[#1a2b44]">{String(user.fullName || "-")}</p>
          </div>
          <div className="rounded-lg border border-[#e6eef9] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Email</p>
            <p className="text-sm font-semibold text-[#1a2b44]">{String(user.email || "-")}</p>
          </div>
          <div className="rounded-lg border border-[#e6eef9] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Phone</p>
            <p className="text-sm font-semibold text-[#1a2b44]">{String(user.phone || "-")}</p>
          </div>
          <div className="rounded-lg border border-[#e6eef9] p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Role</p>
            <p className="text-sm font-semibold text-[#1a2b44]">{String(user.role || "-")}</p>
          </div>
          <div className="rounded-lg border border-[#e6eef9] p-3 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Bio</p>
            <p className="text-sm font-semibold text-[#1a2b44]">{String(user.bio || "-")}</p>
          </div>
        </div>
      )}

      <Link href="/admin/users" className="text-sm font-semibold text-[#4A90E2]">
        Back to users
      </Link>
    </div>
  );
}

