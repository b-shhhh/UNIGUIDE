// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { 
  registerUserService,
  loginUserService,
  logoutUserService,
  getUserProfileService,
  updateProfileService,
  changePasswordService,
  deleteUserService
} from "@/services/user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config";

// ----- AUTH -----
export const registerUser = async (req: Request, res: Response) => {
  const user = await registerUserService(req.body);
  res.status(201).json({ success: true, data: user });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginUserService(email, password); 
  res.status(200).json({ success: true, token });
};

export const logoutUser = async (_req: Request, res: Response) => {
  await logoutUserService(); // optional: clear token/cookies
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ----- PROFILE -----
export const getProfile = async (req: Request, res: Response) => {
  const user = await getUserProfileService(req.user.id);
  res.status(200).json({ success: true, data: user });
};

export const updateProfile = async (req: Request, res: Response) => {
  const updated = await updateProfileService(req.user.id, req.body);
  res.status(200).json({ success: true, data: updated });
};

export const changePassword = async (req: Request, res: Response) => {
  await changePasswordService(req.user.id, req.body);
  res.status(200).json({ success: true, message: "Password updated" });
};

// ----- PROFILE PIC -----
export const uploadProfilePic = async (req: Request, res: Response) => {
  const url = req.file?.path;
  res.status(200).json({ success: true, url });
};

// ----- DELETE USER -----
export const deleteUser = async (req: Request, res: Response) => {
  await deleteUserService(req.user.id);
  res.status(200).json({ success: true, message: "User deleted" });
};
