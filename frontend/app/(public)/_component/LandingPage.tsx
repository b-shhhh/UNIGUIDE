"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const accountDeleted = searchParams.get("accountDeleted") === "1";

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#f3f7fb] px-4 py-8 text-slate-900 sm:px-6 sm:py-12"
      style={{ fontFamily: '"Manrope", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_86%_85%,rgba(2,132,199,0.16),transparent_40%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_45%,#e6f1ff_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />

      <section className="relative mx-auto grid w-full max-w-6xl gap-6 rounded-[2rem] border border-sky-100/80 bg-white/85 p-6 shadow-[0_22px_70px_rgba(3,105,161,0.17)] backdrop-blur-sm sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {accountDeleted ? (
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 lg:col-span-2">
            Account has been deleted successfully.
          </div>
        ) : null}

        <div className="flex flex-col justify-between">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-sky-800">
              Student Platform
            </p>

            <h1
              className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl"
              style={{ fontFamily: '"Sora", "Trebuchet MS", sans-serif' }}
            >
              UniGuide makes university search feel clear, not chaotic.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
Top Countries. Top 50 Universities. One Smart Choice            </p>
          </div>

          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex min-w-[160px] items-center justify-center rounded-xl bg-sky-700 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex min-w-[160px] items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-bold text-sky-900 transition hover:-translate-y-0.5 hover:bg-sky-100"
            >
              Login
            </Link>
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-sky-100 bg-white/95 px-4 py-3">
              <p className="text-2xl font-extrabold text-sky-950">1000+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Universities</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white/95 px-4 py-3">
              <p className="text-2xl font-extrabold text-sky-950">60+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Countries</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white/95 px-4 py-3">
              <p className="text-2xl font-extrabold text-sky-950">24/7</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Access</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-[1px] shadow-[0_14px_34px_rgba(3,105,161,0.28)]">
          <div className="h-full rounded-[calc(1.5rem-1px)] bg-white p-5 sm:p-6">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-700 shadow-lg shadow-sky-700/25 cap-float">
              <svg viewBox="0 0 64 64" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="#EFF6FF" />
                <path d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M52 29V43" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" className="cap-tassel" />
                <circle cx="52" cy="46" r="3" fill="#DBEAFE" className="cap-tassel" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cap-float {
          animation: float 2.8s ease-in-out infinite;
        }

        .cap-tassel {
          transform-origin: 52px 29px;
          animation: sway 1.8s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </main>
  );
}

