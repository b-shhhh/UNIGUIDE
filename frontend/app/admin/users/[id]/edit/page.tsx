import Link from "next/link";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditUserPage({ params }: Params) {
  const { id } = await params;

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Edit</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">Edit User: {id}</h2>
      <div className="rounded-lg border border-dashed border-[#c7d9f5] p-5 text-sm text-[#5f7590]">
        Update-user form goes here. Connect to backend admin update/delete APIs.
      </div>
      <Link href={`/admin/users/${id}`} className="text-sm font-semibold text-[#4A90E2]">
        Back to detail
      </Link>
    </div>
  );
}
