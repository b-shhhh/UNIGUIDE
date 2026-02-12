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
    <div className="space-y-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">User Detail</p>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">User Description</h2>
        </div>
        <Link href={`/admin/users/${id}/edit`} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800">
          Edit User
        </Link>
      </div>

      {!user ? (
        <p className="text-sm font-medium text-rose-700">{res.message || "User not found"}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Full Name</p>
            <p className="text-sm font-semibold text-slate-800">{String(user.fullName || "-")}</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Email</p>
            <p className="text-sm font-semibold text-slate-800">{String(user.email || "-")}</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Phone</p>
            <p className="text-sm font-semibold text-slate-800">{String(user.phone || "-")}</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Role</p>
            <p className="text-sm font-semibold text-slate-800">{String(user.role || "-")}</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Bio</p>
            <p className="text-sm font-semibold text-slate-800">{String(user.bio || "-")}</p>
          </div>
        </div>
      )}

      <Link href="/admin/users" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
        Back to users
      </Link>
    </div>
  );
}
