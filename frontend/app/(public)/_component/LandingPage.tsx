"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b7a98] via-[#0a6383] to-[#0a4b6a] text-white px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/15 w-fit">
          <GraduationCapIcon />
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/80">UNIGUIDE</p>
            <p className="text-sm font-semibold">AI University Finder</p>
          </div>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Top Countries. Top 50 Universities. One Smart Choice.
          </h1>
          <p className="text-base sm:text-lg text-white/85">
            Explore curated universities and courses, shortlist your favorites, and apply with confidence.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
          <Stat label="Universities" value="500+" />
          <Stat label="Countries" value="10+" />
          <Stat label="Access" value="24/7" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-base font-semibold text-white hover:bg-white/15 transition text-center"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-base font-semibold text-white hover:bg-white/15 transition text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-md">
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}

// Simple SVG icon (graduation cap) to replace emoji
function GraduationCapIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="#E2F3FF" />
      <path
        d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31"
        stroke="#E2F3FF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M52 29V43" stroke="#E2F3FF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="46" r="3" fill="#B5D9FF" />
    </svg>
  );
}
