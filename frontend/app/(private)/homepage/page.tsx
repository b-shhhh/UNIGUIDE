"use client";

import { useEffect, useMemo, useState } from "react";
import CountryCard from "../_component/CountryCard";
import CourseCard from "../_component/CourseCard";
import UniversityCard from "../_component/UniversityCard";
import { listCountries, listCourses, listAllUniversities } from "@/lib/api/universities";

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
};

export default function Homepage() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [countriesRes, coursesRes, uniRes] = await Promise.all([listCountries(), listCourses(), listAllUniversities()]);
      setCountries((countriesRes.data as string[]) || []);
      setCourses((coursesRes.data as string[]) || []);
      setUniversities((uniRes.data as University[]) || []);
      setLoading(false);
    };
    void load();
  }, []);

  const filteredCountries = useMemo(
    () => countries.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const filteredCourses = useMemo(
    () => courses.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [courses, search]
  );

  const filteredUniversities = useMemo(
    () =>
      universities.filter((u) => {
        const haystack = `${u.name} ${u.country} ${u.state || ""} ${u.city || ""} ${(u.courses || []).join(" ")}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [universities, search]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-500 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-100">Discover</p>
        <h1 className="mt-2 text-3xl font-black">Find universities by country, course, or chat with AI</h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries, universities, courses..."
            className="h-11 w-full rounded-lg border border-white/30 bg-white/20 px-4 text-sm backdrop-blur placeholder:text-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <a
            href="/homepage/chat"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Open AI Chatbot
          </a>
        </div>
      </section>

      {loading ? (
        <p className="p-4 text-sm text-slate-600">Loading data…</p>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Countries</p>
                <h2 className="text-xl font-bold text-slate-900">Browse by country</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCountries.map((country) => (
                <CountryCard key={country} name={country} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Courses</p>
                <h2 className="text-xl font-bold text-slate-900">Browse by course</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course} name={course} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Universities</p>
                <h2 className="text-xl font-bold text-slate-900">Featured universities</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
