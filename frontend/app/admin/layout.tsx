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
    <div className="flex min-h-screen flex-col bg-[#f6f9ff] text-[#1a2b44]">
      <Header />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <Sidebar />
        <section className="min-w-0">{children}</section>
      </main>
      <footer className="border-t border-sky-200/70 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} UniGuide Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
