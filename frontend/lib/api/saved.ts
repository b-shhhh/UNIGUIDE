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

export const listSavedIds = async () => {
  try {
    const response = await axios.get(API.SAVED_UNIVERSITY.LIST);
    const payload = response.data as ApiResult<string[]>;
    return payload.data || [];
  } catch {
    return [];
  }
};

export const saveUniversity = async (id: string) => {
  try {
    const response = await axios.post(API.SAVED_UNIVERSITY.LIST, { universityId: id });
    return response.data as ApiResult<string[]>;
  } catch (error) {
    return toError(error, "Failed to save university") as ApiResult<string[]>;
  }
};

export const removeSavedUniversity = async (id: string) => {
  try {
    const response = await axios.delete(API.SAVED_UNIVERSITY.ITEM(id));
    return response.data as ApiResult<string[]>;
  } catch (error) {
    return toError(error, "Failed to remove university") as ApiResult<string[]>;
  }
};
