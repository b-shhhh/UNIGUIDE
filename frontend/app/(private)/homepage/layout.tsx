import type { ReactNode } from "react";
import Header from "../_component/Header";
import Footer from "../_component/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#f4efe4] text-[#1a2b44]"
      style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
    >
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
