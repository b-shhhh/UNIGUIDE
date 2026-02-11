import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserById } from "@/lib/api/admin/user";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Params) {
  const { id } = await params;
  const response = await getAdminUserById(id);
  const user = response.data;

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">User Detail</p>
          <h2 className="text-2xl font-bold text-slate-900">
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-700 hover:bg-blue-200"
        >
          Edit User
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Email</p>
          <p className="mt-1 font-semibold text-slate-800">{user.email}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Phone</p>
          <p className="mt-1 font-semibold text-slate-800">{user.phone}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Created</p>
          <p className="mt-1 font-semibold text-slate-800">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Updated</p>
          <p className="mt-1 font-semibold text-slate-800">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
