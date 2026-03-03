"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUniversity } from "@/lib/api/universities";
import SaveUniversityButton from "../../../_component/SaveUniversityButton";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type University = {
  id: string;
  dbId?: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  flag_url?: string;
  logo_url?: string;
  courses?: string[];
  description?: string;
  ieltsMin?: number | null;
  satRequired?: boolean | null;
  satMin?: number | null;
  web_pages?: string;
};

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id || "");
  const [uni, setUni] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getUniversity(id);
      const data = (res.data as University) || null;
      setUni(data && String(data.name || "").trim() ? data : null);
      setLoading(false);
    };
    if (id) void load();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-600">
        Loading university...
      </div>
    );

  if (!uni)
    return (
      <div className="p-10 text-center text-rose-500">
        University not found.
      </div>
    );

  const location = [uni.city, uni.state].filter(Boolean).join(", ");

  const website =
    uni.web_pages && uni.web_pages.trim()
      ? uni.web_pages.startsWith("http")
        ? uni.web_pages
        : `https://${uni.web_pages}`
      : null;

  const websiteHost = website
    ? new URL(website).hostname.replace(/^www\./, "")
    : null;

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div className="flex items-center gap-3">
                <Link
                  href="/homepage"
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25 transition"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {uni.logo_url ? (
                  <img
                    src={uni.logo_url}
                    alt={`${uni.name} logo`}
                    className="h-16 w-16 rounded-2xl bg-white p-2 object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-xl font-bold text-sky-700">
                    {uni.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    University
                  </p>
                  <h1 className="text-3xl font-black leading-tight">
                    {uni.name}
                  </h1>

                  <p className="mt-1 text-sm opacity-90 flex items-center gap-2 flex-wrap">
                    {location && <span>{location},</span>}
                    <Link
                      href={`/homepage/countries/${encodeURIComponent(
                        uni.country
                      )}`}
                      className="underline hover:opacity-80"
                    >
                      {uni.country}
                    </Link>

                    {uni.flag_url && (
                      <img
                        src={uni.flag_url}
                        alt="flag"
                        className="h-4 w-6 rounded object-cover"
                      />
                    )}
                  </p>
                </div>
              </div>

              <SaveUniversityButton
                universityId={uni.id}
                universityDbId={uni.dbId}
              />
            </div>
          </div>

          {/* BODY */}
          <div className="p-8 space-y-10">

            {/* AVAILABLE COURSES */}
            {uni.courses && uni.courses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Available Courses
                </h2>

                <div className="flex flex-wrap gap-3">
                  {uni.courses.map((course) => (
                    <Link
                      key={course}
                      href={`/homepage/courses/${encodeURIComponent(course)}`}
className="px-5 py-2 text-sm font-semibold rounded-full bg-slate-200 text-black hover:bg-slate-300 transition shadow-sm"                    >
                      {course}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* REQUIREMENTS */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Admission Requirements
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <StatCard label="IELTS Minimum" value={uni.ieltsMin ?? "—"} />
                <StatCard
                  label="SAT Required"
                  value={
                    uni.satRequired === null ||
                    uni.satRequired === undefined
                      ? "—"
                      : uni.satRequired
                      ? "Yes"
                      : "No"
                  }
                />
                <StatCard label="SAT Minimum" value={uni.satMin ?? "—"} />
              </div>
            </div>

            {/* DESCRIPTION */}
            {uni.description && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  About University
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {uni.description}
                </p>
              </div>
            )}

            {/* WEBSITE */}
            {website && (
              <div className="text-center pt-4">
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-700 transition"
                >
                  <span className="text-white">Visit Official Website</span>
                  <span aria-hidden className="text-white">↗</span>
                </a>
                <p className="mt-2 text-xs text-white/80">
                  {websiteHost}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat Card Component ---------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-6 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

