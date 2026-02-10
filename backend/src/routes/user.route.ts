// src/routes/user.route.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePic,
  deleteUser,
  logoutUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" }); // For profile pics

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

// Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/profile/password", authMiddleware, changePassword);
router.delete("/profile", authMiddleware, deleteUser);

// Upload profile picture
router.post("/profile/pic", authMiddleware, upload.single("avatar"), uploadProfilePic);

export default router;
