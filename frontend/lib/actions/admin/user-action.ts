"use server";

import {
  createAdminUser,
  deleteAdminUser,
  getAdminUserById,
  getAdminUsers,
  updateAdminUser
} from "@/lib/api/admin/user";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export const fetchAdminUsersAction = async () => {
  try {
    const result = await getAdminUsers();
    return { success: result.success, data: result.data ?? [], message: result.message };
  } catch (error) {
    return { success: false, data: [], message: getErrorMessage(error, "Failed to fetch users") };
  }
};

export const fetchAdminUserByIdAction = async (id: string) => {
  try {
    const result = await getAdminUserById(id);
    return { success: result.success, data: result.data ?? null, message: result.message };
  } catch (error) {
    return { success: false, data: null, message: getErrorMessage(error, "Failed to fetch user") };
  }
};

export const createAdminUserAction = async (payload: Record<string, unknown>) => {
  try {
    const result = await createAdminUser(payload);
    return { success: result.success, data: result.data ?? null, message: result.message };
  } catch (error) {
    return { success: false, data: null, message: getErrorMessage(error, "Failed to create user") };
  }
};

export const updateAdminUserAction = async (id: string, payload: Record<string, unknown>) => {
  try {
    const result = await updateAdminUser(id, payload);
    return { success: result.success, data: result.data ?? null, message: result.message };
  } catch (error) {
    return { success: false, data: null, message: getErrorMessage(error, "Failed to update user") };
  }
};

export const deleteAdminUserAction = async (id: string) => {
  try {
    const result = await deleteAdminUser(id);
    return { success: result.success, message: result.message || "User deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error, "Failed to delete user") };
  }
};
