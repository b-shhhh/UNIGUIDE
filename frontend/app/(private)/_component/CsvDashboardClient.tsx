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
      <section className="rounded-2xl border border-[#4A90E2]/20 bg-[linear-gradient(120deg,#4A90E2_0%,#357ABD_100%)] p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e9f2ff]">Dashboard</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Search universities</h2>
        <p className="mt-2 text-sm text-white/90">Search engine, countries, courses, and university detail pages.</p>

        <div className="mt-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by university, course, or country..."
            className="h-11 w-full rounded-lg border border-white/50 bg-white px-3 text-sm text-[#1a2b44] outline-none"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="h-fit self-start rounded-2xl border border-[#d8e5f8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Countries</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">{countries.length} total</p>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {countries.slice(0, 12).map((country) => (
              <Link
                key={country.code}
                href={`/homepage/countries/${country.code}`}
                prefetch={false}
                className="flex min-w-[108px] items-center justify-between rounded-md border border-[#d8e5f8] px-1.5 py-1 hover:bg-[#f5f9ff]"
              >
                <span className="truncate text-[11px] font-semibold text-[#1a2b44]">
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
                <span className="text-[10px] font-bold text-[#5f7590]">{country.count}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="h-fit self-start rounded-2xl border border-[#d8e5f8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Courses</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">{courses.length} total</p>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {visibleCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/homepage/courses/${course.slug}`}
                prefetch={false}
                className="min-w-[220px] rounded-md border border-[#d8e5f8] px-2 py-1.5 hover:bg-[#f5f9ff]"
              >
                <p className="truncate text-[11px] font-semibold text-[#1a2b44]">{course.name}</p>
                <p className="text-[10px] text-[#5f7590]">{course.count} unis</p>
              </Link>
            ))}
          </div>
          {courses.length > INITIAL_VISIBLE_COURSES ? (
            <div className="mt-3 flex items-center gap-2">
              {visibleCourseCount < courses.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCourseCount((prev) => Math.min(prev + VISIBLE_COURSE_STEP, courses.length))}
                  className="rounded-md border border-[#d8e5f8] px-3 py-1 text-xs font-semibold text-[#1a2b44] hover:bg-[#f5f9ff]"
                >
                  Show more
                </button>
              ) : null}
              {visibleCourseCount > INITIAL_VISIBLE_COURSES ? (
                <button
                  type="button"
                  onClick={() => setVisibleCourseCount(INITIAL_VISIBLE_COURSES)}
                  className="rounded-md border border-[#d8e5f8] px-3 py-1 text-xs font-semibold text-[#1a2b44] hover:bg-[#f5f9ff]"
                >
                  Show less
                </button>
              ) : null}
            </div>
          ) : null}
        </article>
      </section>

      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1a2b44]">University Cards</h3>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">
            Showing {topRankedUniversities.length} of {filteredUniversities.length}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topRankedUniversities.map((uni) => {
            const saved = hasSavedAlias(uni);
            return (
              <article key={uni.id} className="rounded-xl border border-[#d8e5f8] bg-[#fcfeff] p-4">
                {uni.logoUrl ? (
                  <img
                    src={uni.logoUrl}
                    alt={`${uni.name} logo`}
                    width={34}
                    height={34}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="mb-2 rounded"
                  />
                ) : null}
                <p className="text-base font-bold text-[#1a2b44]">{uni.name}</p>
                <p className="mt-1 text-xs text-[#5f7590]">
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
                <p className="mt-1 text-xs text-[#5f7590]">{uni.ranking}</p>
                <p className="mt-1 text-xs text-[#0f766e]">AI score: {uni.score}%</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/homepage/universities/${uni.id}`}
                    prefetch={false}
                    className="rounded-lg bg-[#4A90E2] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]"
                  >
                    View Detail
                  </Link>
                  <button
                    type="button"
                    disabled={savingId === uni.id}
                    onClick={() => onToggleSaved(uni)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${
                      saved ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dbeafe] text-[#1d4ed8]"
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
