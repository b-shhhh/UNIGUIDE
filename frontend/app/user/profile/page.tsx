import ProfilePageClient from "../_components/ProfilePageClient";
import { fetchWhoAmI } from "@/lib/api/auth";

export default async function Page() {
  let user: Record<string, unknown> | null = null;

  try {
    const result = await fetchWhoAmI();
    user = (result.data as Record<string, unknown>) ?? null;
  } catch {
    user = null;
  }

  return <ProfilePageClient user={user} />;
}

