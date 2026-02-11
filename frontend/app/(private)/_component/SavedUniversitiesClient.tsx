"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { UniversityRecommendation } from "@/lib/api/recommendation";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  universities: UniversityRecommendation[];
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

const getFlag = (country: string) => countryFlags[country.toLowerCase()] || "GL";

export default function SavedUniversitiesClient({ universities }: Props) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    () => universities.filter((item) => savedIds.includes(item.id)),
    [universities, savedIds],
  );

  const selectedUniversity = useMemo(() => {
    if (!savedUniversities.length) {
      return null;
    }
    if (!selectedId) {
      return savedUniversities[0];
    }
    return savedUniversities.find((item) => item.id === selectedId) ?? savedUniversities[0];
  }, [savedUniversities, selectedId]);

  const onRemove = async (id: string) => {
    const result = await toggleUniversitySaved(id);
    setSavedIds(result.ids);
    if (selectedId === id) {
      setSelectedId(result.ids[0] ?? null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">My List</p>
            <h2 className="mt-1 text-2xl font-bold text-[#333333]">Saved Universities</h2>
          </div>
          <Link href="/homepage" className="rounded-[8px] bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]">
            Back to Dashboard
          </Link>
        </div>
      </section>

      {!savedUniversities.length ? (
        <section className="rounded-[8px] border border-[#d8e5f8] bg-white p-8 text-center shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
          <p className="text-sm text-[#666666]">No saved universities yet. Save universities from the dashboard cards.</p>
          <Link href="/homepage" className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2] hover:text-[#F5A623]">
            Go to dashboard
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1a2b44]">Saved Cards</h3>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#4f6682]">{savedUniversities.length} saved</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {savedUniversities.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
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
                        onRemove(item.id);
                      }}
                      className="rounded-lg bg-[#fee2e2] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#b91c1c]"
                    >
                      Remove
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
            ) : null}
          </article>
        </section>
      )}
    </div>
  );
}
