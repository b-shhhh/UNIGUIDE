import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/user.model";

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires");
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, role, country, bio } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "fullName, email, phone, and password are required" });
    }

    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      country: country ? String(country).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
    });

    const safeUser = await User.findById(user._id).select("-password -resetPasswordToken -resetPasswordExpires");
    res.status(201).json({ success: true, data: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const updates: Record<string, unknown> = { ...req.body };
    if (typeof updates.password === "string" && updates.password.trim()) {
      updates.password = await bcrypt.hash(updates.password.trim(), 10);
    } else {
      delete updates.password;
    }

    if (typeof updates.email === "string") {
      updates.email = updates.email.trim().toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

