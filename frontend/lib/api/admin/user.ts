import axios from "../axios";
import { API } from "../endpoints";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    const apiMessage = maybeResponse?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage;
    }
  }

  return fallback;
};

export const getAdminUsers = async () => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ALL);
    return response.data as ApiResult<AdminUser[]>;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to fetch users"));
  }
};

export const getAdminUserById = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ONE(id));
    return response.data as ApiResult<AdminUser>;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to fetch user"));
  }
};

export const createAdminUser = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.ADMIN.USER.CREATE, payload);
    return response.data as ApiResult<AdminUser>;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to create user"));
  }
};

export const updateAdminUser = async (id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.ADMIN.USER.UPDATE(id), payload);
    return response.data as ApiResult<AdminUser>;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update user"));
  }
};

export const deleteAdminUser = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.USER.DELETE(id));
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to delete user"));
  }
};
