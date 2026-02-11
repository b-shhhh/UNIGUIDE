const SAVED_UNIVERSITY_IDS_KEY = "uniguide_saved_university_ids";
const UPDATE_EVENT_NAME = "saved-universities-updated";

const dedupe = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));

export const readSavedUniversityIds = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(SAVED_UNIVERSITY_IDS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return dedupe(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return [];
  }
};

const writeSavedUniversityIds = (ids: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const safeIds = dedupe(ids);
  localStorage.setItem(SAVED_UNIVERSITY_IDS_KEY, JSON.stringify(safeIds));
  window.dispatchEvent(new Event(UPDATE_EVENT_NAME));
};

export const isUniversitySaved = (id: string) => readSavedUniversityIds().includes(id);

export const saveUniversity = (id: string) => {
  const current = readSavedUniversityIds();
  writeSavedUniversityIds([...current, id]);
};

export const unsaveUniversity = (id: string) => {
  const current = readSavedUniversityIds();
  writeSavedUniversityIds(current.filter((savedId) => savedId !== id));
};

export const toggleUniversitySaved = (id: string) => {
  if (isUniversitySaved(id)) {
    unsaveUniversity(id);
    return false;
  }

  saveUniversity(id);
  return true;
};

export const SAVED_UNIVERSITIES_UPDATE_EVENT = UPDATE_EVENT_NAME;

