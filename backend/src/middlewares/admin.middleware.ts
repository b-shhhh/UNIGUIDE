import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/user.type";
import { User } from "../models/user.model";

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.user = { id: userId, role: "admin" };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to verify admin access" });
  }
};
