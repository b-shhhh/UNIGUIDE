import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

const sanitizeUser = (user: any) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  profilePic: user.profilePic || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const listAdminUsers = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limit = Number(req.query.limit || 100);

    const filter = q
      ? {
          $or: [
            { firstName: { $regex: q, $options: "i" } },
            { lastName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(filter)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .limit(Math.max(1, Math.min(limit, 500)));

    res.status(200).json({ success: true, data: users.map(sanitizeUser) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: sanitizeUser(user) });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body || {};

    if (!firstName || !lastName || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "firstName, lastName, email, phone and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const created = await User.create({
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      phone: String(phone),
      password: hashedPassword
    });

    return res.status(201).json({ success: true, data: sanitizeUser(created) });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAdminUser = async (req: Request, res: Response) => {
  try {
    const updates: Record<string, unknown> = { ...req.body };

    if (typeof updates.password === "string" && updates.password.trim().length > 0) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: sanitizeUser(updated) });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
