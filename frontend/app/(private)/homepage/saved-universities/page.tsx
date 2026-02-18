"use client";

import { useEffect, useState } from "react";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT } from "@/lib/saved-universities";
import { getUniversitiesByIds } from "@/lib/api/universities";
import UniversityCard from "../../_component/UniversityCard";

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

export default function SavedUniversitiesPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<University[]>([]);
  const flagFor = (alpha2?: string) => (alpha2 ? `https://flagcdn.com/${alpha2.toLowerCase()}.svg` : undefined);
  const clean = (value?: string) => (value && value.trim() ? value.trim() : undefined);

  const load = async () => {
    setLoading(true);
    const ids = await fetchSavedUniversityIds();
    if (!ids.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    const res = await getUniversitiesByIds(ids);
    setItems(
      Array.isArray(res.data)
        ? (res.data as University[]).map((u) => ({
            ...u,
            flag_url: clean(u.flag_url) || flagFor(u.alpha2),
            logo_url: clean(u.logo_url),
          }))
        : []
    );
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const handler = () => {
      void load();
    };
    window.addEventListener("storage", handler);
    window.addEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, handler);
    };
  }, []);

  if (loading) {
    return <p className="p-6 text-sm text-slate-600">Loading your saved universities…</p>;
  }

  if (!items.length) {
    return <p className="p-6 text-sm text-slate-600">You have not saved any universities yet.</p>;
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-800 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Saved</p>
        <h1 className="mt-2 text-2xl font-black">Saved Universities</h1>
        <p className="mt-1 text-sm text-sky-50">Review and manage universities you bookmarked.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((uni) => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>
    </div>
  );
}
