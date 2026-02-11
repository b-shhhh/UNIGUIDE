import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#e9f2ff_0%,#ffffff_50%,#edf6ff_100%)] px-4 py-10">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#4A90E2]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#F5A623]/20 blur-3xl" />

        <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3">
          <Image src="/images/globe.svg" alt="UniGuide" width={40} height={40} />
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A90E2]">UniGuide</p>
            <h1 className="text-lg font-bold text-[#333333]">AI University Finder</h1>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">{children}</div>
      </div>
    </AuthProvider>
  );
}
