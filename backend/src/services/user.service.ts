import { IUser, User } from "../models/user.model";
import bcrypt from "bcrypt";
import {
  findUserById,
  updateUser,
  deleteUser
} from "../repositories/user.repository";

// -----------------------------
// Profile Services
// -----------------------------

// Get user profile
export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  return await findUserById(userId);
};

// Update user profile
export const updateProfile = async (userId: string, data: Partial<IUser>): Promise<IUser | null> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await updateUser(userId, data);
};

// Delete user account
export const deleteAccount = async (userId: string): Promise<IUser | null> => {
  return await deleteUser(userId);
};

// -----------------------------
// Saved Universities Services
// -----------------------------

// Save a university for a user
export const saveUniversityService = async (userId: string, universityId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (!universityId) throw new Error("University ID is required");

  user.savedUniversities = user.savedUniversities.map((id) => String(id));
  if (!user.savedUniversities.includes(universityId)) {
    user.savedUniversities.push(universityId);
    await user.save();
  }

  return user;
};

// Get saved universities for a user
export const getSavedUniversitiesService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return user.savedUniversities;
};

// Remove a saved university
export const removeSavedUniversityService = async (userId: string, universityId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.savedUniversities = user.savedUniversities
    .map((id) => String(id))
    .filter((id) => id !== universityId);

  await user.save();
  return user;
};
