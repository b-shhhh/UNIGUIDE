import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminUsersPage() {
  await requireAdmin();
  redirect("/admin");
}
