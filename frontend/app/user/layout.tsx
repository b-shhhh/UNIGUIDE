import type { ReactNode } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f8ff] text-[#333333]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(14,165,233,0.14),transparent_32%),radial-gradient(circle_at_88%_88%,rgba(2,132,199,0.12),transparent_38%),linear-gradient(180deg,#f8fbff_0%,#f2f8ff_40%,#edf5ff_100%)]" />
      <div className="relative">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
