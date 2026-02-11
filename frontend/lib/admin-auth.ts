"use server";

import { redirect } from "next/navigation";
import { fetchWhoAmI } from "./api/auth";
import { cookies } from "next/headers";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  try {
    const whoAmI = await fetchWhoAmI();
    const data = (whoAmI.data ?? null) as Record<string, unknown> | null;
    const role = typeof data?.role === "string" ? data.role : "";
    if (role !== "admin") {
      redirect("/homepage");
    }
  } catch {
    redirect("/admin/login");
  }
}
