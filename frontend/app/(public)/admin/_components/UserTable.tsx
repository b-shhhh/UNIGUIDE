import Link from "next/link";
import type { AdminUser } from "@/lib/api/admin/user";

type Props = {
  users: AdminUser[];
};

export default function UserTable({ users }: Props) {
  if (!users.length) {
    return (
      <div className="rounded-[8px] border border-[#d8e5f8] bg-white p-8 text-center text-sm text-[#666666] shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#d8e5f8] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f3f8ff] text-xs uppercase tracking-[0.08em] text-[#666666]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#d8e5f8]">
                <td className="px-4 py-3 font-semibold text-[#333333]">
                  {user.fullName}
                </td>
                <td className="px-4 py-3 text-[#666666]">{user.email}</td>
                <td className="px-4 py-3 text-[#666666]">{user.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-[8px] border border-[#d8e5f8] bg-white px-2.5 py-1.5 text-xs font-bold text-[#4A90E2] hover:bg-[#eef5ff]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="rounded-[8px] bg-[#4A90E2] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#357ABD]"
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
