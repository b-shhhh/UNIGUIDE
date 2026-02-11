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

export const adminListUsers = async (query: { page?: number; limit?: number; search?: string } = {}) => {
  try {
    const response = await axios.get(API.ADMIN.USERS, { params: query });
    return response.data as ApiResult<Record<string, unknown>[]>;
  } catch (error: unknown) {
    return toError(error, "Failed to fetch users") as ApiResult<Record<string, unknown>[]>;
  }
};

export const adminGetUser = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER(id));
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toError(error, "Failed to fetch user") as ApiResult<Record<string, unknown>>;
  }
};

export const adminUpdateUser = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.USER(id), payload);
    return response.data as ApiResult<Record<string, unknown>>;
  } catch (error: unknown) {
    return toError(error, "Failed to update user") as ApiResult<Record<string, unknown>>;
  }
};

export const adminDeleteUser = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.USER(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    return toError(error, "Failed to delete user");
  }
};

