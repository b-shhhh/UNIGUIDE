"use client";

import { useEffect, useState } from "react";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  universityId: string;
};

export default function SaveUniversityButton({ universityId }: Props) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const isSaved = savedIds.includes(universityId);

  const onToggle = async () => {
    setLoading(true);
    const result = await toggleUniversitySaved(universityId);
    setSavedIds(result.ids);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] ${
        isSaved ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dbeafe] text-[#1d4ed8]"
      }`}
    >
      {isSaved ? "Unsave University" : "Save University"}
    </button>
  );
}

