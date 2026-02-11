import { requireAdmin } from "@/lib/admin-auth";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <AdminDashboardClient />
  );
}
