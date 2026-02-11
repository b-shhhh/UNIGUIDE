"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#f8f6ef] text-[#132238]"
      style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#1aa39a]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-0 h-96 w-96 rounded-full bg-[#ff9e44]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#3b82f6]/15 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-[#132238]/15 bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1f6f9b]">
            AI-Powered University Search
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
            Discover the university
            <span className="block text-[#0e8c83]">that matches your future.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#31445c] sm:text-lg">
            UniGuide helps students compare universities, explore programs, and
            choose career-focused paths with data-backed recommendations.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-[#132238] px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0c1828]"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-[#132238]/20 bg-white/80 px-7 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-[#132238] transition hover:bg-white"
            >
              Login
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-center">
            <Stat value="500+" label="Universities" />
            <Stat value="5K+" label="Students Guided" />
            <Stat value="30+" label="Countries" />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          <Feature
            title="Smart Matching"
            description="Get university suggestions based on profile, goals, and interests."
          />
          <Feature
            title="Clear Comparisons"
            description="Compare fees, programs, and outcomes in one view."
          />
          <Feature
            title="Career Clarity"
            description="Pick a path linked to real opportunities and skills."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#132238]/10 bg-white/85 p-6 shadow-[0_10px_35px_rgba(19,34,56,0.08)] backdrop-blur">
      <h3 className="text-lg font-bold text-[#132238]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#31445c]">{description}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[#132238]/10 bg-white/65 px-3 py-4">
      <p className="text-xl font-bold text-[#132238]">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3f5570]">
        {label}
      </p>
    </div>
  );
}
