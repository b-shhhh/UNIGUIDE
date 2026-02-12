"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import type { CountrySummary, CourseSummary, CsvUniversity } from "@/lib/csv-universities";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  universities: CsvUniversity[];
  countries: CountrySummary[];
  courses: CourseSummary[];
};

const DashboardChatbot = dynamic(() => import("./DashboardChatbot"), { ssr: false });
const INITIAL_VISIBLE_COURSES = 24;
const VISIBLE_COURSE_STEP = 24;

export default function CsvDashboardClient({ universities, countries, courses }: Props) {
  const [query, setQuery] = useState("");
  const [visibleCourseCount, setVisibleCourseCount] = useState(INITIAL_VISIBLE_COURSES);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const hasSavedAlias = (uni: CsvUniversity) =>
    savedIds.includes(uni.id) || (uni.dbId ? savedIds.includes(uni.dbId) : false);

  const preferredApiIdFor = (uni: CsvUniversity) => uni.dbId || uni.id;

  const savedKeyFor = (uni: CsvUniversity) =>
    savedIds.includes(uni.id) ? uni.id : uni.dbId && savedIds.includes(uni.dbId) ? uni.dbId : preferredApiIdFor(uni);

  useEffect(() => {
    let active = true;
    const syncSaved = async () => {
      const ids = await fetchSavedUniversityIds();
      if (active) {
        setSavedIds(ids);
      }
    };

    void syncSaved();
    window.addEventListener("storage", syncSaved);
    window.addEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, syncSaved);
    return () => {
      active = false;
      window.removeEventListener("storage", syncSaved);
      window.removeEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, syncSaved);
    };
  }, []);

  useEffect(() => {
    setVisibleCourseCount(INITIAL_VISIBLE_COURSES);
  }, [courses.length]);

  const filteredUniversities = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return universities;
    }
    return universities.filter((uni) => `${uni.name} ${uni.countryName} ${uni.course}`.toLowerCase().includes(needle));
  }, [query, universities]);

  const topRankedUniversities = useMemo(() => {
    const readRank = (ranking: string) => {
      const match = ranking.match(/\d+/);
      return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
    };

    return [...filteredUniversities]
      .sort((a, b) => readRank(a.ranking) - readRank(b.ranking))
      .slice(0, 3);
  }, [filteredUniversities]);

  const visibleCourses = useMemo(() => courses.slice(0, visibleCourseCount), [courses, visibleCourseCount]);

  const onToggleSaved = async (uni: CsvUniversity) => {
    const key = savedKeyFor(uni);
    const aliases = [uni.id, uni.dbId].filter(Boolean) as string[];

    setSavingId(uni.id);
    setSavedIds((prev) => {
      const unique = Array.from(new Set(prev));
      const currentlySaved = aliases.some((id) => unique.includes(id));
      if (currentlySaved) {
        return unique.filter((id) => !aliases.includes(id));
      }
      return Array.from(new Set([...unique, key]));
    });

    try {
      const result = await toggleUniversitySaved(key);
      setSavedIds(result.ids);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/60 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_16px_40px_rgba(3,105,161,0.26)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Dashboard</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Search universities with clarity.</h2>
          <p className="mt-3 max-w-2xl text-sm text-sky-100 sm:text-base">
            Find universities by country, course, and ranking. Save options instantly while you build your shortlist.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by university, course, or country..."
              className="h-12 w-full rounded-xl border border-white/35 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200"
            />
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
              <p className="text-lg font-black">{universities.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-100">Universities</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
              <p className="text-lg font-black">{countries.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-100">Countries</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
              <p className="text-lg font-black">{courses.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-100">Courses</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="h-fit rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">Countries</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{countries.length} total</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {countries.slice(0, 12).map((country) => (
              <Link
                key={country.code}
                href={`/homepage/countries/${country.code}`}
                prefetch={false}
                className="flex min-w-[120px] items-center justify-between rounded-lg border border-sky-100 bg-sky-50/30 px-2 py-1.5 transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <span className="truncate text-xs font-semibold text-slate-700">
                  {country.flagImageUrl ? (
                    <img
                      src={country.flagImageUrl}
                      alt={`${country.name} flag`}
                      width={12}
                      height={9}
                      className="mr-1 inline rounded-[2px] align-[-2px]"
                    />
                  ) : null}
                  {country.name}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{country.count}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="h-fit rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">Courses</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{courses.length} total</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {visibleCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/homepage/courses/${course.slug}`}
                prefetch={false}
                className="min-w-[220px] rounded-lg border border-sky-100 bg-sky-50/30 px-2.5 py-2 transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <p className="truncate text-xs font-semibold text-slate-700">{course.name}</p>
                <p className="text-[11px] text-slate-500">{course.count} unis</p>
              </Link>
            ))}
          </div>
          {courses.length > INITIAL_VISIBLE_COURSES ? (
            <div className="mt-3 flex items-center gap-2">
              {visibleCourseCount < courses.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCourseCount((prev) => Math.min(prev + VISIBLE_COURSE_STEP, courses.length))}
                  className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-sky-50"
                >
                  Show more
                </button>
              ) : null}
              {visibleCourseCount > INITIAL_VISIBLE_COURSES ? (
                <button
                  type="button"
                  onClick={() => setVisibleCourseCount(INITIAL_VISIBLE_COURSES)}
                  className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-sky-50"
                >
                  Show less
                </button>
              ) : null}
            </div>
          ) : null}
        </article>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-900">Top Ranked Universities</h3>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            Showing {topRankedUniversities.length} of {filteredUniversities.length}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topRankedUniversities.map((uni) => {
            const saved = hasSavedAlias(uni);
            return (
              <article key={uni.id} className="rounded-xl border border-sky-100 bg-sky-50/20 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(2,132,199,0.12)]">
                {uni.logoUrl ? (
                  <img
                    src={uni.logoUrl}
                    alt={`${uni.name} logo`}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="mb-2 rounded"
                  />
                ) : null}
                <p className="text-base font-extrabold tracking-tight text-slate-900">{uni.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {uni.countryFlagUrl ? (
                    <img
                      src={uni.countryFlagUrl}
                      alt={`${uni.countryName} flag`}
                      width={16}
                      height={12}
                      className="mr-1 inline rounded-[2px] align-[-2px]"
                    />
                  ) : null}
                  {uni.countryName}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-600">{uni.ranking}</p>
                <p className="mt-1 text-xs font-semibold text-cyan-700">AI score: {uni.score}%</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/homepage/universities/${uni.id}`}
                    prefetch={false}
                    className="rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800"
                  >
                    View Detail
                  </Link>
                  <button
                    type="button"
                    disabled={savingId === uni.id}
                    onClick={() => onToggleSaved(uni)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition disabled:opacity-50 ${
                      saved ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                    }`}
                  >
                    {saved ? "Unsave" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <DashboardChatbot />
    </div>
  );
}
