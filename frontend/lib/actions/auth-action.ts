// server side processing
"use server"

import { redirect } from "next/navigation";
import { registerUser, loginUser, updateUserProfile, changePassword, deleteAccount, requestPasswordReset, resetPassword } from "../api/auth";
import { setUserData, setAuthToken, clearAuthCookies, getAuthToken, getUserData } from "../api/cookie";
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
      const tokenFromData =
        typeof result.data === "object" && result.data !== null && "token" in result.data
          ? (result.data as { token?: unknown }).token
          : undefined;
      const token = (typeof result.token === "string" && result.token) || (typeof tokenFromData === "string" ? tokenFromData : "");

      if (token) {
        await setAuthToken(token);
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

export const handleAdminLogin = async (
  formData: Record<string, unknown>
): Promise<LoginActionResult> => {
  try {
    const email = typeof formData.email === "string" ? formData.email.trim().toLowerCase() : "";
    if (email !== "admin@gmail.com") {
      return {
        success: false,
        message: "Only admin@gmail.com can login to admin.",
      };
    }

    const result = await loginUser({
      ...formData,
      email,
    });
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    const payload = (result.data ?? null) as Record<string, unknown> | null;
    const userFromPayload =
      payload && typeof payload === "object" && "user" in payload
        ? (payload.user as Record<string, unknown> | null)
        : null;
    const role =
      (userFromPayload && typeof userFromPayload.role === "string" ? userFromPayload.role : "") ||
      (payload && typeof payload.role === "string" ? payload.role : "");
    const emailFromPayload =
      (userFromPayload && typeof userFromPayload.email === "string" ? userFromPayload.email : "") ||
      (payload && typeof payload.email === "string" ? payload.email : "");

    if (emailFromPayload.trim().toLowerCase() !== "admin@gmail.com" && role !== "admin") {
      return {
        success: false,
        message: "Admin access required.",
      };
    }

    const tokenFromData =
      payload && typeof payload === "object" && "token" in payload
        ? (payload as { token?: unknown }).token
        : undefined;
    const token =
      (typeof result.token === "string" && result.token) ||
      (typeof tokenFromData === "string" ? tokenFromData : "");

    if (token) {
      await setAuthToken(token);
    }
    await setUserData(payload);

    return {
      success: true,
      message: "Admin login successful",
      data: payload,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Login failed"),
    };
  }
};

export const handleAdminLogout = async () => {
  await clearAuthCookies();
  return redirect("/admin/login");
};

export const handleDeleteAccount = async (payload: Record<string, unknown>) => {
  let shouldRedirect = false;
  try {
    const authToken = await getAuthToken();
    const userData = await getUserData<Record<string, unknown>>();
    const tokenFromUserData =
      userData && typeof userData === "object" && "token" in userData
        ? (userData as { token?: unknown }).token
        : undefined;
    const token = authToken || (typeof tokenFromUserData === "string" ? tokenFromUserData : null);
    const result = await deleteAccount(payload, token ?? undefined);
    if (result.success) {
      await clearAuthCookies();
      shouldRedirect = true;
    } else {
      return {
        success: false,
        message: result.message || "Delete account failed",
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Delete account failed"),
    };
  }

  if (shouldRedirect) {
    redirect("/?accountDeleted=1");
  }

  return {
    success: false,
    message: "Delete account failed",
  };
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
