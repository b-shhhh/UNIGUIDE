import axios from "./axios";
import { API } from "./endpoints";

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    const msg = maybeResponse?.data?.message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

const toApiResultError = (error: unknown, fallback: string): ApiResult => ({
  success: false,
  message: extractErrorMessage(error, fallback),
});

export const adminProfile = async () => {
  try {
    const response = await axios.get(API.ADMIN.PROFILE);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch admin profile");
  }
};

export const adminLogout = async () => {
  try {
    const response = await axios.post(API.ADMIN.LOGOUT);
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to logout");
  }
};

export const listAdminUsers = async () => {
  try {
    const response = await axios.get(API.ADMIN.USERS);
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch users");
  }
};

export const getAdminUser = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER(id));
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch user");
  }
};

export const createAdminUser = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.USERS, payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to create user");
  }
};

export const updateAdminUser = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.USER(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to update user");
  }
};

export const deleteAdminUser = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.USER(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to delete user");
  }
};

export const listAdminUniversities = async () => {
  try {
    const response = await axios.get(API.ADMIN.UNIVERSITIES);
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch universities");
  }
};

export const createAdminUniversity = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.UNIVERSITIES, payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to create university");
  }
};

export const updateAdminUniversity = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.UNIVERSITY(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to update university");
  }
};

export const deleteAdminUniversity = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.UNIVERSITY(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to delete university");
  }
};

export const listAdminCourses = async () => {
  try {
    const response = await axios.get(API.ADMIN.COURSES);
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch courses");
  }
};

export const createAdminCourse = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.COURSES, payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to create course");
  }
};

export const updateAdminCourse = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.COURSE(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to update course");
  }
};

export const deleteAdminCourse = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.COURSE(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to delete course");
  }
};

export const listAdminCountries = async () => {
  try {
    const response = await axios.get(API.ADMIN.COUNTRIES);
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to fetch countries");
  }
};

export const createAdminCountry = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.COUNTRIES, payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to create country");
  }
};

export const updateAdminCountry = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.COUNTRY(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to update country");
  }
};

export const deleteAdminCountry = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.COUNTRY(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toApiResultError(error, "Failed to delete country");
  }
};

