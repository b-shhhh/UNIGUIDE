"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_35%,#f8fbff_100%)]">
      <Header />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <Sidebar />
        <section className="min-w-0">{children}</section>
      </main>
    </div>
  );
}
