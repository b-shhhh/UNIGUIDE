import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { getUserData } from "@/lib/api/cookie";

type AuthProfile = { role?: string };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUserData<AuthProfile>();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin") {
    redirect("/homepage");
  }

  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#1a2b44]">
      <Header />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <Sidebar />
        <section className="min-w-0">{children}</section>
      </main>
    </div>
  );
}
