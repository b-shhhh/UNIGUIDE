import type { ReactNode } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
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
