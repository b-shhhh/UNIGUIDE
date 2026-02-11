// backend api call only
import axios from "./axios";
import { API } from "./endpoints";

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
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

export const registerUser = async (registerData: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Registration failed"));
  }
};

export const loginUser = async (loginData: Record<string, unknown>) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
};

// fetch the current logged-in user[particular set of user can only fetch]
export const fetchWhoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch whoami failed"));
  }
};

export const updateUserProfile = async (updateData: FormData) => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, updateData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update profile failed"));
  }
};

export const changePassword = async (passwordData: Record<string, unknown>) => {
  try {
    const response = await axios.put(API.AUTH.CHANGEPASSWORD, passwordData);
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Change password failed"));
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Request password reset failed"));
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword });
    return response.data as ApiResult;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Reset password failed"));
  }
};
