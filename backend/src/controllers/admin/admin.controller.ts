import { Response } from "express";
import { AuthRequest } from "../../types/user.type";
import { User } from "../../models/user.model";

export const adminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const admin = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogout = async (_req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Logout successful. Clear auth cookie/token on client." });
};

