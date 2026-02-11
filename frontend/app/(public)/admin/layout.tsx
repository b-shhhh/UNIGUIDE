import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

type CookieUserData = {
  user?: {
    role?: string;
  };
  role?: string;
};

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const userDataRaw = cookieStore.get("user_data")?.value;

  if (!authToken) {
    redirect("/login");
  }

  let role = "";
  if (userDataRaw) {
    try {
      const parsed = JSON.parse(userDataRaw) as CookieUserData;
      role = parsed.user?.role || parsed.role || "";
    } catch {
      role = "";
    }
  }

  if (role !== "admin") {
    redirect("/homepage");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <Sidebar />
        <section className="min-w-0 flex-1">{children}</section>
      </main>
    </div>
  );
}
