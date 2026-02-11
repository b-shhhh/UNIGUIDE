import type { ReactNode } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
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

