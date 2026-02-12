import ProfilePageClient from "../_components/ProfilePageClient";
import { fetchWhoAmI } from "@/lib/api/auth";
import { getUserData } from "@/lib/api/cookie";

export default async function Page() {
  const userFromCookie = await getUserData<Record<string, unknown>>();
  let user = userFromCookie ?? null;

  if (!user) {
    try {
      const result = await fetchWhoAmI();
      user = (result.data as Record<string, unknown>) ?? null;
    } catch {
      user = null;
    }
  }

  return <ProfilePageClient user={user} />;
}
