import axios from "./axios";
import { API } from "./endpoints";

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

const toError = (error: unknown, fallback: string): ApiResult => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    const message = maybeResponse?.data?.message;
    if (typeof message === "string" && message.trim()) return { success: false, message };
  }
  if (error instanceof Error) return { success: false, message: error.message };
  return { success: false, message: fallback };
};

export const listCountries = async () => {
  try {
    const response = await axios.get(`${API.UNIVERSITIES}/countries`);
    return response.data as ApiResult<string[]>;
  } catch (error) {
    return toError(error, "Failed to fetch countries") as ApiResult<string[]>;
  }
};

export const listCourses = async () => {
  try {
    const response = await axios.get(`${API.UNIVERSITIES}/courses`);
    return response.data as ApiResult<string[]>;
  } catch (error) {
    return toError(error, "Failed to fetch courses") as ApiResult<string[]>;
  }
};

export const listCountriesByCourse = async (course: string) => {
  try {
    const response = await axios.get(`/api/courses/${encodeURIComponent(course)}/countries`);
    return response.data as ApiResult<string[]>;
  } catch (error) {
    return toError(error, "Failed to fetch countries for course") as ApiResult<string[]>;
  }
};

export const listUniversitiesByCountry = async (country: string) => {
  try {
    const response = await axios.get(`${API.UNIVERSITIES}/country/${encodeURIComponent(country)}`);
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error) {
    return toError(error, "Failed to fetch universities") as ApiResult<Record<string, unknown>[]>;
  }
};

export const getUniversity = async (id: string) => {
  try {
    const response = await axios.get(`${API.UNIVERSITIES}/${encodeURIComponent(id)}`);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error) {
    return toError(error, "Failed to fetch university") as ApiResult<Record<string, unknown>>;
  }
};

export const getUniversitiesByIds = async (ids: string[]) => {
  try {
    const response = await axios.get(`${API.UNIVERSITIES}/details/by-ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error) {
    return toError(error, "Failed to fetch universities") as ApiResult<Record<string, unknown>[]>;
  }
};
