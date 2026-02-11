"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DeadlineItem, HomepageStat, UniversityRecommendation } from "@/lib/api/recommendation";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  stats: HomepageStat[];
  universities: UniversityRecommendation[];
  deadlines: DeadlineItem[];
};

const countryFlags: Record<string, string> = {
  australia: "AU",
  germany: "DE",
  canada: "CA",
  uk: "UK",
  "united kingdom": "UK",
  usa: "US",
  "united states": "US",
  ireland: "IE",
  france: "FR",
  netherlands: "NL",
  sweden: "SE",
  japan: "JP",
  singapore: "SG",
  italy: "IT",
};

const parseScore = (value: string) => {
  const parsed = Number(value.replace("%", "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const getFlag = (country: string) => countryFlags[country.toLowerCase()] || "GL";

export default function HomeDashboardClient({ stats, universities, deadlines }: Props) {
  const [query, setQuery] = useState("");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityRecommendation | null>(universities[0] ?? null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

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

  const countries = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of universities) {
      map.set(item.country, (map.get(item.country) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count, flag: getFlag(name) }))
      .sort((a, b) => b.count - a.count);
  }, [universities]);

  const courses = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of universities) {
      map.set(item.program, (map.get(item.program) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((item) => {
      const byCountry = activeCountry ? item.country === activeCountry : true;
      const byCourse = activeCourse ? item.program === activeCourse : true;
      const haystack = `${item.name} ${item.program} ${item.country} ${item.city}`.toLowerCase();
      const bySearch = query.trim() ? haystack.includes(query.toLowerCase()) : true;
      return byCountry && byCourse && bySearch;
    });
  }, [universities, activeCountry, activeCourse, query]);

  const courseCountries = useMemo(() => {
    if (!activeCourse) {
      return [];
    }
    return Array.from(new Set(universities.filter((item) => item.program === activeCourse).map((item) => item.country)));
  }, [universities, activeCourse]);

  const runAiFinder = () => {
    if (!filteredUniversities.length) {
      return;
    }
    const best = [...filteredUniversities].sort((a, b) => parseScore(b.score) - parseScore(a.score))[0];
    setSelectedUniversity(best);
  };

  const onToggleSaved = async (id: string) => {
    const result = await toggleUniversitySaved(id);
    setSavedIds(result.ids);
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#4A90E2]/20 bg-[linear-gradient(120deg,#4A90E2_0%,#357ABD_100%)] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-16 h-44 w-44 rounded-full bg-[#F5A623]/25 blur-2xl" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e9f2ff]">Welcome back</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">Your admissions dashboard is ready.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/homepage/saved-universities"
              className="rounded-[8px] border border-white/50 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-white/20"
            >
              Saved Universities ({savedIds.length})
            </Link>
            <button
              type="button"
              onClick={runAiFinder}
              className="rounded-[8px] bg-[#F5A623] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#333333] transition hover:bg-[#f9b648]"
            >
              AI Recommendation Finder
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-[8px] border border-[#d8e5f8] bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#666666]">{item.label}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#333333]">{item.value}</p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.tone}`}>Live</span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-[#333333]">Search Engine</h3>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by country, course, city, university..."
            className="w-full rounded-[8px] border border-[#c7d9f5] bg-white px-4 py-2.5 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/30 sm:max-w-md"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Countries</h3>
            <button type="button" onClick={() => setActiveCountry(null)} className="text-xs font-bold uppercase tracking-[0.08em] text-[#0f766e]">
              Clear
            </button>
          </div>
          <div className="grid gap-2">
            {countries.map((country) => (
              <button
                type="button"
                key={country.name}
                onClick={() => setActiveCountry(country.name)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left ${
                  activeCountry === country.name ? "border-[#0f766e] bg-[#eefcf7]" : "border-[#1a2b44]/10 bg-[#fcfeff]"
                }`}
              >
                <span className="text-sm font-semibold text-[#1a2b44]">
                  {country.flag} {country.name}
                </span>
                <span className="text-xs font-bold text-[#4f6682]">{country.count}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Courses</h3>
            <button type="button" onClick={() => setActiveCourse(null)} className="text-xs font-bold uppercase tracking-[0.08em] text-[#0f766e]">
              Clear
            </button>
          </div>
          <div className="grid gap-2">
            {courses.map((course) => (
              <button
                type="button"
                key={course.name}
                onClick={() => setActiveCourse(course.name)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left ${
                  activeCourse === course.name ? "border-[#1d4ed8] bg-[#f3f8ff]" : "border-[#1a2b44]/10 bg-[#fcfeff]"
                }`}
              >
                <span className="text-sm font-semibold text-[#1a2b44]">{course.name}</span>
                <span className="text-xs font-bold text-[#4f6682]">{course.count}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
          <h3 className="text-lg font-bold text-[#1a2b44]">Course Availability</h3>
          {activeCourse ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {courseCountries.map((country) => (
                <span key={country} className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                  {getFlag(country)} {country}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#4f6682]">Click a course to see countries available in it.</p>
          )}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Universities</h3>
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#4f6682]">{filteredUniversities.length} results</p>
              <Link href="/homepage/saved-universities" className="text-xs font-bold uppercase tracking-[0.08em] text-[#0f766e]">
                View saved
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredUniversities.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedUniversity(item)}
                className={`rounded-xl border p-4 text-left ${
                  selectedUniversity?.id === item.id ? "border-[#0f766e] bg-[#eefcf7]" : "border-[#1a2b44]/10 bg-[#fcfeff]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#1a2b44]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#4f6682]">{item.program}</p>
                  </div>
                  <span className="rounded-full bg-[#d7f0ec] px-2.5 py-1 text-[11px] font-bold text-[#0f766e]">{item.score} fit</span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f7590]">
                  {getFlag(item.country)} {item.country}
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleSaved(item.id);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                      savedIds.includes(item.id) ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dbeafe] text-[#1d4ed8]"
                    }`}
                  >
                    {savedIds.includes(item.id) ? "Unsave" : "Save"}
                  </button>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
          <h3 className="text-lg font-bold text-[#1a2b44]">University Detail</h3>
          {selectedUniversity ? (
            <div className="mt-3 space-y-2 text-sm text-[#1a2b44]">
              <p className="font-bold">{selectedUniversity.name}</p>
              <p className="text-[#4f6682]">{selectedUniversity.description}</p>
              <p>
                <span className="font-semibold">Country:</span> {getFlag(selectedUniversity.country)} {selectedUniversity.country}
              </p>
              <p>
                <span className="font-semibold">Course:</span> {selectedUniversity.program}
              </p>
              <p>
                <span className="font-semibold">City:</span> {selectedUniversity.city}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {selectedUniversity.duration}
              </p>
              <p>
                <span className="font-semibold">Tuition:</span> {selectedUniversity.tuition}
              </p>
              <p>
                <span className="font-semibold">Ranking:</span> {selectedUniversity.ranking}
              </p>
              <p>
                <span className="font-semibold">Intake:</span> {selectedUniversity.intake}
              </p>
              <button
                type="button"
                onClick={() => onToggleSaved(selectedUniversity.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${
                  savedIds.includes(selectedUniversity.id) ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dbeafe] text-[#1d4ed8]"
                }`}
              >
                {savedIds.includes(selectedUniversity.id) ? "Remove from saved" : "Save university"}
              </button>
              {selectedUniversity.website ? (
                <a
                  href={selectedUniversity.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-bold uppercase tracking-[0.08em] text-[#0f766e] underline"
                >
                  Visit University Website
                </a>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#4f6682]">Click a university card to view full details.</p>
          )}
        </article>
      </section>

      <section className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
        <h3 className="text-lg font-bold text-[#1a2b44]">Upcoming Deadlines</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deadlines.map((item) => (
            <li key={`${item.title}-${item.date}`} className={`rounded-xl p-3 ${item.tone}`}>
              <p className="font-semibold text-[#1a2b44]">{item.title}</p>
              <p className="text-[#4f6682]">{item.date}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
