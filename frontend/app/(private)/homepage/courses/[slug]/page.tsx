"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { listAllUniversities, listCountriesByCourse } from "@/lib/api/universities";
import CountryCard from "../../../_component/CountryCard";
import UniversityCard from "../../../_component/UniversityCard";

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
  courses?: string[];
  description?: string;
};

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const course = decodeURIComponent(params.slug || "");
  const [countries, setCountries] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const flagFor = (alpha2?: string) => (alpha2 ? `https://flagcdn.com/${alpha2.toLowerCase()}.svg` : undefined);

  useEffect(() => {
    const load = async () => {
      const [countryRes, uniRes] = await Promise.all([listCountriesByCourse(course), listAllUniversities()]);
      setCountries((countryRes.data as string[]) || []);
      const rows = ((uniRes.data as University[]) || []).filter((u) => String(u.name || "").trim());
      setUniversities(rows);
      setLoading(false);
    };
    if (course) void load();
  }, [course]);

  const filteredUnis = useMemo(
    () => universities.filter((u) => Array.isArray(u.courses) && u.courses.some((c) => c.toLowerCase() === course.toLowerCase())),
    [universities, course]
  );

  return (
    <div className="space-y-4">
      <header className="rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Course</p>
        <h1 className="mt-2 text-3xl font-black">{course}</h1>
        <p className="mt-1 text-sm text-white/80">Countries and universities offering this course.</p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-600">Loading course data…</p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Available in these countries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((c) => {
                const match = universities.find((u) => u.country === c);
                const flag = match?.flag_url || flagFor(match?.alpha2);
                return <CountryCard key={c} name={c} flagUrl={flag} />;
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Universities offering {course}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUnis.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
