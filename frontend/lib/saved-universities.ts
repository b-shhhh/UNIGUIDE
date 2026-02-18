import { removeSavedUniversity, saveUniversity, listSavedIds } from "./api/saved";

export const SAVED_UNIVERSITIES_UPDATE_EVENT = "saved-universities-update";

const STORAGE_KEY = "saved_university_ids";

const syncLocal = (ids: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(SAVED_UNIVERSITIES_UPDATE_EVENT));
};

export const fetchSavedUniversityIds = async (): Promise<string[]> => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as string[];
      } catch {
        // ignore parse error
      }
    }
  }
  const ids = await listSavedIds();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  return ids;
};

export const toggleUniversitySaved = async (id: string) => {
  const current = await fetchSavedUniversityIds();
  const isSaved = current.includes(id);
  let nextIds = current;
  if (isSaved) {
    const res = await removeSavedUniversity(id);
    nextIds = res.data || [];
  } else {
    const res = await saveUniversity(id);
    nextIds = res.data || [];
  }
  syncLocal(nextIds);
  return { ids: nextIds, saved: !isSaved };
};
