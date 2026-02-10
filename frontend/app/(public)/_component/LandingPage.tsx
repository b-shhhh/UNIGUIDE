"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Find Your Perfect University with{" "}
          <span className="text-indigo-600">AI</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          UniGuide helps students discover universities, courses, and career
          paths tailored to their goals using AI-powered recommendations.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >
            Get Started
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Feature
            title="AI Recommendations"
            description="Personalized university and course suggestions based on your profile."
          />
          <Feature
            title="Global Universities"
            description="Explore institutions across multiple countries in one platform."
          />
          <Feature
            title="Career Focused"
            description="Make smarter choices aligned with real-world career outcomes."
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
    <div className="rounded-2xl bg-white p-8 shadow-md">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}
