import type { ReactNode } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_35%,#f8fbff_100%)] text-[#333333]">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
