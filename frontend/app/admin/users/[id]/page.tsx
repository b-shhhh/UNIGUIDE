import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: Params) {
  await requireAdmin();
  const { id } = await params;

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">User Detail</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">User ID: {id}</h2>
      <div className="rounded-lg border border-dashed border-[#c7d9f5] p-5 text-sm text-[#5f7590]">
        User detail card goes here. Connect to backend admin get-user API.
      </div>
      <Link href={`/admin/users/${id}/edit`} className="text-sm font-semibold text-[#4A90E2]">
        Edit user
      </Link>
    </div>
  );
}
