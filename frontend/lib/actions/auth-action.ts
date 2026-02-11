// server side processing
"use server"

import { redirect } from "next/navigation";
import { registerUser, loginUser, updateUserProfile, changePassword, deleteAccount, requestPasswordReset, resetPassword } from "../api/auth";
import { setUserData, setAuthToken, clearAuthCookies, getAuthToken } from "../api/cookie";
import { revalidatePath } from "next/cache";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

type LoginActionResult =
  | {
      success: true;
      message: string;
      data: Record<string, unknown> | null;
    }
  | {
      success: false;
      message: string;
      data?: undefined;
    };

export const handleRegister = async (formData: Record<string, unknown>) => {
  try {
    const result = await registerUser(formData);
    if (result.success) {
      return {
        success: true,
        message: "Registration successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Registration failed"),
    };
  }
};

export const handleLogin = async (
  formData: Record<string, unknown>
): Promise<LoginActionResult> => {
  try {
    const result = await loginUser(formData);
    if (result.success) {
      if (result.token) {
        await setAuthToken(result.token);
      }
      await setUserData(result.data ?? null);

      return {
        success: true,
        message: "Login successful",
        data: (result.data ?? null) as Record<string, unknown> | null,
      };
    }
    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Login failed"),
    };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  return redirect("/login");
};

export async function handleUpdateProfile(profileData: FormData) {
  try {
    const result = await updateUserProfile(profileData);
    if (result.success) {
      await setUserData(result.data ?? null); // update cookie
      revalidatePath("/user/profile"); // revalidate profile page/ refresh new data
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return { success: false, message: result.message || "Failed to update profile" };
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "Failed to update profile") };
  }
}

export const handleChangePassword = async (formData: Record<string, unknown>) => {
  try {
    const oldPassword =
      (typeof formData.oldPassword === "string" && formData.oldPassword) ||
      (typeof formData.currentPassword === "string" && formData.currentPassword) ||
      "";
    const newPassword = (typeof formData.newPassword === "string" && formData.newPassword) || "";

    const result = await changePassword({ oldPassword, newPassword });

    if (result.success) {
      return {
        success: true,
        message: result.message || "Password changed successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Change password failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Change password failed"),
    };
  }
};

export const handleDeleteAccount = async (payload: Record<string, unknown>) => {
  try {
    const token = await getAuthToken();
    const result = await deleteAccount(payload, token);
    if (result.success) {
      await clearAuthCookies();
      redirect("/register");
    }
    return {
      success: false,
      message: result.message || "Delete account failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Delete account failed"),
    };
  }
};

export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return { success: false, message: response.message || "Request password reset failed" };
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "Request password reset action failed") };
  }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await resetPassword(token, newPassword);
    if (response.success) {
      return {
        success: true,
        message: "Password has been reset successfully",
      };
    }
    return { success: false, message: response.message || "Reset password failed" };
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "Reset password action failed") };
  }
};
