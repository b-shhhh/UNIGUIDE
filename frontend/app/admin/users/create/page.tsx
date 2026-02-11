import Link from "next/link";

export default function AdminCreateUserPage() {
  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Create</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">Create User</h2>
      <div className="rounded-lg border border-dashed border-[#c7d9f5] p-5 text-sm text-[#5f7590]">
        Create-user form goes here. Connect to backend admin create API.
      </div>
      <Link href="/admin/users" className="text-sm font-semibold text-[#4A90E2]">
        Back to users
      </Link>
    </div>
  );
}
