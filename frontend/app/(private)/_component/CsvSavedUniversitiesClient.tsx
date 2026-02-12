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
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)]">
        <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">My List</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Saved Universities</h2>
          <p className="mt-2 text-sm text-sky-100">{savedUniversities.length} saved</p>
        </div>
      </section>

      {!savedUniversities.length ? (
        <section className="rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-slate-600">No saved universities yet.</p>
          <Link href="/homepage" className="mt-3 inline-block rounded-lg bg-sky-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800">
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
                : uni.dbId || uni.id;
            return (
              <article key={uni.id} className="rounded-xl border border-sky-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(2,132,199,0.12)]">
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
                <p className="mt-1 text-xs text-slate-600">{uni.course}</p>
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
                    onClick={async () => {
                      const result = await toggleUniversitySaved(savedKey);
                      setSavedIds(result.ids);
                    }}
                    className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-rose-700 transition hover:bg-rose-200"
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
