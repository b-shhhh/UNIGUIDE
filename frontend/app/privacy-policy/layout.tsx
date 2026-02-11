import type { ReactNode } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_35%,#f8fbff_100%)]">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}
