import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

const SAVED_UNIVERSITY_IDS_KEY = "uniguide_saved_university_ids";
const UPDATE_EVENT_NAME = "saved-universities-updated";
const SAVED_ENDPOINT = process.env.NEXT_PUBLIC_SAVED_UNIVERSITIES_ENDPOINT || API.SAVED_UNIVERSITY.LIST;

const dedupe = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));

const parseIdList = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return dedupe(
      payload
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (typeof item === "object" && item !== null) {
            const record = item as Record<string, unknown>;
            const rawId = record.universityId ?? record.id ?? record.university_id;
            return typeof rawId === "string" ? rawId : "";
          }
          return "";
        })
        .filter(Boolean),
    );
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;
    return parseIdList(record.data ?? record.savedUniversityIds ?? record.ids ?? record.items ?? []);
  }

  return [];
};

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
    return parseIdList(parsed);
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

const fetchRemoteSavedUniversityIds = async (): Promise<string[]> => {
  const response = await axios.get(SAVED_ENDPOINT);
  return parseIdList(response.data);
};

export const fetchSavedUniversityIds = async (): Promise<string[]> => {
  try {
    const ids = await fetchRemoteSavedUniversityIds();
    writeSavedUniversityIds(ids);
    return ids;
  } catch {
    return readSavedUniversityIds();
  }
};

export const saveUniversity = async (id: string): Promise<string[]> => {
  const cached = readSavedUniversityIds();
  const optimistic = dedupe([...cached, id]);
  writeSavedUniversityIds(optimistic);

  try {
    await axios.post(SAVED_ENDPOINT, { universityId: id });
    const ids = await fetchRemoteSavedUniversityIds();
    writeSavedUniversityIds(ids);
    return ids;
  } catch {
    try {
      await axios.put(API.SAVED_UNIVERSITY.ITEM(id), {});
      const ids = await fetchRemoteSavedUniversityIds();
      writeSavedUniversityIds(ids);
      return ids;
    } catch {
      return optimistic;
    }
  }
};

export const unsaveUniversity = async (id: string): Promise<string[]> => {
  const cached = readSavedUniversityIds();
  const optimistic = cached.filter((savedId) => savedId !== id);
  writeSavedUniversityIds(optimistic);

  try {
    await axios.delete(API.SAVED_UNIVERSITY.ITEM(id));
    const ids = await fetchRemoteSavedUniversityIds();
    writeSavedUniversityIds(ids);
    return ids;
  } catch {
    try {
      await axios.delete(SAVED_ENDPOINT, { data: { universityId: id } });
      const ids = await fetchRemoteSavedUniversityIds();
      writeSavedUniversityIds(ids);
      return ids;
    } catch {
      return optimistic;
    }
  }
};

export const toggleUniversitySaved = async (id: string) => {
  const current = readSavedUniversityIds();
  if (current.includes(id)) {
    const next = await unsaveUniversity(id);
    return { saved: false, ids: next };
  }

  const next = await saveUniversity(id);
  return { saved: true, ids: next };
};

export const SAVED_UNIVERSITIES_UPDATE_EVENT = UPDATE_EVENT_NAME;
