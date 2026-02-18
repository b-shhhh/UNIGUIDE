"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "../_component/Header";
import Footer from "../_component/Footer";
import UniversityCard from "../_component/UniversityCard";
import CountryCard from "../_component/CountryCard";
import CourseCard from "../_component/CourseCard";
import DashboardChatbot from "../_component/DashboardChatbot";
import { listCountries, listCourses, listAllUniversities } from "@/lib/api/universities";

type University = {
  id: string;
  dbId?: string;
  alpha2?: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  flag_url?: string;
  logo_url?: string;
  web_pages?: string;
  courses?: string[];
  description?: string;
};

type CountItem = { name: string; count: number; flag_url?: string };
const cleanUrl = (value?: string) => (value && value.trim() ? value.trim() : undefined);
const flagFor = (alpha2?: string) => (alpha2 ? `https://flagcdn.com/${alpha2.toLowerCase()}.svg` : undefined);

export default function Homepage() {
  const search = "";
  const [countries, setCountries] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const load = async () => {
      try {
        const [countriesRes, coursesRes, uniRes] = await Promise.all([
          listCountries(),
          listCourses(),
          listAllUniversities(),
        ]);

        // Basic visibility into API responses while debugging empty UI
        console.log("countriesRes", countriesRes);
        console.log("coursesRes", coursesRes);
        console.log("uniRes", uniRes);

        setCountries((countriesRes.data as string[]) || []);
        setCourses((coursesRes.data as string[]) || []);

        const uniRows = ((uniRes.data as University[]) || []).filter((u) => String(u.name || "").trim());
        setUniversities(
          uniRows.map((u) => ({
            ...u,
            flag_url: cleanUrl(u.flag_url) || flagFor(u.alpha2),
            logo_url: cleanUrl(u.logo_url),
          }))
        );
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredUniversities = useMemo(
    () =>
      universities.filter((u) => {
        const haystack = `${u.name} ${u.country} ${u.state || ""} ${u.city || ""} ${(u.courses || []).join(" ")}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [universities, search]
  );

  const countryCounts: CountItem[] = useMemo(() => {
    const map = new Map<string, CountItem>();
    for (const uni of universities) {
      const countryName = String(uni.country || "").trim();
      if (!countryName) continue;
      const current = map.get(countryName) || { name: countryName, count: 0, flag_url: uni.flag_url };
      map.set(countryName, {
        ...current,
        count: current.count + 1,
        flag_url: current.flag_url || uni.flag_url,
      });
    }
    return Array.from(map.values())
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [universities, search]);

  const courseCounts: CountItem[] = useMemo(() => {
    const map = new Map<string, number>();
    for (const uni of universities) {
      (uni.courses || []).forEach((course) => {
        const courseName = String(course || "").trim();
        if (!courseName) return;
        map.set(courseName, (map.get(courseName) || 0) + 1);
      });
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [universities, search]);

  const stats = [
    { label: "Universities", value: universities.length },
    { label: "Countries", value: new Set(countries).size },
    { label: "Courses", value: new Set(courses).size },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f9ad8] via-[#0c7fb9] to-[#0a5c8f] p-6 text-white shadow-xl sm:p-8">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">Search universities with clarity.</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">
           Top Countries. Top 50 Universities. One Smart Choice
          </p>

          <div className="mt-5" />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 px-4 py-3 text-center text-white shadow-inner backdrop-blur ring-1 ring-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        {loading ? (
          <p className="p-4 text-sm text-slate-600">Loading data…</p>
        ) : (
          <>
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Countries</p>
                  <h2 className="text-lg font-bold text-slate-900">{countryCounts.length} total</h2>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {countryCounts.map((item) => (
                  <div key={item.name} className="min-w-[240px] shrink-0">
                    <CountryCard
                      name={item.name}
                      flagUrl={item.flag_url}
                      count={item.count}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Courses</p>
                  <h2 className="text-lg font-bold text-slate-900">{courseCounts.length} total</h2>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {courseCounts.map((item) => (
                  <div key={item.name} className="min-w-[240px] shrink-0">
                    <CourseCard
                      name={item.name}
                      uniCount={item.count}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Top Ranked Universities</p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Showing {Math.min(6, filteredUniversities.length)} of {filteredUniversities.length}
                  </h2>
                </div>
              </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.slice(0, 6).map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <DashboardChatbot />
          </section>
        </>
      )}
      </main>
      <Footer />
    </div>
  );
}
