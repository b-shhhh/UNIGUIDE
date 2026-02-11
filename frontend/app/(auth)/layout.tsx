import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#e9f2ff_0%,#ffffff_50%,#edf6ff_100%)] px-4 py-10">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#4A90E2]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#4A90E2]/15 blur-3xl" />

        <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4A90E2] text-white shadow-md shadow-[#4A90E2]/35 motion-safe:animate-bounce [animation-duration:2.4s]">
            <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="currentColor" />
              <path d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52 29V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
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
