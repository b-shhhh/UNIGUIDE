import { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import {
  findUserById,
  updateUser,
  deleteUser
} from "../repositories/user.repository";

export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  return await findUserById(userId);
};

export const updateProfile = async (userId: string, data: Partial<IUser>): Promise<IUser | null> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await updateUser(userId, data);
};

export const deleteAccount = async (userId: string): Promise<IUser | null> => {
  return await deleteUser(userId);
};
