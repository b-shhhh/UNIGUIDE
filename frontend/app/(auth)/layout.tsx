import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative isolate min-h-screen overflow-hidden bg-[#f2f8ff] px-4 py-8 sm:px-6 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.2),transparent_33%),radial-gradient(circle_at_88%_80%,rgba(2,132,199,0.18),transparent_38%),linear-gradient(135deg,#f9fcff_0%,#eef6ff_50%,#e8f2ff_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-sky-100/80 bg-white/85 shadow-[0_24px_70px_rgba(3,105,161,0.2)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-4 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sky-800 shadow-sm motion-safe:animate-bounce [animation-duration:2.8s]">
                  <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="currentColor" />
                    <path d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M52 29V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-100">UniGuide</p>
                  <p className="text-sm font-semibold text-white">AI University Finder</p>
                </div>
              </div>

              <h1 className="mt-8 max-w-sm text-3xl font-black leading-tight sm:text-4xl">
                Top Countries. Top 50 Universities. One Smart Choice.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-sky-100">
                Explore curated universities and courses, shortlist your favorites, and apply with confidence.
              </p>

              <div className="mt-6" />
            </div>
          </aside>

          <section className="relative p-5 sm:p-8 lg:p-10">{children}</section>
        </div>
      </div>
    </AuthProvider>
  );
}
