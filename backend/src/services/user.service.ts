import { IUser, User } from "../models/user.model";
import { University } from "../models/university.model";
import mongoose from "mongoose";
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

  const uniExists = await University.findById(universityId);
  if (!uniExists) throw new Error("University not found");

  const uniObjectId = new mongoose.Types.ObjectId(universityId);
  if (!user.savedUniversities.includes(uniObjectId)) {
    user.savedUniversities.push(uniObjectId);
    await user.save();
  }

  return user;
};

// Get saved universities for a user
export const getSavedUniversitiesService = async (userId: string) => {
  const user = await User.findById(userId).populate("savedUniversities");
  if (!user) throw new Error("User not found");

  return user.savedUniversities;
};

// Remove a saved university
export const removeSavedUniversityService = async (userId: string, universityId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const uniObjectId = new mongoose.Types.ObjectId(universityId);
  user.savedUniversities = user.savedUniversities.filter(
    (id) => !id.equals(uniObjectId)
  );

  await user.save();
  return user;
};
