"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listUniversitiesByCountry } from "@/lib/api/universities";
import UniversityCard from "../../_component/UniversityCard";

export default function CountryPage() {
  const params = useParams<{ slug: string }>();
  const country = decodeURIComponent(params.slug || "");
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await listUniversitiesByCountry(country);
      setUniversities((res.data as any[]) || []);
      setLoading(false);
    };
    if (country) void load();
  }, [country]);

  return (
    <div className="space-y-4">
      <header className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">Country</p>
        <h1 className="mt-2 text-3xl font-black">{country}</h1>
        <p className="mt-1 text-sm text-slate-200">Universities available in this country.</p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-600">Loading universities…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {universities.map((uni) => (
            <UniversityCard key={uni.id} university={uni as any} />
          ))}
        </div>
      )}
    </div>
  );
}
