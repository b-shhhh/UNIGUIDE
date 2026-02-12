"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CsvUniversity } from "@/lib/csv-universities";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  universities: CsvUniversity[];
};

export default function CsvSavedUniversitiesClient({ universities }: Props) {
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

  const savedUniversities = useMemo(
    () => universities.filter((item) => savedIds.includes(item.id) || (item.dbId ? savedIds.includes(item.dbId) : false)),
    [universities, savedIds],
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">My List</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">Saved Universities</h2>
        <p className="mt-1 text-sm text-[#5f7590]">{savedUniversities.length} saved</p>
      </section>

      {!savedUniversities.length ? (
        <section className="rounded-2xl border border-[#d8e5f8] bg-white p-8 text-center">
          <p className="text-sm text-[#5f7590]">No saved universities yet.</p>
          <Link href="/homepage" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2]">
            Go to dashboard
          </Link>
        </section>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {savedUniversities.map((uni) => {
            const savedKey = savedIds.includes(uni.id)
              ? uni.id
              : uni.dbId && savedIds.includes(uni.dbId)
                ? uni.dbId
                : (uni.dbId || uni.id);
            return (
            <article key={uni.id} className="rounded-xl border border-[#d8e5f8] bg-white p-4">
              {uni.logoUrl ? (
                <img
                  src={uni.logoUrl}
                  alt={`${uni.name} logo`}
                  width={32}
                  height={32}
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
              <p className="mt-1 text-xs text-[#5f7590]">{uni.course}</p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/homepage/universities/${uni.id}`}
                  prefetch={false}
                  className="rounded-lg bg-[#4A90E2] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                >
                  View Detail
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    const result = await toggleUniversitySaved(savedKey);
                    setSavedIds(result.ids);
                  }}
                  className="rounded-lg bg-[#fee2e2] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#b91c1c]"
                >
                  Remove
                </button>
              </div>
            </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
