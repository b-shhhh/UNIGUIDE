import UserTable from "./_components/UserTable";
import { getAdminUsers } from "@/lib/api/admin/user";

export default async function Page() {
  const response = await getAdminUsers();
  const users = response.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">Dashboard</p>
        <h2 className="text-2xl font-bold text-[#333333]">Users</h2>
      </div>
      <UserTable users={users} />
    </div>
  );
}
