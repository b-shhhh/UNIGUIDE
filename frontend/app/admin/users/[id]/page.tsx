import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export default async function Page(_props: Params) {
  await requireAdmin();
  redirect("/admin");
}
