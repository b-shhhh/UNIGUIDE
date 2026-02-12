import axios from "./axios";
import { API } from "./endpoints";

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const toError = (error: unknown, fallback: string): ApiResult => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    const message = maybeResponse?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return { success: false, message };
    }
  }
  if (error instanceof Error) {
    return { success: false, message: error.message || fallback };
  }
  return { success: false, message: fallback };
};

export const adminListUniversities = async (query: { page?: number; limit?: number; search?: string; country?: string } = {}) => {
  try {
    const response = await axios.get(API.ADMIN.UNIVERSITIES, { params: query });
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toError(error, "Failed to fetch universities") as ApiResult<Record<string, unknown>[]>;
  }
};

export const adminGetUniversity = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.UNIVERSITY(id));
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toError(error, "Failed to fetch university") as ApiResult<Record<string, unknown>>;
  }
};

export const adminCreateUniversity = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.UNIVERSITIES, payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toError(error, "Failed to create university") as ApiResult<Record<string, unknown>>;
  }
};

export const adminUpdateUniversity = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.UNIVERSITY(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toError(error, "Failed to update university") as ApiResult<Record<string, unknown>>;
  }
};

export const adminDeleteUniversity = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.UNIVERSITY(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toError(error, "Failed to delete university");
  }
};
