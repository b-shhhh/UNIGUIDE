import Link from "next/link";
import type { AdminUser } from "@/lib/api/admin/user";

type Props = {
  users: AdminUser[];
};

export default function UserTable({ users }: Props) {
  if (!users.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-slate-700">{user.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="rounded-md bg-blue-100 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
