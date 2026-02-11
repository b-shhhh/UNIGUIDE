import type { ReactNode } from "react";
import AdminNav from "./_components/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_35%,#f8fbff_100%)]">
      <header className="border-b border-[#d8e5f8] bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Admin Panel</p>
            <h1 className="text-xl font-bold text-[#1a2b44]">UniGuide Admin</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <AdminNav />
        <section className="min-w-0">{children}</section>
      </main>
    </div>
  );
}
