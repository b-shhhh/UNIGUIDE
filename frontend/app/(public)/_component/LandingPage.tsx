"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const accountDeleted = searchParams.get("accountDeleted") === "1";

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(130deg,#e0f2fe_0%,#dbeafe_40%,#bfdbfe_100%)] px-4 py-10 text-slate-900"
      style={{ fontFamily: '"Manrope", "Segoe UI", sans-serif' }}
    >

      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />

      <section className="relative w-full max-w-3xl rounded-3xl border border-blue-200/80 bg-white/90 p-8 text-center shadow-[0_20px_70px_rgba(37,99,235,0.22)] backdrop-blur-sm sm:p-12">
        {accountDeleted ? (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">
            Account has been deleted successfully.
          </div>
        ) : null}

        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-blue-600/95 shadow-lg shadow-blue-700/30 cap-float">
          <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="#EFF6FF" />
            <path d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M52 29V43" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" className="cap-tassel" />
            <circle cx="52" cy="46" r="3" fill="#DBEAFE" className="cap-tassel" />
          </svg>
        </div>

        <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-800">
          Student Platform
        </p>

        <h1
          className="mt-5 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          style={{ fontFamily: '"Sora", "Trebuchet MS", sans-serif' }}
        >
          UniGuide
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
          UniGuide helps students discover and compare universities worldwide. Explore programs, review tuition and study
          modes, and move forward with confidence in your higher education journey.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex min-w-[150px] items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-100"
          >
            Register
          </Link>
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

